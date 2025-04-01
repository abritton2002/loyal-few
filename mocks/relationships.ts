import { Relationship } from '@/types/relationship';
import { v4 as uuidv4 } from 'uuid';

const now = new Date();
const oneWeekAgo = new Date();
oneWeekAgo.setDate(now.getDate() - 7);

const twoWeeksAgo = new Date();
twoWeeksAgo.setDate(now.getDate() - 14);

const oneMonthAgo = new Date();
oneMonthAgo.setDate(now.getDate() - 30);

export const mockRelationships: Relationship[] = [
  {
    id: uuidv4(),
    name: "Sarah",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    tags: ['spouse'],
    connectionScore: 85,
    lastInteraction: oneWeekAgo.toISOString(),
    notes: "Loves hiking and photography. Currently working on a big project at work.",
    importantDates: [
      {
        id: uuidv4(),
        title: "Anniversary",
        date: "2018-06-15",
        recurring: true,
        type: "anniversary"
      },
      {
        id: uuidv4(),
        title: "Birthday",
        date: "1988-03-22",
        recurring: true,
        type: "birthday"
      }
    ],
    interactions: [
      {
        id: uuidv4(),
        date: oneWeekAgo.toISOString(),
        type: "meeting",
        notes: "Dinner date at Italian restaurant",
        emotionRating: 8
      },
      {
        id: uuidv4(),
        date: twoWeeksAgo.toISOString(),
        type: "call",
        notes: "Called during lunch break to check in",
        emotionRating: 7
      }
    ],
    goals: [
      {
        id: uuidv4(),
        title: "Plan anniversary trip",
        description: "Research destinations for June",
        targetDate: "2023-05-01",
        completed: false
      }
    ],
    emotionHistory: [
      {
        date: twoWeeksAgo.toISOString(),
        rating: 7
      },
      {
        date: oneWeekAgo.toISOString(),
        rating: 8
      }
    ],
    reminderFrequency: 3,
    createdAt: oneMonthAgo.toISOString()
  },
  {
    id: uuidv4(),
    name: "Mike",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    tags: ['friend', 'colleague'],
    connectionScore: 62,
    lastInteraction: twoWeeksAgo.toISOString(),
    notes: "College roommate. Now works in finance. Has two kids.",
    importantDates: [
      {
        id: uuidv4(),
        title: "Birthday",
        date: "1987-11-08",
        recurring: true,
        type: "birthday"
      }
    ],
    interactions: [
      {
        id: uuidv4(),
        date: twoWeeksAgo.toISOString(),
        type: "meeting",
        notes: "Met for drinks after work",
        emotionRating: 6
      }
    ],
    goals: [
      {
        id: uuidv4(),
        title: "Plan fishing trip",
        description: "Look into cabin rentals for summer",
        targetDate: "2023-07-15",
        completed: false
      }
    ],
    emotionHistory: [
      {
        date: twoWeeksAgo.toISOString(),
        rating: 6
      }
    ],
    reminderFrequency: 14,
    createdAt: oneMonthAgo.toISOString()
  },
  {
    id: uuidv4(),
    name: "Dad",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    tags: ['family'],
    connectionScore: 45,
    lastInteraction: oneMonthAgo.toISOString(),
    notes: "Retired last year. Enjoys woodworking and fishing.",
    importantDates: [
      {
        id: uuidv4(),
        title: "Birthday",
        date: "1955-08-12",
        recurring: true,
        type: "birthday"
      }
    ],
    interactions: [
      {
        id: uuidv4(),
        date: oneMonthAgo.toISOString(),
        type: "call",
        notes: "Called to check in, talked about his new workshop",
        emotionRating: 5
      }
    ],
    goals: [
      {
        id: uuidv4(),
        title: "Visit for a weekend",
        description: "Plan trip to parents' house",
        targetDate: "2023-06-30",
        completed: false
      }
    ],
    emotionHistory: [
      {
        date: oneMonthAgo.toISOString(),
        rating: 5
      }
    ],
    reminderFrequency: 7,
    createdAt: oneMonthAgo.toISOString()
  }
];