export interface Run {
  id: string;
  date: string;
  distance_km: number;
  duration: string;
  pace: string;
  route: string;
  mood: 'strong' | 'happy' | 'determined' | 'amazing' | 'tired' | 'neutral';
  photo_note: string;
  memory: string;
  imageUrl: string;
}

export interface UserProfile {
  name: string;
  goal: string;
  preferred_times: string;
  motivations: string[];
  struggles: string[];
  personality: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  LOG_RUN = 'LOG_RUN'
}