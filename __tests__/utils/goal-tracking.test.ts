/// <reference types="jest" />
import { 
  calculateGoalProgress,
  getGoalInsights,
  shouldUpdateGoal
} from '@/utils/goal-tracking';
import { Relationship, Goal } from '@/types/relationship';

describe('Goal Tracking Utils', () => {
  const baseRelationship: Relationship = {
    id: '1',
    name: 'Test Person',
    tags: ['friend' as const],
    notes: '',
    importantDates: [],
    interactions: [],
    goals: [],
    emotionHistory: [],
    reminderFrequency: 7,
    connectionScore: 0,
    milestones: [],
    sharedMemories: [],
    communicationPreferences: {
      preferredChannels: ['message' as const],
      notificationFrequency: 'medium'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  describe('calculateGoalProgress', () => {
    it('calculates progress for completed goals', () => {
      const goal: Goal = {
        id: '1',
        title: 'Test Goal',
        completed: true,
        targetDate: new Date().toISOString()
      };
      
      const progress = calculateGoalProgress(goal);
      expect(progress).toBe(100);
    });

    it('calculates progress for in-progress goals', () => {
      const goal: Goal = {
        id: '1',
        title: 'Test Goal',
        completed: false,
        progress: 50,
        targetDate: new Date().toISOString()
      };
      
      const progress = calculateGoalProgress(goal);
      expect(progress).toBe(50);
    });

    it('handles goals without progress', () => {
      const goal: Goal = {
        id: '1',
        title: 'Test Goal',
        completed: false,
        targetDate: new Date().toISOString()
      };
      
      const progress = calculateGoalProgress(goal);
      expect(progress).toBe(0);
    });
  });

  describe('getGoalInsights', () => {
    it('provides insights for completed goals', () => {
      const relationship: Relationship = {
        ...baseRelationship,
        goals: [
          {
            id: '1',
            title: 'Test Goal',
            completed: true,
            targetDate: new Date().toISOString()
          }
        ]
      };
      
      const insights = getGoalInsights(relationship);
      expect(insights).toContain('completed');
    });

    it('provides insights for upcoming goals', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);
      
      const relationship: Relationship = {
        ...baseRelationship,
        goals: [
          {
            id: '1',
            title: 'Test Goal',
            completed: false,
            targetDate: futureDate.toISOString()
          }
        ]
      };
      
      const insights = getGoalInsights(relationship);
      expect(insights).toContain('upcoming');
    });

    it('provides insights for overdue goals', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const relationship: Relationship = {
        ...baseRelationship,
        goals: [
          {
            id: '1',
            title: 'Test Goal',
            completed: false,
            targetDate: pastDate.toISOString()
          }
        ]
      };
      
      const insights = getGoalInsights(relationship);
      expect(insights).toContain('overdue');
    });

    it('handles empty goals array', () => {
      const insights = getGoalInsights(baseRelationship);
      expect(insights).toContain('no goals');
    });
  });

  describe('shouldUpdateGoal', () => {
    it('returns true for overdue goals', () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);
      
      const goal: Goal = {
        id: '1',
        title: 'Test Goal',
        completed: false,
        targetDate: pastDate.toISOString()
      };
      
      expect(shouldUpdateGoal(goal)).toBe(true);
    });

    it('returns true for goals near target date', () => {
      const nearDate = new Date();
      nearDate.setDate(nearDate.getDate() + 2);
      
      const goal: Goal = {
        id: '1',
        title: 'Test Goal',
        completed: false,
        targetDate: nearDate.toISOString()
      };
      
      expect(shouldUpdateGoal(goal)).toBe(true);
    });

    it('returns false for completed goals', () => {
      const goal: Goal = {
        id: '1',
        title: 'Test Goal',
        completed: true,
        targetDate: new Date().toISOString()
      };
      
      expect(shouldUpdateGoal(goal)).toBe(false);
    });

    it('returns false for far future goals', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      
      const goal: Goal = {
        id: '1',
        title: 'Test Goal',
        completed: false,
        targetDate: futureDate.toISOString()
      };
      
      expect(shouldUpdateGoal(goal)).toBe(false);
    });
  });
}); 