export interface StudySession {
  id: string;
  date: string;
  duration: number;
  completed: boolean;
  tag: string;
}

export interface DailyProgress {
  date: string;
  totalSeconds: number;
}

export interface TagStats {
  tag: string;
  totalSeconds: number;
  sessionCount: number;
}

export interface TimerState {
  duration: number;
  timeRemaining: number;
  isRunning: boolean;
  isPaused: boolean;
  sessions: StudySession[];
  dailyTarget: number;
  dailyProgress: DailyProgress[];
  currentTag: string;
  recentTags: string[];
  isBackgroundMode: boolean;
  lastUpdatedTime: number;
  
  setDuration: (duration: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  completeSession: (completed: boolean) => void;
  setDailyTarget: (hours: number) => void;
  setCurrentTag: (tag: string) => void;
  getTagStats: () => TagStats[];
  setBackgroundMode: (isBackground: boolean) => void;
  syncTimerWithRealTime: () => void;
}