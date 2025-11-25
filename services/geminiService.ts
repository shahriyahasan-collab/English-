import { GoogleGenAI, Type, Modality, LiveServerMessage } from "@google/genai";
import { MistakeScope, AnalysisResult, PracticeResult } from "../types";

// Helper to ensure API Key exists
const getGenAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure you have selected a valid Google Cloud Project.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const fileToGenerativePart = async (file: File | Blob) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // Handle both data URL formats (with and without prefix)
      const base64String = result.includes(',') ? result.split(',')[1] : result;
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type || 'audio/wav', // Default to wav for blobs if type missing
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper to extract JSON from markdown code blocks if present
const extractJSON = (text: string) => {
  try {
    // 1. Try direct parse
    return JSON.parse(text);
  } catch (e) {
    // 2. Try extracting from ```json ... ``` or ``` ... ```
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    }
    // 3. Try finding the first { and last }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      return JSON.parse(text.substring(firstBrace, lastBrace + 1));
    }
    throw new Error("Could not parse JSON response");
  }
};

export const analyzeConversation = async (
  file: File,
  scope: MistakeScope
): Promise<AnalysisResult> => {
  // Using gemini-2.5-flash for fast, multimodal analysis
  const modelId = "gemini-2.5-flash"; 
  const genAI = getGenAI();
  
  const mediaPart = await fileToGenerativePart(file);

  const scopeInstruction =
    scope === MistakeScope.ME_ONLY
      ? "For grammar analysis, ONLY identify mistakes made by the speaker identified as 'Me' (the learner). Ignore mistakes by the 'Stranger' (the fluent speaker/interviewer)."
      : "For grammar analysis, identify mistakes made by BOTH speakers.";

  const prompt = `
    You are an expert English language coach helping a learner improve their conversation skills.
    
    Analyze the attached audio/video.
    
    STEP 1: VALIDITY CHECK
    - Listen to the audio first.
    - Is there a human conversation in English?
    - If the audio is silent, only music, unintelligible noise, or not English, return a JSON with an empty transcript and a summary stating: "No valid English conversation detected."
    
    STEP 2: SPEAKER IDENTIFICATION
    - Identify two speakers: 'Me' (the learner/user, usually likely to have an accent or make mistakes) and 'Stranger' (the other person).
    - If you cannot distinguish roles (e.g., only one person speaking in a practice session), assume the single speaker is 'Me'.

    STEP 3: TRANSCRIPT & ANALYSIS
    For EACH dialogue turn, provide:
    1. The Speaker ('Me' or 'Stranger').
    2. The exact Text spoken.
    3. Estimated Start and End timestamps (in seconds).
    
    4. Grammar Check: ${scopeInstruction} 
       - Detect ALL errors (articles, prepositions, tenses, agreement, phrasing).
       - If the sentence is not perfect standard English, mark it as a mistake.
       - Provide the specific substring, the correction, the FULL corrected sentence, and an explanation.
    
    5. Suggestion Check: 
       - If the speaker is 'Me', ALWAYS provide a 'Better Response' suggestion (unless it's just "Yes"/"No").
       - The better response should be more natural, professional, or native-sounding.

    Return the output strictly in JSON format matching the schema provided.
  `;

  const response = await genAI.models.generateContent({
    model: modelId,
    contents: {
      parts: [mediaPart, { text: prompt }],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "A brief summary of the conversation context." },
          transcript: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER, description: "Sequence number" },
                speaker: { type: Type.STRING, enum: ["Me", "Stranger"] },
                text: { type: Type.STRING, description: "The text spoken" },
                startTime: { type: Type.NUMBER, description: "Start time in seconds" },
                endTime: { type: Type.NUMBER, description: "End time in seconds" },
                grammar: {
                  type: Type.OBJECT,
                  nullable: true,
                  properties: {
                    hasMistake: { type: Type.BOOLEAN },
                    originalSubstring: { type: Type.STRING, description: "The specific part of the sentence that is wrong" },
                    correction: { type: Type.STRING, description: "The corrected version of that substring" },
                    fullCorrectedSentence: { type: Type.STRING, description: "The entire sentence rewritten correctly" },
                    explanation: { type: Type.STRING, description: "Why it is wrong" }
                  },
                  required: ["hasMistake", "originalSubstring", "correction", "fullCorrectedSentence", "explanation"]
                },
                suggestion: {
                  type: Type.OBJECT,
                  nullable: true,
                  properties: {
                    hasSuggestion: { type: Type.BOOLEAN },
                    suggestedResponse: { type: Type.STRING, description: "A better full sentence response" },
                    reasoning: { type: Type.STRING, description: "Why this is better" }
                  },
                  required: ["hasSuggestion", "suggestedResponse", "reasoning"]
                }
              },
              required: ["id", "speaker", "text", "startTime", "endTime"]
            }
          }
        },
        required: ["summary", "transcript"],
      },
    },
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("No response received from Gemini.");
  }

  return extractJSON(resultText) as AnalysisResult;
};

