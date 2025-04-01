/// <reference types="jest" />
import { 
  calculateUpcomingDates,
  getDateInsights,
  shouldRemindDate
} from '@/utils/important-dates';
import { Relationship, ImportantDate, ImportantDateType } from '@/types/relationship';

describe('Important Dates Utils', () => {
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

  describe('calculateUpcomingDates', () => {
    it('calculates upcoming dates correctly', () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const dates: ImportantDate[] = [
        {
          id: '1',
          title: 'Birthday',
          date: futureDate.toISOString(),
          type: 'birthday' as ImportantDateType,
          recurring: true
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        importantDates: dates
      };

      const upcoming = calculateUpcomingDates(relationship);
      expect(upcoming.length).toBe(1);
      expect(upcoming[0].title).toBe('Birthday');
    });

    it('handles recurring dates', () => {
      const now = new Date();
      const pastDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const dates: ImportantDate[] = [
        {
          id: '1',
          title: 'Birthday',
          date: pastDate.toISOString(),
          type: 'birthday' as ImportantDateType,
          recurring: true
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        importantDates: dates
      };

      const upcoming = calculateUpcomingDates(relationship);
      expect(upcoming.length).toBe(1);
      expect(upcoming[0].title).toBe('Birthday');
    });

    it('handles no dates', () => {
      const upcoming = calculateUpcomingDates(baseRelationship);
      expect(upcoming.length).toBe(0);
    });
  });

  describe('getDateInsights', () => {
    it('provides insights for upcoming dates', () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const dates: ImportantDate[] = [
        {
          id: '1',
          title: 'Birthday',
          date: futureDate.toISOString(),
          type: 'birthday' as ImportantDateType,
          recurring: true
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        importantDates: dates
      };

      const insights = getDateInsights(relationship);
      expect(insights).toContain('upcoming');
    });

    it('provides insights for recent dates', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const dates: ImportantDate[] = [
        {
          id: '1',
          title: 'Anniversary',
          date: recentDate.toISOString(),
          type: 'anniversary' as ImportantDateType,
          recurring: true
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        importantDates: dates
      };

      const insights = getDateInsights(relationship);
      expect(insights).toContain('recent');
    });

    it('provides insights for no dates', () => {
      const insights = getDateInsights(baseRelationship);
      expect(insights).toContain('no dates');
    });

    it('provides insights for date variety', () => {
      const now = new Date();
      const dates: ImportantDate[] = [
        {
          id: '1',
          title: 'Birthday',
          date: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'birthday' as ImportantDateType,
          recurring: true
        },
        {
          id: '2',
          title: 'Anniversary',
          date: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'anniversary' as ImportantDateType,
          recurring: true
        },
        {
          id: '3',
          title: 'Special Event',
          date: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'other' as ImportantDateType,
          recurring: false
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        importantDates: dates
      };

      const insights = getDateInsights(relationship);
      expect(insights).toContain('variety');
    });
  });

  describe('shouldRemindDate', () => {
    it('returns true for upcoming dates', () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const date: ImportantDate = {
        id: '1',
        title: 'Birthday',
        date: futureDate.toISOString(),
        type: 'birthday' as ImportantDateType,
        recurring: true
      };

      expect(shouldRemindDate(date)).toBe(true);
    });

    it('returns true for recent dates', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      
      const date: ImportantDate = {
        id: '1',
        title: 'Anniversary',
        date: recentDate.toISOString(),
        type: 'anniversary' as ImportantDateType,
        recurring: true
      };

      expect(shouldRemindDate(date)).toBe(true);
    });

    it('returns false for old dates', () => {
      const now = new Date();
      const oldDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const date: ImportantDate = {
        id: '1',
        title: 'Special Event',
        date: oldDate.toISOString(),
        type: 'other' as ImportantDateType,
        recurring: false
      };

      expect(shouldRemindDate(date)).toBe(false);
    });
  });
}); 