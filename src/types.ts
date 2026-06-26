export type AppLanguage = "pt" | "en";

export type AppTheme = "light" | "dark" | "cyberpunk" | "forest";

export interface UserProgress {
  xp: number;
  coins: number;
  lives: number;
  maxLives: number;
  streak: number;
  maxStreak: number;
  lastActive: string; // ISO Date
  unlockedLessons: string[]; // Lesson IDs
  completedLessons: string[]; // Lesson IDs
  activeTrackId: string;
  theme: AppTheme;
  title: string; // E.g., "Junior Dev", "Fullstack wizard"
  badges: string[]; // List of badge IDs
  hasShield: boolean; // Protects streak
  offlineCoursesDownloaded: string[]; // Track IDs downloaded for offline
  reminderTime: string; // "19:00"
}

export type ExerciseType = "multiple-choice" | "fill-blank" | "order-code" | "find-error";

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: {
    pt: string;
    en: string;
  };
  codeSnippet?: string; // Optional code to show
  options: string[]; // Available choices/blocks
  correctAnswer: string; // For MCQ & find-error
  correctOrder?: string[]; // For order-code
  blankAnswers?: string[]; // For fill-blank if multiple
  explanation: {
    pt: string;
    en: string;
  };
}

export interface Lesson {
  id: string;
  trackId: string;
  title: {
    pt: string;
    en: string;
  };
  description: {
    pt: string;
    en: string;
  };
  icon: string; // Lucide icon name
  xpReward: number;
  coinReward: number;
  exercises: Exercise[];
}

export interface Track {
  id: string;
  title: string;
  description: string;
  color: string; // Tailwind color class
  icon: string; // Lucide icon
  lessons: Lesson[];
}

export interface Badge {
  id: string;
  title: {
    pt: string;
    en: string;
  };
  description: {
    pt: string;
    en: string;
  };
  icon: string;
  cost?: number; // If purchasable
  unlockedAtXp?: number; // If unlocked by XP
}

export interface ForumPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: "JS" | "Python" | "SQL" | "General" | "HTML/CSS";
  upvotes: number;
  commentsCount: number;
  createdAt: string;
  comments: Array<{
    id: string;
    author: string;
    avatar: string;
    content: string;
    createdAt: string;
  }>;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export interface FriendActivity {
  id: string;
  name: string;
  avatar: string;
  achievement: {
    pt: string;
    en: string;
  };
  time: string;
  congratulated?: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  isCurrentUser?: boolean;
  title: string;
}
