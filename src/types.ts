export type UserRole = 'student' | 'instructor' | 'admin' | 'anonymous';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  xp: number;
  streak: number;
  streakFreezeCount: number;
  streakFreezeActive?: boolean;
  avatar: string;
  badges?: string[];
  dailyMissionProgress?: number;
  dailyMissionCompleted?: boolean;
  dailyMissionClaimed?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  className: string;
  xpReward: number;
  dueDate: string;
  totalQuestions: number;
  completed: boolean;
  score?: number; // percentage in student context
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  expression: string; // mathematical LaTeX string
  options: string[];
  correctAnswerIndex: number; // 0-based index
  category: string;
}

export interface ClassProgress {
  id: string;
  name: string;
  instructor: string;
  instructorAvatar: string;
  progressPercent: number;
  studentsCount: number;
  newActivitiesCount: number;
  imageUrl: string;
  roomName: string;
}

export interface Submission {
  id: string;
  studentName: string;
  studentInitials: string;
  studentAvatar?: string;
  quizTitle: string;
  submittedTime: string;
  status: 'READY' | 'LATE' | 'DONE';
  grade?: string; // e.g. "95/100"
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  title: string;
  xp: number;
  rankDelta?: number; // negative for down, positive for up, 0 for neutral
  avatar: string;
}

export interface ConfigSettings {
  xpMultiplier: number;
  xpDecayRate: number; // e.g. 0.05
  eventMultiplier: number; // e.g. 2.0 for special event
  milestones: {
    explorer: number;
    champion: number;
    legend: number;
  };
}
