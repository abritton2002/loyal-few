/// <reference types="jest" />
import { 
  calculateMilestoneProgress,
  getMilestoneInsights,
  shouldCelebrateMilestone
} from '@/utils/milestone-tracking';
import { Relationship, Milestone } from '@/types/relationship';

describe('Milestone Tracking Utils', () => {
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

  describe('calculateMilestoneProgress', () => {
    it('calculates progress for recent milestones', () => {
      const now = new Date();
      const milestones: Milestone[] = [
        {
          id: '1',
          title: 'First Meeting',
          date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'First time meeting in person'
        },
        {
          id: '2',
          title: 'First Trip Together',
          date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'First vacation together'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        milestones
      };

      const progress = calculateMilestoneProgress(relationship);
      expect(progress).toBeGreaterThan(0);
    });

    it('handles no milestones', () => {
      const progress = calculateMilestoneProgress(baseRelationship);
      expect(progress).toBe(0);
    });

    it('handles single milestone', () => {
      const now = new Date();
      const milestones: Milestone[] = [
        {
          id: '1',
          title: 'First Meeting',
          date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'First time meeting in person'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        milestones
      };

      const progress = calculateMilestoneProgress(relationship);
      expect(progress).toBe(1);
    });
  });

  describe('getMilestoneInsights', () => {
    it('provides insights for recent milestones', () => {
      const now = new Date();
      const milestones: Milestone[] = [
        {
          id: '1',
          title: 'First Meeting',
          date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'First time meeting in person'
        },
        {
          id: '2',
          title: 'First Trip Together',
          date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'First vacation together'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        milestones
      };

      const insights = getMilestoneInsights(relationship);
      expect(insights).toContain('recent');
    });

    it('provides insights for upcoming milestones', () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const milestones: Milestone[] = [
        {
          id: '1',
          title: 'First Anniversary',
          date: futureDate.toISOString(),
          description: 'One year of friendship'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        milestones
      };

      const insights = getMilestoneInsights(relationship);
      expect(insights).toContain('upcoming');
    });

    it('provides insights for no milestones', () => {
      const insights = getMilestoneInsights(baseRelationship);
      expect(insights).toContain('no milestones');
    });

    it('provides insights for milestone variety', () => {
      const now = new Date();
      const milestones: Milestone[] = [
        {
          id: '1',
          title: 'First Meeting',
          date: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'First time meeting in person'
        },
        {
          id: '2',
          title: 'First Trip Together',
          date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'First vacation together'
        },
        {
          id: '3',
          title: 'First Project Together',
          date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'First collaborative project'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        milestones
      };

      const insights = getMilestoneInsights(relationship);
      expect(insights).toContain('variety');
    });
  });

  describe('shouldCelebrateMilestone', () => {
    it('returns true for upcoming milestone', () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const milestone: Milestone = {
        id: '1',
        title: 'First Anniversary',
        date: futureDate.toISOString(),
        description: 'One year of friendship'
      };

      expect(shouldCelebrateMilestone(milestone)).toBe(true);
    });

    it('returns true for recent milestone', () => {
      const now = new Date();
      const recentDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      
      const milestone: Milestone = {
        id: '1',
        title: 'First Meeting',
        date: recentDate.toISOString(),
        description: 'First time meeting in person'
      };

      expect(shouldCelebrateMilestone(milestone)).toBe(true);
    });

    it('returns false for old milestone', () => {
      const now = new Date();
      const oldDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const milestone: Milestone = {
        id: '1',
        title: 'First Meeting',
        date: oldDate.toISOString(),
        description: 'First time meeting in person'
      };

      expect(shouldCelebrateMilestone(milestone)).toBe(false);
    });
  });
}); 