/**
 * Generates audio from text using Gemini TTS.
 * Returns the raw PCM audio buffer as base64 string.
 */
export const generateSpeech = async (text: string): Promise<string | undefined> => {
  const genAI = getGenAI();
  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

/**
 * Analyzes a user's recorded practice attempt against a target sentence.
 */
export const evaluatePracticeAttempt = async (
  audioBlob: Blob,
  targetSentence: string
): Promise<PracticeResult> => {
  const genAI = getGenAI();
  const audioPart = await fileToGenerativePart(audioBlob);
  
  const prompt = `
    The user is practicing English pronunciation.
    Target Sentence: "${targetSentence}"
    
    Listen to the user's recording.
    1. Transcribe EXACTLY what the user said.
    2. Did they say the target sentence correctly? (Ignore minor accent differences, focus on clarity and correct words).
    3. If they made a mistake, explain what was wrong (e.g., missed a word, wrong pronunciation of specific word).
    
    Return JSON.
  `;

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [audioPart, { text: prompt }],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isCorrect: { type: Type.BOOLEAN },
          feedback: { type: Type.STRING },
          transcribedText: { type: Type.STRING, description: "What the user actually said" }
        },
        required: ["isCorrect", "feedback", "transcribedText"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No analysis received.");
  return extractJSON(text) as PracticeResult;
};

// --- Live API Helpers ---

function floatTo16BitPCM(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return output;
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Resamples audio data to 16kHz using linear interpolation.
 */
function resampleTo16k(audioData: Float32Array, origSampleRate: number): Float32Array {
  const targetSampleRate = 16000;
  if (origSampleRate === targetSampleRate) return audioData;

  const ratio = origSampleRate / targetSampleRate;
  const newLength = Math.round(audioData.length / ratio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const index = i * ratio;
    const floorIndex = Math.floor(index);
    const ceilIndex = Math.min(Math.ceil(index), audioData.length - 1);
    const weight = index - floorIndex;
    
    // Linear interpolation
    result[i] = audioData[floorIndex] * (1 - weight) + audioData[ceilIndex] * weight;
  }
  return result;
}

type TranscriptionCallback = (speaker: 'Me' | 'AI', text: string) => void;

export class LiveSession {
  private inputAudioContext: AudioContext;
  private outputAudioContext: AudioContext;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private processor: ScriptProcessorNode | null = null;
  private nextStartTime = 0;
  private activeSources = new Set<AudioBufferSourceNode>();
  private sessionPromise: Promise<any> | null = null;
  private onTranscription: TranscriptionCallback | null = null;

  constructor() {
    // FIX: Do not enforce sampleRate. Let the browser match hardware to prevent "NotSupportedError"
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async connect(systemInstruction: string, mediaStream: MediaStream, onTranscription?: TranscriptionCallback) {
    const genAI = getGenAI(); // Get fresh instance
    this.onTranscription = onTranscription || null;

    if (this.inputAudioContext.state === 'suspended') {
      await this.inputAudioContext.resume();
    }
    if (this.outputAudioContext.state === 'suspended') {
      await this.outputAudioContext.resume();
    }

    this.sessionPromise = genAI.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      config: {
        responseModalities: [Modality.AUDIO],
        // Speech config is required for proper audio generation settings in some contexts
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
        },
        // Strictly format system instruction as a Part to avoid service errors
        systemInstruction: { parts: [{ text: systemInstruction }] },
        inputAudioTranscription: {}, // Request transcription of user input
        outputAudioTranscription: {}, // Request transcription of model output
      },
      callbacks: {
        onopen: () => {
          console.log("Live session connected");
          this.startAudioInput(mediaStream);
        },
        onmessage: (message: LiveServerMessage) => {
          this.handleMessage(message);
        },
        onclose: () => console.log("Live session closed"),
        onerror: (err) => {
          console.error("Live session error", err);
        },
      }
    });

    await this.sessionPromise;
  }

  private startAudioInput(stream: MediaStream) {
    this.inputSource = this.inputAudioContext.createMediaStreamSource(stream);
    this.processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      
      // FIX: Manually resample input from System Rate (e.g. 48000) to API Rate (16000)
      const downsampledData = resampleTo16k(inputData, this.inputAudioContext.sampleRate);
      
      const pcmData = floatTo16BitPCM(downsampledData);
      
      // Convert to base64
      let binary = '';
      const bytes = new Uint8Array(pcmData.buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      if (this.sessionPromise) {
        this.sessionPromise.then(session => {
          session.sendRealtimeInput({
            media: {
              mimeType: "audio/pcm;rate=16000",
              data: base64
            }
          });
        }).catch(err => console.error("Error sending input:", err));
      }
    };

    this.inputSource.connect(this.processor);
    this.processor.connect(this.inputAudioContext.destination);
  }

  private async handleMessage(message: LiveServerMessage) {
    // 1. Handle Audio
    const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (audioData) {
      try {
        const bytes = base64ToUint8Array(audioData);
        const dataInt16 = new Int16Array(bytes.buffer);
        
        // Gemini returns 24000Hz audio. We create a buffer stating this rate.
        // The AudioContext (running at system rate, e.g. 48000Hz) handles playback resampling automatically.
        const buffer = this.outputAudioContext.createBuffer(1, dataInt16.length, 24000);
        const channelData = buffer.getChannelData(0);
        for (let i = 0; i < dataInt16.length; i++) {
          channelData[i] = dataInt16[i] / 32768.0;
        }

        const source = this.outputAudioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.outputAudioContext.destination);
        
        // Schedule playback
        const currentTime = this.outputAudioContext.currentTime;
        const startTime = Math.max(currentTime, this.nextStartTime);
        source.start(startTime);
        this.nextStartTime = startTime + buffer.duration;
        
        this.activeSources.add(source);
        source.onended = () => this.activeSources.delete(source);

      } catch (e) {
        console.error("Error processing audio message", e);
      }
    }

    // 2. Handle Transcription
    // Input (User)
    const inputTranscript = message.serverContent?.inputTranscription?.text;
    if (inputTranscript && this.onTranscription) {
      this.onTranscription('Me', inputTranscript);
    }
    // Output (AI)
    const outputTranscript = message.serverContent?.outputTranscription?.text;
    if (outputTranscript && this.onTranscription) {
      this.onTranscription('AI', outputTranscript);
    }

    // 3. Handle Interruptions
    if (message.serverContent?.interrupted) {
      this.activeSources.forEach(source => source.stop());
      this.activeSources.clear();
      this.nextStartTime = 0;
    }
  }

  disconnect() {
    this.processor?.disconnect();
    this.inputSource?.disconnect();
    this.activeSources.forEach(s => s.stop());
  }
}