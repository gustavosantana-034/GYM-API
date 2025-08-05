// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  membership: 'basic' | 'premium' | 'pro';
  stats: UserStats;
}

export interface UserStats {
  workoutsCompleted: number;
  totalTime: number;
  currentStreak: number;
  weight: number;
  bodyFat: number;
}

// Auth Types
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}

// Workout Types
export interface Workout {
  id: string;
  name: string;
  duration: string;
  calories: number;
  date: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'hiit';
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  rest: number;
}

// Chart Data Types
export interface WeeklyProgress {
  day: string;
  workouts: number;
  calories: number;
  time: number;
}

export interface BodyMetrics {
  name: string;
  value: number;
  color: string;
}

// Component Props Types
export interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
  delay: number;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface AppLayoutProps {
  children: React.ReactNode;
}

// API Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
} 