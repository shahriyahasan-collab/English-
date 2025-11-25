
export enum MistakeScope {
  ME_ONLY = 'ME_ONLY',
  BOTH = 'BOTH'
}

export interface GrammarAnalysis {
  hasMistake: boolean;
  originalSubstring: string;
  correction: string;
  fullCorrectedSentence: string;
  explanation: string;
}

export interface BetterResponse {
  hasSuggestion: boolean;
  suggestedResponse: string;
  reasoning: string;
}

export interface TranscriptItem {
  id: number;
  speaker: 'Me' | 'Stranger';
  text: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  grammar: GrammarAnalysis | null;
  suggestion: BetterResponse | null;
}

export interface AnalysisResult {
  summary: string;
  transcript: TranscriptItem[];
}

export interface AnalysisState {
  isLoading: boolean;
  error: string | null;
  result: AnalysisResult | null;
}

export interface PracticeResult {
  isCorrect: boolean;
  feedback: string;
  transcribedText: string;
}

// --- Dashboard Data Types ---

export interface Course {
  id: string;
  name: string;
  priority: number; // 1-8
  cost: 'Free' | 'Paid' | string;
  speakingFocus: number; // 1-10
  startWeek: number;
  verdict: string;
  category: 'Must Buy' | 'Recommended' | 'Optional';
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  weekRange: string;
  milestones: string[];
  dailySchedule: {
    morning: string;
    evening: string;
  };
  weekGoals: string[];
}

export interface RolePlaySession {
  title: string; // Scenario Title
  context?: string; // Optional context
  scenario: string; // Description
  userRole: string;
  partnerRole: string;
  speakingPoints: string[];
  possibleQuestions?: string[]; // Questions the user can ask
  partnerQuestions?: string[]; // Questions the partner might ask
  vocabulary: string[];
  tips: string;
}

export interface RolePlayDay {
  day: number;
  week: number;
  difficulty: string; // "1/5"
  dailyGoal: string;
  morning: RolePlaySession;
  evening: RolePlaySession;
}

export interface RolePlayWeek {
  weekNumber: number;
  title: string; // e.g., "Foundation Phase"
  focus: string;
  milestones: string[];
}

export interface DashboardState {
  completedDays: number[]; // Array of day IDs (1-84)
  currentView: 'Overview' | 'Courses' | 'Roadmap' | 'Schedule' | 'Progress' | 'Role-Play' | 'AI Coach';
}