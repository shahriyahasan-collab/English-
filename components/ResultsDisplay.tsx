import React, { useState, useRef, useEffect } from 'react';
import { AnalysisResult, TranscriptItem, PracticeResult } from '../types';
import { generateSpeech, evaluatePracticeAttempt } from '../services/geminiService';
import { 
  MessageCircle, 
  Pause, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Volume2,
  Mic,
  Square,
  Loader2,
  XCircle,
  Play,
  RotateCcw
} from 'lucide-react';

interface ResultsDisplayProps {
  result: AnalysisResult;
  mediaFile: File;
}

// Helper to decode base64 audio from Gemini TTS
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, mediaFile }) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [activeGrammarId, setActiveGrammarId] = useState<number | null>(null);
  const [activeSuggestionId, setActiveSuggestionId] = useState<number | null>(null);
  
  // Playback state for original audio
  const [isPlaying, setIsPlaying] = useState<number | null>(null); 
  
  // TTS state
  const [isPlayingTTS, setIsPlayingTTS] = useState<boolean>(false);
  const [ttsLoadingId, setTtsLoadingId] = useState<string | null>(null); // composite key "id-type"

  // Practice/Recording state
  const [recordingId, setRecordingId] = useState<string | null>(null); // "id-type"
  const [isEvaluating, setIsEvaluating] = useState<string | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<Record<string, PracticeResult>>({});
  const [practiceAudioUrls, setPracticeAudioUrls] = useState<Record<string, string>>({});
  const [playingPracticeId, setPlayingPracticeId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const practiceAudioRef = useRef<HTMLAudioElement>(new Audio());
  const endPlayTimeRef = useRef<number>(0);
  
  // Recording refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (mediaFile) {
      const url = URL.createObjectURL(mediaFile);
      setMediaUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [mediaFile]);

  // --- Original Audio Playback ---
  const handlePlaySegment = (item: TranscriptItem) => {
    if (!audioRef.current) return;
    if (isPlaying === item.id) {
      audioRef.current.pause();
      setIsPlaying(null);
      return;
    }
    audioRef.current.currentTime = item.startTime;
    endPlayTimeRef.current = item.endTime;
    audioRef.current.play();
    setIsPlaying(item.id);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current || !isPlaying) return;
    if (audioRef.current.currentTime >= endPlayTimeRef.current) {
      audioRef.current.pause();
      setIsPlaying(null);
    }
  };

  // --- AI TTS Playback ---
  const playAiVoice = async (text: string, uniqueId: string) => {
    if (isPlayingTTS) return;
    setTtsLoadingId(uniqueId);
    try {
      const base64Audio = await generateSpeech(text);
      if (!base64Audio) throw new Error("No audio generated");

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        audioCtx,
        24000,
        1
      );
      
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.onended = () => setIsPlayingTTS(false);
      
      setTtsLoadingId(null);
      setIsPlayingTTS(true);
      source.start();
    } catch (e) {
      console.error("TTS Error", e);
      setTtsLoadingId(null);
      setIsPlayingTTS(false);
    }
  };

  // --- Practice Recording ---
  const startRecording = async (uniqueId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setRecordingId(uniqueId);
      
      // Clear previous state for this item
      setPracticeFeedback(prev => {
        const next = { ...prev };
        delete next[uniqueId];
        return next;
      });
      setPracticeAudioUrls(prev => {
         // We can keep old URL or clear it. Let's clear it to avoid confusion.
         if (prev[uniqueId]) URL.revokeObjectURL(prev[uniqueId]);
         const next = { ...prev };
         delete next[uniqueId];
         return next;
      });

    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Microphone access is required to practice.");
    }
  };

  const stopRecordingAndEvaluate = (uniqueId: string, targetText: string) => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(blob);
      
      setRecordingId(null);
      setPracticeAudioUrls(prev => ({ ...prev, [uniqueId]: audioUrl }));
      setIsEvaluating(uniqueId);

      try {
        const result = await evaluatePracticeAttempt(blob, targetText);
        setPracticeFeedback(prev => ({ ...prev, [uniqueId]: result }));
      } catch (err) {
        console.error("Evaluation failed", err);
      } finally {
        setIsEvaluating(null);
      }
      
      // Stop all tracks
      mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorderRef.current.stop();
  };

  const toggleRecording = (uniqueId: string, targetText: string) => {
    if (recordingId === uniqueId) {
      stopRecordingAndEvaluate(uniqueId, targetText);
    } else {
      startRecording(uniqueId);
    }
  };

  const playPracticeAudio = (uniqueId: string) => {
    const url = practiceAudioUrls[uniqueId];
    if (!url) return;

    if (playingPracticeId === uniqueId) {
        practiceAudioRef.current.pause();
        setPlayingPracticeId(null);
        return;
    }

    practiceAudioRef.current.src = url;
    practiceAudioRef.current.onended = () => setPlayingPracticeId(null);
    practiceAudioRef.current.play();
    setPlayingPracticeId(uniqueId);
  };

  const toggleGrammar = (id: number) => setActiveGrammarId(activeGrammarId === id ? null : id);
  const toggleSuggestion = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setActiveSuggestionId(activeSuggestionId === id ? null : id);
  };

  const renderGrammarText = (item: TranscriptItem) => {
    if (!item.grammar || !item.grammar.hasMistake) return item.text;
    const { originalSubstring, correction } = item.grammar;
    
    // A safer replacement approach that handles multiple occurrences or case sensitivity better could be added here
    // For now, basic split/join is used as per previous logic but with checks
    if (item.text.includes(originalSubstring)) {
        const parts = item.text.split(originalSubstring);
        return (
            <span>
                {parts[0]}
                <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 line-through decoration-red-500 px-1 rounded mx-0.5">{originalSubstring}</span>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-bold px-1 rounded mx-0.5">[{correction}]</span>
                {parts.slice(1).join(originalSubstring)}
            </span>
        );
    }
    // Fallback if strict substring match fails
    return (
        <span>
            {item.text} <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-bold px-1 rounded ml-1">[{correction}]</span>
        </span>
    );
  };

  // Reusable Practice Panel
  const renderPracticePanel = (uniqueId: string, targetText: string, context: 'grammar' | 'suggestion') => {
      const isRecording = recordingId === uniqueId;
      const isProcessing = isEvaluating === uniqueId;
      const result = practiceFeedback[uniqueId];
      const hasAudio = !!practiceAudioUrls[uniqueId];

      const colorClass = context === 'grammar' ? 'text-red-600' : 'text-purple-600';
      const bgClass = context === 'grammar' ? 'bg-red-50 dark:bg-red-900/20' : 'bg-purple-50 dark:bg-purple-900/20';
      const borderClass = context === 'grammar' ? 'border-red-200 dark:border-red-800' : 'border-purple-200 dark:border-purple-800';

      return (
        <div className={`mt-4 rounded-xl border ${borderClass} overflow-hidden animate-fade-in`}>
            <div className={`px-4 py-2 ${bgClass} border-b ${borderClass} flex items-center justify-between`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>Speaking Lab</span>
                {hasAudio && !isRecording && !isProcessing && (
                    <button 
                        onClick={() => playPracticeAudio(uniqueId)}
                        className={`text-xs flex items-center gap-1 font-medium hover:underline ${colorClass}`}
                    >
                        {playingPracticeId === uniqueId ? <Pause size={12}/> : <Play size={12}/>}
                        Hear My Recording
                    </button>
                )}
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800">
                 {/* States */}
                 {isProcessing ? (
                     <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                         <Loader2 size={32} className={`animate-spin ${colorClass}`} />
                         <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Analyzing your pronunciation...</p>
                         <p className="text-xs text-gray-400">Transcribing your speech to check accuracy</p>
                     </div>
                 ) : result ? (
                     <div className="space-y-3 animate-fade-in">
                         <div className={`flex items-start gap-3 p-3 rounded-lg ${result.isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-orange-50 dark:bg-orange-900/20'}`}>
                             {result.isCorrect 
                                ? <CheckCircle2 size={20} className="text-green-600 mt-0.5" /> 
                                : <XCircle size={20} className="text-orange-600 mt-0.5" />
                             }
                             <div className="flex-1 text-sm">
                                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                    <span className={`font-bold ${result.isCorrect ? 'text-green-700 dark:text-green-400' : 'text-orange-700 dark:text-orange-400'}`}>
                                        {result.isCorrect ? 'Excellent Pronunciation!' : 'Needs Improvement'}
                                    </span>
                                    <button 
                                        onClick={() => toggleRecording(uniqueId, targetText)}
                                        className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <RotateCcw size={12} /> Try Again
                                    </button>
                                 </div>
                                 
                                 <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                                     {result.feedback}
                                 </p>

                                 <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 gap-2 text-xs">
                                     <div>
                                         <span className="text-gray-400 uppercase font-semibold mr-2">Goal:</span>
                                         <span className="text-gray-800 dark:text-gray-200 font-medium italic">"{targetText}"</span>
                                     </div>
                                     <div>
                                         <span className="text-gray-400 uppercase font-semibold mr-2">You said:</span>
                                         <span className={`font-medium italic ${result.isCorrect ? 'text-gray-800 dark:text-gray-200' : 'text-orange-700 dark:text-orange-300'}`}>
                                            "{result.transcribedText}"
                                         </span>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 ) : (
                     // Default / Recording State
                     <div className="flex flex-col items-center justify-center py-2">
                         {isRecording ? (
                             <div className="text-center space-y-4">
                                 <div className="relative inline-flex items-center justify-center">
                                    <span className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-12 w-12 bg-red-500 items-center justify-center text-white">
                                        <Mic size={24} />
                                    </span>
                                 </div>
                                 <div className="space-y-1">
                                     <p className="font-medium text-red-600">Recording...</p>
                                     <p className="text-xs text-gray-500">Say the sentence clearly</p>
                                 </div>
                                 <button 
                                    onClick={() => toggleRecording(uniqueId, targetText)}
                                    className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium text-sm transition-colors shadow-md"
                                 >
                                     Stop & Check
                                 </button>
                             </div>
                         ) : (
                             <div className="text-center w-full">
                                 <p className="text-sm text-gray-500 mb-4">Record yourself saying this sentence to get AI feedback on accuracy.</p>
                                 <button 
                                    onClick={() => toggleRecording(uniqueId, targetText)}
                                    className={`w-full sm:w-auto px-6 py-3 border-2 border-dashed rounded-xl flex items-center justify-center gap-2 font-medium transition-all
                                        ${context === 'grammar' 
                                            ? 'border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300' 
                                            : 'border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300'
                                        }
                                    `}
                                 >
                                     <Mic size={18} />
                                     Start Practice Recording
                                 </button>
                             </div>
                         )}
                     </div>
                 )}
            </div>
        </div>
      )
  }

  return (
    <div className="space-y-8 animate-fade-in-up pb-20">
      
      {mediaUrl && (
        <audio 
          ref={audioRef} 
          src={mediaUrl} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setIsPlaying(null)}
        />
      )}

      <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg text-indigo-600 dark:text-indigo-400">
            <MessageCircle size={24} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Conversation Analysis</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{result.summary}</p>
      </section>

      <div className="space-y-8 px-2">
        {result.transcript.map((item) => {
          const isMe = item.speaker === 'Me';
          const hasMistake = item.grammar?.hasMistake;
          const hasSuggestion = item.suggestion?.hasSuggestion;
          const isGrammarActive = activeGrammarId === item.id;
          const isSuggestionActive = activeSuggestionId === item.id;

          const grammarId = `${item.id}-grammar`;
          const suggestionId = `${item.id}-suggestion`;
          
          return (
            <div key={item.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                
              <div className={`flex items-end gap-3 max-w-[95%] md:max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm
                    ${isMe ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                    {isMe ? 'ME' : 'S'}
                </div>

                <div className="flex flex-col gap-2 w-full">
                    <div 
                      onClick={() => toggleGrammar(item.id)}
                      className={`
                        group relative p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 w-full
                        ${isMe 
                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800 text-gray-900 dark:text-white rounded-br-none' 
                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                        }
                        ${isGrammarActive ? 'ring-2 ring-indigo-200 dark:ring-indigo-800 shadow-md' : 'shadow-sm hover:shadow-md'}
                        ${hasMistake ? 'border-l-4 border-l-red-400 dark:border-l-red-500' : ''} 
                      `}
                    >
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePlaySegment(item);
                            }}
                            className={`
                                absolute -top-3 ${isMe ? '-left-2' : '-right-2'} 
                                w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110 z-10
                                ${isPlaying === item.id 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border border-gray-100 dark:border-gray-600'
                                }
                            `}
                        >
                            {isPlaying === item.id ? <Pause size={12} /> : <Volume2 size={14} />}
                        </button>

                        <div className="text-base leading-relaxed pr-6">
                            {isGrammarActive && hasMistake ? renderGrammarText(item) : item.text}
                        </div>

                        {hasMistake && !isGrammarActive && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-red-500 dark:text-red-400">
                                <AlertCircle size={12} />
                                <span>Grammar error detected (Click to view)</span>
                            </div>
                        )}
                    </div>

                    {isMe && (
                        <div className="flex items-center justify-end gap-2 px-1">
                             {hasSuggestion && (
                                 <button 
                                    onClick={(e) => toggleSuggestion(e, item.id)}
                                    className={`
                                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shadow-sm
                                        ${isSuggestionActive 
                                            ? 'bg-purple-600 text-white border-purple-600' 
                                            : 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900 hover:bg-purple-50 dark:hover:bg-purple-900/30'
                                        }
                                    `}
                                 >
                                     <Sparkles size={12} />
                                     {isSuggestionActive ? 'Hide Suggestion' : 'Better Answer'}
                                 </button>
                             )}
                        </div>
                    )}
                </div>
              </div>

              <div className={`w-full max-w-[95%] md:max-w-[85%] space-y-2 mt-2 ${isMe ? 'pr-11' : 'pl-11'}`}>
                  
                  {/* GRAMMAR PANEL */}
                  {isGrammarActive && hasMistake && item.grammar && (
                      <div className="animate-fade-in bg-red-50 dark:bg-red-900/10 rounded-xl p-5 border border-red-100 dark:border-red-900/30 text-sm shadow-inner">
                          <div className="flex items-start gap-3">
                              <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-red-500 mt-0.5">
                                  <AlertCircle size={18} />
                              </div>
                              <div className="flex-1">
                                  <p className="font-bold text-red-900 dark:text-red-200 mb-1 text-base">Grammar Issue</p>
                                  <p className="text-gray-800 dark:text-gray-300 mb-4 leading-relaxed">{item.grammar.explanation}</p>
                                  
                                  {/* Full Corrected Sentence */}
                                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-100 dark:border-red-900/30 mb-4 shadow-sm">
                                      <div className="flex justify-between items-start mb-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Correct Sentence</p>
                                        <button 
                                            onClick={() => playAiVoice(item.grammar!.fullCorrectedSentence, grammarId)}
                                            disabled={ttsLoadingId !== null}
                                            className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium text-xs transition-colors"
                                        >
                                            {ttsLoadingId === grammarId ? <Loader2 size={12} className="animate-spin" /> : <Volume2 size={12} />}
                                            Hear AI Pronunciation
                                        </button>
                                      </div>
                                      <p className="text-green-700 dark:text-green-400 font-medium text-lg leading-relaxed">{item.grammar.fullCorrectedSentence}</p>
                                  </div>

                                  {/* Practice Section */}
                                  {renderPracticePanel(grammarId, item.grammar.fullCorrectedSentence, 'grammar')}
                              </div>
                          </div>
                      </div>
                  )}
                  
                  {/* SUGGESTION PANEL */}
                  {isSuggestionActive && hasSuggestion && item.suggestion && (
                      <div className="animate-fade-in bg-gradient-to-r from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800 rounded-xl p-5 border border-purple-100 dark:border-purple-900/30 text-sm shadow-lg ring-1 ring-purple-50 dark:ring-purple-900/20">
                          <div className="flex items-start gap-3">
                              <div className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-sm text-purple-600 dark:text-purple-400 mt-0.5">
                                  <Sparkles size={18} />
                              </div>
                              <div className="flex-1">
                                  <p className="font-bold text-purple-900 dark:text-purple-200 mb-2 text-base">Better Answer Suggestion</p>
                                  
                                  <div className="mb-4 relative">
                                      <p className="text-xl text-gray-900 dark:text-white font-medium leading-relaxed font-serif italic relative z-10">
                                          "{item.suggestion.suggestedResponse}"
                                      </p>
                                      <div className="absolute -top-2 -left-2 text-6xl text-purple-200 dark:text-purple-900/30 font-serif select-none z-0">"</div>
                                  </div>

                                  <div className="flex items-center justify-between mb-4">
                                      <button 
                                            onClick={() => playAiVoice(item.suggestion!.suggestedResponse, suggestionId)}
                                            disabled={ttsLoadingId !== null}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-600 text-purple-700 dark:text-purple-300 font-medium text-xs transition-colors"
                                        >
                                            {ttsLoadingId === suggestionId ? <Loader2 size={14} className="animate-spin" /> : <Volume2 size={14} />}
                                            Hear AI Version
                                        </button>
                                  </div>
                                  
                                  <div className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg border border-purple-50/50 dark:border-purple-900/20 mb-4">
                                      <span className="font-semibold text-purple-800 dark:text-purple-300 text-xs uppercase tracking-wider">Why is this better?</span>
                                      <p className="text-gray-600 dark:text-gray-400 mt-1">{item.suggestion.reasoning}</p>
                                  </div>

                                  {/* Practice Section */}
                                  {renderPracticePanel(suggestionId, item.suggestion.suggestedResponse, 'suggestion')}

                              </div>
                          </div>
                      </div>
                  )}
              </div>

            </div>
          );
        })}
      </div>

      <div className="text-center text-gray-400 text-sm pt-10 pb-4">
        <p>Tap your messages to check grammar • Use the 'Better Answer' button for coaching</p>
      </div>
    </div>
  );
};