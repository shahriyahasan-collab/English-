
import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Trophy, 
  CheckSquare, 
  ChevronDown, 
  ChevronUp, 
  Users,
  X,
  Target,
  Medal,
  Zap,
  CheckCircle2,
  ArrowRight,
  StopCircle,
  Loader2,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Radio,
  Bot,
  User,
  Square,
  Mic,
  TrendingUp,
  Clock
} from 'lucide-react';
import { coursesData, phasesData, rolePlayData, rolePlayWeeks } from '../data/mockData';
import { RolePlayDay, MistakeScope, AnalysisState } from '../types';
import { analyzeConversation, LiveSession } from '../services/geminiService';
import { ResultsDisplay } from './ResultsDisplay';

interface DashboardProps {
  activeView: string;
  onNavigate: (view: any) => void;
}

// --- Sub-Components ---

const OverviewView: React.FC<{ completedDays: number[], onNavigate: (view: string) => void }> = ({ completedDays, onNavigate }) => {
  const progressPercentage = Math.round((completedDays.length / 30) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-teal-50 dark:bg-teal-900/20 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 rounded-2xl">
                <Calendar size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Timeline</span>
            </div>
            <p className="text-4xl font-serif font-bold text-charcoal dark:text-white mb-1">Week {Math.ceil((completedDays.length + 1) / 7)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Foundation Phase</p>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 group relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 bg-purple-50 dark:bg-purple-900/20 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
           <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-2xl">
                <CheckSquare size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Consistency</span>
            </div>
            <p className="text-4xl font-serif font-bold text-charcoal dark:text-white mb-1">
              {completedDays.length} <span className="text-xl text-gray-400 font-sans font-normal">/ 30</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Days Completed</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 bg-orange-50 dark:bg-orange-900/20 rounded-bl-[100px] transition-transform group-hover:scale-110"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Growth</span>
            </div>
            <div className="flex items-end gap-2 mb-2">
               <p className="text-4xl font-serif font-bold text-charcoal dark:text-white">{progressPercentage}%</p>
               <span className="text-sm text-teal-500 font-bold mb-1.5">{progressPercentage > 0 ? '+2% today' : 'Start now'}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-br from-charcoal to-gray-900 dark:from-black dark:to-gray-900 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-gray-900/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-3">
             <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
             <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Next Session</span>
          </div>
          <h2 className="text-3xl font-serif font-bold mb-3">Ready to practice?</h2>
          <p className="text-gray-400 text-lg leading-relaxed">Continue your 30-day journey with Day {completedDays.length + 1}. Focus on mastering real-world conversation.</p>
        </div>
        <button 
          onClick={() => onNavigate('Role-Play')}
          className="relative z-10 px-8 py-4 bg-teal-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-900/50 hover:bg-teal-400 hover:scale-105 transition-all flex items-center gap-2"
        >
          <Mic size={20} />
          Start Practice
        </button>
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-teal-500/20 transition-colors duration-500"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
      </div>
    </div>
  );
};

const CoursesView: React.FC = () => {
  const [filter, setFilter] = useState('All');
  
  const filteredCourses = coursesData.filter(c => {
    if (filter === 'All') return true;
    return c.category === filter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-3xl font-serif font-bold text-charcoal dark:text-white">Curated Resources</h2>
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
          {['All', 'Must Buy', 'Recommended'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                filter === f 
                  ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 flex flex-col h-full group">
            <div className="flex justify-between items-start mb-6">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider ${
                course.category === 'Must Buy' ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300' : 'bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {course.category}
              </span>
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-600">{course.cost}</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-charcoal dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{course.name}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 flex-grow leading-relaxed">{course.verdict}</p>
            
            <div className="pt-6 border-t border-gray-50 dark:border-gray-700 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Rank</span>
                <span className="font-bold text-charcoal dark:text-white text-lg">#{course.priority}</span>
              </div>
              <div className="text-right">
                 <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">Focus Score</span>
                 <div className="flex items-center justify-end gap-1">
                    <span className="font-bold text-teal-500 text-lg">{course.speakingFocus}</span>
                    <span className="text-gray-300 text-sm">/10</span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RoadmapView: React.FC = () => {
  const [openPhase, setOpenPhase] = useState<string | null>('phase1');

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-3xl font-serif font-bold text-charcoal dark:text-white mb-6">Your 12-Week Roadmap</h2>
      <div className="space-y-4">
        {phasesData.map(phase => {
          const isOpen = openPhase === phase.id;
          return (
            <div key={phase.id} className={`bg-white dark:bg-gray-800 rounded-3xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-teal-500 shadow-lg ring-1 ring-teal-500/20' : 'border-gray-100 dark:border-gray-700 shadow-sm'}`}>
              <button 
                onClick={() => setOpenPhase(isOpen ? null : phase.id)}
                className={`w-full flex items-center justify-between p-8 text-left transition-colors ${isOpen ? 'bg-teal-50/30 dark:bg-teal-900/10' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
              >
                <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm ${isOpen ? 'bg-teal-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                        {phase.id.replace('phase', '')}
                    </div>
                    <div>
                        <h3 className={`font-serif font-bold text-xl ${isOpen ? 'text-teal-900 dark:text-teal-100' : 'text-charcoal dark:text-white'}`}>{phase.title}</h3>
                        <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mt-1">{phase.weekRange}</p>
                    </div>
                </div>
                <div className={`p-3 rounded-full transition-all ${isOpen ? 'bg-white text-teal-600 rotate-180 shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-400'}`}>
                    <ChevronDown size={20} />
                </div>
              </button>
              
              {isOpen && (
                <div className="p-8 border-t border-gray-100 dark:border-gray-700 space-y-8 animate-fade-in bg-white dark:bg-gray-800">
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed max-w-3xl">{phase.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                        <Target size={14} /> Key Milestones
                      </h4>
                      <ul className="space-y-4">
                        {phase.milestones.map((m, i) => (
                          <li key={i} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-200">
                            <div className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-400 flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0">✓</div>
                            <span className="leading-relaxed font-medium">{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                        <Clock size={14} /> Daily Routine
                      </h4>
                       <div className="space-y-3">
                          <div className="flex gap-4 p-5 bg-orange-50/50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                              <div className="text-xs font-bold text-orange-600 dark:text-orange-400 w-16 pt-1">MORNING</div>
                              <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">{phase.dailySchedule.morning}</div>
                          </div>
                          <div className="flex gap-4 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                              <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 w-16 pt-1">EVENING</div>
                              <div className="text-sm text-gray-800 dark:text-gray-200 font-medium">{phase.dailySchedule.evening}</div>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div>
                     <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">Weekly Goals</h4>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {phase.weekGoals.map((goal, i) => (
                         <div key={i} className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-gray-600 dark:text-gray-300 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow">
                           <span className="font-bold text-gray-200 text-3xl leading-none -mt-1">0{i+1}</span>
                           <span className="font-medium">{goal}</span>
                           {i === 0 && <span className="ml-auto w-2 h-2 rounded-full bg-teal-500"></span>}
                         </div>
                       ))}
                     </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ProgressView: React.FC<{ completedDays: number[], toggleDay: (day: number) => void }> = ({ completedDays, toggleDay }) => {
  const weeks = Array.from({ length: 5 }, (_, i) => i + 1);
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end mb-6">
         <h2 className="text-3xl font-serif font-bold text-charcoal dark:text-white">Habit Tracker</h2>
         <div className="text-right">
            <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{completedDays.length}<span className="text-lg text-gray-400 font-normal">/30</span></p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Days Completed</p>
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {weeks.map(week => (
          <div key={week} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
            <h3 className="font-serif font-bold text-charcoal dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4 flex justify-between items-center">
                Week {week}
                {completedDays.filter(d => d > (week-1)*7 && d <= week*7).length === (week===5?3:7) && <CheckSquare size={18} className="text-green-500" />}
            </h3>
            <div className="grid grid-cols-4 gap-3 flex-grow content-start">
              {Array.from({ length: week === 5 ? 3 : 7 }, (_, d) => {
                const dayNum = (week - 1) * 7 + (d + 1);
                if (dayNum > 30) return null;
                const isDone = completedDays.includes(dayNum);
                return (
                  <button
                    key={dayNum}
                    onClick={() => toggleDay(dayNum)}
                    className={`
                      aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 relative overflow-hidden group
                      ${isDone 
                        ? 'bg-teal-500 text-white shadow-md shadow-teal-200 dark:shadow-none' 
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-400 hover:bg-white dark:hover:bg-gray-600 hover:shadow-md border border-transparent hover:border-gray-200 dark:hover:border-gray-600'
                      }
                    `}
                    title={`Mark Day ${dayNum} Complete`}
                  >
                    <span className="relative z-10">{dayNum}</span>
                    {isDone && <span className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-full transition-transform"></span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const RolePlayView: React.FC<{ completedDays: number[], toggleDay: (day: number) => void }> = ({ completedDays, toggleDay }) => {
  const [selectedDay, setSelectedDay] = useState<RolePlayDay | null>(null);
  const [activeScenarioId, setActiveScenarioId] = useState<'morning' | 'evening'>('morning');
  const [showUserHints, setShowUserHints] = useState(false);
  const [showPartnerHints, setShowPartnerHints] = useState(false);

  // AI & Recording State
  const [isAiMode, setIsAiMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisState>({ isLoading: false, error: null, result: null });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState<Array<{speaker: 'Me' | 'AI', text: string}>>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const liveSessionRef = useRef<LiveSession | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveScenarioId('morning');
    setShowUserHints(false);
    setShowPartnerHints(false);
    setIsAiMode(false);
    setAnalysis({ isLoading: false, error: null, result: null });
    setAudioFile(null);
    setIsConnecting(false);
    setTranscript([]);
    return () => {
       if (liveSessionRef.current) {
          liveSessionRef.current.disconnect();
       }
    };
  }, [selectedDay]);

  useEffect(() => {
    if (transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  const openModal = (day: RolePlayDay) => setSelectedDay(day);
  const closeModal = () => setSelectedDay(null);

  const activeSession = selectedDay ? selectedDay[activeScenarioId] : null;

  const startAiSession = async () => {
      if (!activeSession) return;
      
      try {
          setIsConnecting(true);
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          
          // 1. Start MediaRecorder for final analysis file
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          chunksRef.current = [];

          mediaRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) chunksRef.current.push(e.data);
          };
          mediaRecorder.start();

          // 2. Start Live Session for interaction
          const session = new LiveSession();
          liveSessionRef.current = session;
          setTranscript([]); // Clear previous
          
          const systemInstruction = `
            You are a role-play partner for an English learner. 
            Scenario: ${activeSession.title}. 
            Context: ${activeSession.scenario}.
            Your Role: ${activeSession.partnerRole}.
            My Role: ${activeSession.userRole}.
            Act out your role naturally. Keep responses concise and conversational.
            Engage with the user, ask questions if appropriate for your role, and answer their questions.
          `;
          
          await session.connect(systemInstruction, stream, (speaker, text) => {
            setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last && last.speaker === speaker) {
                    const updatedTranscript = [...prev];
                    updatedTranscript[updatedTranscript.length - 1] = {
                        ...last,
                        text: last.text + text
                    };
                    return updatedTranscript;
                }
                return [...prev, { speaker, text }];
            });
          });
          
          setIsConnecting(false);
          setIsRecording(true);
      } catch (e: any) {
          console.error(e);
          setIsConnecting(false);
          alert(`Connection failed: ${e.message || "Check network or permissions"}`);
      }
  };

  const stopAiSession = () => {
      // Stop Live Interaction
      if (liveSessionRef.current) {
          liveSessionRef.current.disconnect();
          liveSessionRef.current = null;
      }

      // Stop Recording & Analyze
      if (!mediaRecorderRef.current) return;

      mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const file = new File([blob], "roleplay_session.webm", { type: 'audio/webm' });
          setAudioFile(file);
          
          setIsRecording(false);
          setAnalysis({ isLoading: true, error: null, result: null });
          
          try {
             // Analyze the user's side of the conversation
             const result = await analyzeConversation(file, MistakeScope.ME_ONLY);
             setAnalysis({ isLoading: false, error: null, result });
          } catch (err: any) {
             setAnalysis({ isLoading: false, error: err.message, result: null });
          }

          mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.stop();
  };

  const completedPercentage = Math.round((completedDays.length / 30) * 100);

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      
      {/* Hero Section */}
      <div className="relative rounded-[2rem] overflow-hidden bg-charcoal dark:bg-gray-900 text-white shadow-2xl">
         <div className="absolute inset-0 bg-gradient-to-r from-teal-900 to-gray-900 opacity-90"></div>
         <div className="absolute top-0 right-0 p-40 bg-teal-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
         <div className="absolute bottom-0 left-0 p-32 bg-purple-500 rounded-full blur-[100px] opacity-20"></div>
         
         <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-xl space-y-4">
               <div className="flex items-center gap-3 text-teal-300 font-bold uppercase tracking-widest text-xs">
                  <span className="px-2 py-1 bg-teal-500/20 rounded border border-teal-500/30">New Challenge</span>
                  <span>30-Day Program</span>
               </div>
               <h2 className="text-4xl md:text-6xl font-serif font-bold leading-tight">Master Real-World English.</h2>
               <p className="text-gray-300 text-lg leading-relaxed max-w-md">
                  Two sessions a day. Total transformation. Start your journey to fluency today.
               </p>
            </div>
            
            <div className="flex-shrink-0 bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 w-full md:w-80 shadow-2xl">
               <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">Total Progress</span>
                  <span className="text-4xl font-bold text-teal-300">{completedPercentage}%</span>
               </div>
               <div className="w-full bg-gray-700/50 h-2 rounded-full mb-6 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-400 to-teal-300 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(45,212,191,0.5)]" style={{ width: `${completedPercentage}%` }}></div>
               </div>
               <div className="flex items-center gap-3 text-sm font-medium text-white bg-white/10 p-3 rounded-xl">
                  <Medal size={18} className="text-yellow-400" />
                  <span>{completedDays.length} Days Completed</span>
               </div>
            </div>
         </div>
      </div>
      
      {/* Weeks Timeline */}
      <div className="relative space-y-16">
        <div className="absolute left-6 md:left-[35px] top-12 bottom-0 w-0.5 border-l-2 border-dashed border-gray-200 dark:border-gray-800 z-0"></div>

        {rolePlayWeeks.map((week, index) => {
          const weekDays = rolePlayData.filter(d => d.week === week.weekNumber);
          const weekCompletedCount = weekDays.filter(d => completedDays.includes(d.day)).length;
          const isWeekComplete = weekCompletedCount === weekDays.length;
          
          return (
            <div key={week.weekNumber} className="relative z-10">
                <div className="flex items-start gap-6 md:gap-10 mb-8">
                    <div className={`
                        w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl md:text-2xl font-bold font-serif shadow-lg flex-shrink-0 border-4 transition-all duration-500 z-10
                        ${isWeekComplete 
                            ? 'bg-teal-500 border-teal-100 text-white shadow-teal-500/30' 
                            : 'bg-white dark:bg-gray-800 border-teal-500 text-teal-600 dark:text-teal-400'
                        }
                    `}>
                        {isWeekComplete ? <CheckCircle2 size={32} /> : week.weekNumber}
                    </div>
                    
                    <div className="flex-1 pt-2">
                        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-5 mb-3">
                            <h3 className="font-serif font-bold text-3xl text-charcoal dark:text-white leading-none tracking-tight">{week.title}</h3>
                            <span className="text-xs font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wide px-3 py-1.5 bg-teal-100 dark:bg-teal-900/40 rounded-lg w-fit">
                                {week.focus}
                            </span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                           <span className="flex items-center gap-2"><Target size={14}/> Difficulty: <span className="text-charcoal dark:text-gray-200 font-bold">{weekDays[0]?.difficulty}</span></span>
                           <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                           <span className="flex items-center gap-2"><CheckSquare size={14}/> {weekCompletedCount}/{weekDays.length} Days</span>
                        </div>
                    </div>
                </div>

                <div className="ml-4 md:ml-[5.5rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {weekDays.map((data) => {
                        const isCompleted = completedDays.includes(data.day);

                        return (
                            <button
                                key={data.day}
                                onClick={() => openModal(data)}
                                className={`
                                    group relative flex flex-col justify-between p-6 h-full min-h-[180px] rounded-3xl text-left transition-all duration-300 border backdrop-blur-sm shadow-sm
                                    ${isCompleted 
                                        ? 'bg-teal-50/80 dark:bg-teal-900/10 border-teal-200 dark:border-teal-900 hover:shadow-md' 
                                        : 'bg-white/80 dark:bg-gray-800/80 border-gray-100 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-1'
                                    }
                                `}
                            >
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-teal-600 dark:text-teal-400' : 'text-gray-400'}`}>
                                            Day {data.day}
                                        </span>
                                        {isCompleted && (
                                            <div className="bg-teal-500 text-white rounded-full p-1 shadow-sm">
                                                <CheckSquare size={12} />
                                            </div>
                                        )}
                                        {!isCompleted && (
                                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-teal-500 group-hover:text-white transition-all">
                                                <ArrowRight size={12} />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <h4 className={`font-bold text-lg leading-tight mb-3 ${isCompleted ? 'text-teal-900 dark:text-teal-100' : 'text-charcoal dark:text-white'}`}>
                                        {data.morning.title}
                                    </h4>
                                    
                                    <div className="flex gap-1 mb-2 opacity-50">
                                         {Array.from({length: 5}).map((_, i) => (
                                            <div key={i} className={`h-1 w-full rounded-full ${i < parseInt(data.difficulty[0]) ? 'bg-orange-400' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                         ))}
                                    </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                                        Goal: <span className="text-charcoal dark:text-gray-300 font-medium">{data.dailyGoal}</span>
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
          )
        })}
      </div>

      {/* Enhanced Modal Overlay */}
      {selectedDay && activeSession && (
        <div className="fixed inset-0 bg-charcoal/80 dark:bg-black/90 z-50 flex items-center justify-center p-2 md:p-6 backdrop-blur-md animate-fade-in">
          <div className="bg-cream dark:bg-gray-950 w-full max-w-6xl h-full md:h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in ring-1 ring-white/10">
            
            {/* Modal Header */}
            <div className="flex-shrink-0 p-6 border-b border-brownish dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
              <div>
                 <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Day {selectedDay.day} • {selectedDay.difficulty} Level</span>
                 </div>
                 <h2 className="text-xl md:text-2xl font-serif font-bold text-charcoal dark:text-white truncate max-w-lg">{selectedDay.dailyGoal}</h2>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X size={24} className="text-gray-400" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                
                {/* Left Column: Scenario & Roles */}
                <div className="lg:w-5/12 border-r border-brownish dark:border-gray-800 flex flex-col bg-white dark:bg-gray-900 overflow-y-auto">
                    
                    {/* Scenario Switcher */}
                    <div className="p-6 pb-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Choose Scenario</label>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setActiveScenarioId('morning')}
                                className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${
                                    activeScenarioId === 'morning' 
                                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-900 dark:text-white shadow-md' 
                                    : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className="block text-[10px] font-black uppercase mb-1 opacity-50 tracking-wider">Scenario 1</span>
                                <span className="block font-bold text-sm leading-tight">{selectedDay.morning.title}</span>
                            </button>
                            <button 
                                onClick={() => setActiveScenarioId('evening')}
                                className={`flex-1 p-4 rounded-2xl border-2 text-left transition-all ${
                                    activeScenarioId === 'evening' 
                                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20 text-teal-900 dark:text-white shadow-md' 
                                    : 'border-transparent bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className="block text-[10px] font-black uppercase mb-1 opacity-50 tracking-wider">Scenario 2</span>
                                <span className="block font-bold text-sm leading-tight">{selectedDay.evening.title}</span>
                            </button>
                        </div>
                    </div>

                    <div className="p-6 pt-4 space-y-6">
                         <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 italic text-gray-600 dark:text-gray-300 text-center">
                            "{activeSession.scenario}"
                         </div>

                         {/* Interactive Role Cards */}
                         <div className="space-y-4">
                             {/* User Role */}
                             <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 bg-indigo-50/50 dark:bg-indigo-900/10">
                                 <button 
                                    onClick={() => setShowUserHints(!showUserHints)}
                                    className="w-full p-5 flex items-center justify-between text-left"
                                 >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-md">YOU</div>
                                        <div>
                                            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-wider">Your Role</p>
                                            <p className="font-bold text-charcoal dark:text-white text-lg">{activeSession.userRole}</p>
                                        </div>
                                    </div>
                                    {showUserHints ? <ChevronUp size={20} className="text-indigo-400"/> : <ChevronDown size={20} className="text-gray-400"/>}
                                 </button>
                                 
                                 {showUserHints && (
                                     <div className="px-5 pb-5 animate-fade-in space-y-4 border-t border-indigo-100 dark:border-indigo-900/30 pt-4">
                                         <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1.5"><MessageSquare size={14}/> Questions to Ask</p>
                                            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                {(activeSession.possibleQuestions || activeSession.speakingPoints).map((q, i) => (
                                                    <li key={i} className="text-sm text-charcoal dark:text-gray-200 bg-white dark:bg-gray-800 p-3 rounded-xl border border-indigo-100 dark:border-gray-700 shadow-sm">"{q}"</li>
                                                ))}
                                            </ul>
                                         </div>
                                     </div>
                                 )}
                             </div>

                             {/* Partner Role */}
                             <div className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden transition-all duration-300 bg-gray-50 dark:bg-gray-800/50">
                                 <button 
                                    onClick={() => setShowPartnerHints(!showPartnerHints)}
                                    className="w-full p-5 flex items-center justify-between text-left"
                                 >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-400 text-white flex items-center justify-center font-bold text-xs shadow-md">THEM</div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-wider">Partner's Role</p>
                                            <p className="font-medium text-gray-600 dark:text-gray-300 text-lg">{activeSession.partnerRole}</p>
                                        </div>
                                    </div>
                                    {showPartnerHints ? <ChevronUp size={20} /> : <ChevronDown size={20} className="text-gray-400"/>}
                                 </button>
                                 
                                 {showPartnerHints && (
                                     <div className="px-5 pb-5 animate-fade-in space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                                         <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-1.5"><HelpCircle size={14}/> What they might ask</p>
                                            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                {(activeSession.partnerQuestions || ["How are you?", "What do you need?", "Can you explain?"]).map((q, i) => (
                                                    <li key={i} className="text-sm text-gray-600 dark:text-gray-400 italic bg-white dark:bg-gray-900 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">"{q}"</li>
                                                ))}
                                            </ul>
                                         </div>
                                     </div>
                                 )}
                             </div>
                         </div>
                    </div>
                </div>

                {/* Right Column: AI Practice Area */}
                <div className="lg:w-7/12 flex flex-col h-full bg-gray-50 dark:bg-gray-950 overflow-y-auto relative">
                    
                    {/* Header Switcher (Only visible if NOT recording/connected for clean chat UI) */}
                    {!isRecording && !isConnecting && !analysis.result && (
                        <div className="flex justify-center p-6 pb-0">
                            <div className="bg-white dark:bg-gray-900 p-1.5 rounded-full border border-gray-200 dark:border-gray-800 flex gap-2 shadow-sm">
                                <button 
                                    onClick={() => setIsAiMode(false)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${!isAiMode ? 'bg-teal-500 text-white shadow-md' : 'text-gray-500 hover:text-charcoal dark:hover:text-white'}`}
                                >
                                    <Users size={16} className="inline mr-2" />
                                    Practice with Friend
                                </button>
                                <button 
                                    onClick={() => setIsAiMode(true)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${isAiMode ? 'bg-purple-600 text-white shadow-md' : 'text-gray-500 hover:text-charcoal dark:hover:text-white'}`}
                                >
                                    <Sparkles size={16} className="inline mr-2" />
                                    Talk with AI Partner
                                </button>
                            </div>
                        </div>
                    )}

                    {!isAiMode ? (
                        /* Manual / Friend Mode Content */
                        <div className="p-8 space-y-8 animate-fade-in">
                            <div>
                                <h3 className="text-lg font-bold text-charcoal dark:text-white mb-4 flex items-center gap-2">
                                    <Target size={20} className="text-teal-500" />
                                    Key Vocabulary
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {activeSession.vocabulary.map((w, i) => (
                                        <span key={i} className="px-4 py-2 bg-white dark:bg-gray-800 text-charcoal dark:text-gray-200 border border-gray-200 dark:border-gray-700 text-sm font-semibold rounded-xl shadow-sm">
                                            {w}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-yellow-100 dark:border-yellow-900/30 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 bg-yellow-50 dark:bg-yellow-900/10 rounded-bl-full"></div>
                                <h4 className="text-xs font-black uppercase text-yellow-600 dark:text-yellow-500 mb-3 flex items-center gap-2 relative z-10">
                                    <Lightbulb size={16} /> Pro Tip
                                </h4>
                                <p className="text-charcoal dark:text-gray-300 leading-relaxed relative z-10 font-medium">
                                    {activeSession.tips}
                                </p>
                            </div>

                            <div className="flex justify-center pt-8">
                                <button 
                                    onClick={() => toggleDay(selectedDay.day)}
                                    className={`flex items-center gap-3 px-10 py-5 font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-1 ${
                                        completedDays.includes(selectedDay.day)
                                        ? 'bg-green-100 text-green-700 border-2 border-green-200'
                                        : 'bg-teal-500 text-white hover:bg-teal-600 shadow-teal-500/30'
                                    }`}
                                >
                                    <CheckCircle2 size={24} />
                                    {completedDays.includes(selectedDay.day) ? 'Marked Complete' : 'Mark Day Complete'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        /* AI Partner Mode Content */
                        <div className="flex-1 flex flex-col animate-fade-in relative h-full">
                            {analysis.result ? (
                                /* Result View */
                                <div className="flex-1 overflow-y-auto p-4">
                                     <div className="flex justify-between items-center mb-4 px-2">
                                         <h3 className="font-bold text-lg">AI Feedback Analysis</h3>
                                         <button 
                                            onClick={() => setAnalysis({isLoading: false, error: null, result: null})}
                                            className="text-sm text-gray-500 hover:text-teal-600 underline"
                                         >
                                            Start New Recording
                                         </button>
                                     </div>
                                     <ResultsDisplay result={analysis.result} mediaFile={audioFile || new File([], "placeholder")} />
                                </div>
                            ) : isRecording ? (
                                /* ACTIVE LIVE CHAT UI */
                                <div className="flex-1 flex flex-col h-full bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
                                    {/* Live Chat Header */}
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center justify-between shadow-sm z-10">
                                        <div className="flex items-center gap-3">
                                            <span className="relative flex h-3 w-3">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                            </span>
                                            <div>
                                                <h3 className="font-bold text-charcoal dark:text-white text-sm flex items-center gap-2">
                                                    Live Partner <span className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-[10px] uppercase tracking-wider font-bold">Active</span>
                                                </h3>
                                                <p className="text-xs text-gray-500 max-w-[200px] truncate">{activeSession.partnerRole}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="hidden md:flex items-center gap-1 text-xs text-red-500 font-medium bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full border border-red-100 dark:border-red-900/30">
                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                Recording for Analysis
                                            </div>
                                        </div>
                                    </div>

                                    {/* Chat Scroll Area */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                                        {transcript.length === 0 && (
                                            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                                                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                                    <Bot size={48} />
                                                </div>
                                                <p className="text-sm font-medium">Say "Hello" to start the conversation...</p>
                                            </div>
                                        )}
                                        
                                        {transcript.map((t, idx) => {
                                            const isMe = t.speaker === 'Me';
                                            const isLast = idx === transcript.length - 1;
                                            
                                            return (
                                                <div key={idx} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up`}>
                                                    {/* Avatar */}
                                                    <div className={`
                                                        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md border-2 border-white dark:border-gray-800 z-10
                                                        ${isMe ? 'bg-gradient-to-br from-teal-400 to-teal-600 text-white' : 'bg-gradient-to-br from-purple-500 to-purple-700 text-white'}
                                                        ${!isMe && isLast ? 'animate-pulse shadow-purple-500/50' : ''} 
                                                    `}>
                                                        {isMe ? <User size={20} /> : <Bot size={20} />}
                                                    </div>

                                                    {/* Bubble */}
                                                    <div className={`
                                                        max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative
                                                        ${isMe 
                                                            ? 'bg-teal-500 text-white rounded-tr-none shadow-teal-500/20' 
                                                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
                                                        }
                                                    `}>
                                                        {t.text}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={transcriptEndRef} />
                                    </div>

                                    {/* Bottom Controls */}
                                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-center gap-6 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-10">
                                        <div className="text-center">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-2">Tap to Finish</p>
                                            <button 
                                                onClick={stopAiSession}
                                                className="group relative w-16 h-16 flex items-center justify-center"
                                            >
                                                <span className="absolute inset-0 bg-red-500 rounded-full opacity-20 group-hover:scale-110 transition-transform duration-300"></span>
                                                <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></span>
                                                <div className="relative z-10 w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105">
                                                    <Square size={20} fill="currentColor" />
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Start Screen */
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
                                    <div className="max-w-md space-y-3">
                                        <h3 className="text-3xl font-serif font-bold text-charcoal dark:text-white">Live Role-Play</h3>
                                        <p className="text-gray-500 leading-relaxed">
                                            Start a realistic voice conversation. The AI will play <span className="font-bold text-purple-600">{activeSession.partnerRole}</span>.
                                            Speak naturally—when you're done, you'll get a full grammar analysis.
                                        </p>
                                    </div>

                                    <div className="py-6">
                                        {isConnecting || analysis.isLoading ? (
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                                                <p className="font-bold text-purple-600 animate-pulse">
                                                   {analysis.isLoading ? 'Analyzing Performance...' : 'Connecting to Partner...'}
                                                </p>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={startAiSession}
                                                className="w-28 h-28 bg-gradient-to-br from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white rounded-full flex items-center justify-center shadow-xl shadow-purple-500/40 transition-all hover:scale-105 hover:shadow-purple-500/60 group relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                                <Mic size={48} className="relative z-10" />
                                            </button>
                                        )}
                                    </div>
                                    
                                    {!isConnecting && !analysis.isLoading && (
                                        <p className="text-sm text-gray-400 font-medium">Tap microphone to start speaking</p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export const FluencyDashboard: React.FC<DashboardProps> = ({ activeView, onNavigate }) => {
  // Initialize from LocalStorage to persist progress
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lingua_progress');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse progress", e);
        }
      }
    }
    return [];
  });

  // Save to LocalStorage whenever completedDays changes
  useEffect(() => {
    localStorage.setItem('lingua_progress', JSON.stringify(completedDays));
  }, [completedDays]);

  const toggleDay = (day: number) => {
    setCompletedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day) 
        : [...prev, day].sort((a, b) => a - b)
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'Overview':
        return <OverviewView completedDays={completedDays} onNavigate={onNavigate} />;
      case 'Courses':
        return <CoursesView />;
      case 'Roadmap':
        return <RoadmapView />;
      case 'Progress':
        return <ProgressView completedDays={completedDays} toggleDay={toggleDay} />;
      case 'Role-Play':
        return <RolePlayView completedDays={completedDays} toggleDay={toggleDay} />;
      default:
        return <OverviewView completedDays={completedDays} onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};
