export type RelationshipTag = 
  | 'spouse' 
  | 'partner' 
  | 'family' 
  | 'friend' 
  | 'colleague' 
  | 'mentor' 
  | 'mentee' 
  | 'business';

export type EmotionRating = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ImportantDate {
  id: string;
  title: string;
  date: string; // ISO string
  recurring: boolean;
  type: 'birthday' | 'anniversary' | 'other';
}

export interface Interaction {
  id: string;
  date: string; // ISO string
  type: 'call' | 'message' | 'meeting' | 'gift' | 'other';
  notes: string;
  emotionRating?: EmotionRating;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string; // ISO string
  completed: boolean;
}

export interface Relationship {
  id: string;
  name: string;
  avatar?: string;
  tags: RelationshipTag[];
  connectionScore: number; // 0-100
  lastInteraction?: string; // ISO string
  notes: string;
  importantDates: ImportantDate[];
  interactions: Interaction[];
  goals: Goal[];
  emotionHistory: {
    date: string; // ISO string
    rating: EmotionRating;
  }[];
  reminderFrequency: number; // days
  createdAt: string; // ISO string
}