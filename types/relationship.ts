export type RelationshipTag = 
  | 'spouse' 
  | 'partner' 
  | 'family' 
  | 'friend' 
  | 'colleague' 
  | 'mentor' 
  | 'mentee' 
  | 'business';

export type InteractionType = 
  | 'call' 
  | 'message' 
  | 'meeting' 
  | 'gift' 
  | 'other';

export type EmotionRating = number; // 1-10

export type ImportantDateType = 
  | 'birthday' 
  | 'anniversary' 
  | 'other';

export interface ImportantDate {
  id: string;
  title: string;
  date: string; // ISO string
  type: ImportantDateType;
  recurring: boolean;
  notes?: string;
}

export interface Interaction {
  id: string;
  date: string; // ISO string
  type: InteractionType;
  notes?: string;
  emotionRating?: EmotionRating;
  duration?: number; // in minutes
  location?: string;
  photos?: string[]; // URLs to photos
  tags?: string[];
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  targetDate?: string; // ISO string
  completed: boolean;
  progress?: number; // 0-100
  notes?: string;
  shared?: boolean; // Whether the goal is shared with the other person
}

export interface Milestone {
  id: string;
  title: string;
  date: string; // ISO string
  description?: string;
  photos?: string[]; // URLs to photos
  tags?: string[];
}

export interface SharedMemory {
  id: string;
  title: string;
  date: string; // ISO string
  description?: string;
  photos?: string[]; // URLs to photos
  location?: string;
  tags?: string[];
  createdBy: string; // 'me' or 'them'
  acknowledged?: boolean; // Whether the other person has acknowledged this memory
}

export interface CommunicationPreferences {
  preferredChannels: InteractionType[];
  bestTimesToContact?: string[]; // e.g., ["morning", "evening"]
  doNotDisturb?: {
    start: string; // HH:mm format
    end: string; // HH:mm format
    timezone: string;
  };
  notificationFrequency: 'low' | 'medium' | 'high';
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
  milestones: Milestone[];
  sharedMemories: SharedMemory[];
  emotionHistory: {
    date: string; // ISO string
    rating: EmotionRating;
  }[];
  reminderFrequency: number; // days
  communicationPreferences: CommunicationPreferences;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}