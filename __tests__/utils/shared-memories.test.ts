/// <reference types="jest" />
import { 
  calculateMemoryEngagement,
  getMemoryInsights,
  shouldShareMemory
} from '@/utils/shared-memories';
import { Relationship, SharedMemory } from '@/types/relationship';

describe('Shared Memories Utils', () => {
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

  describe('calculateMemoryEngagement', () => {
    it('calculates engagement for acknowledged memories', () => {
      const memories: SharedMemory[] = [
        {
          id: '1',
          title: 'First Trip',
          date: new Date().toISOString(),
          description: 'Our first vacation together',
          createdBy: 'me',
          acknowledged: true
        },
        {
          id: '2',
          title: 'Project Success',
          date: new Date().toISOString(),
          description: 'Completed our first project',
          createdBy: 'them',
          acknowledged: true
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        sharedMemories: memories
      };

      const engagement = calculateMemoryEngagement(relationship);
      expect(engagement).toBe(100);
    });

    it('calculates engagement for partially acknowledged memories', () => {
      const memories: SharedMemory[] = [
        {
          id: '1',
          title: 'First Trip',
          date: new Date().toISOString(),
          description: 'Our first vacation together',
          createdBy: 'me',
          acknowledged: true
        },
        {
          id: '2',
          title: 'Project Success',
          date: new Date().toISOString(),
          description: 'Completed our first project',
          createdBy: 'them',
          acknowledged: false
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        sharedMemories: memories
      };

      const engagement = calculateMemoryEngagement(relationship);
      expect(engagement).toBe(50);
    });

    it('handles no memories', () => {
      const engagement = calculateMemoryEngagement(baseRelationship);
      expect(engagement).toBe(0);
    });
  });

  describe('getMemoryInsights', () => {
    it('provides insights for recent memories', () => {
      const now = new Date();
      const memories: SharedMemory[] = [
        {
          id: '1',
          title: 'First Trip',
          date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Our first vacation together',
          createdBy: 'me',
          acknowledged: true
        },
        {
          id: '2',
          title: 'Project Success',
          date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          description: 'Completed our first project',
          createdBy: 'them',
          acknowledged: true
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        sharedMemories: memories
      };

      const insights = getMemoryInsights(relationship);
      expect(insights).toContain('recent');
    });

    it('provides insights for unacknowledged memories', () => {
      const memories: SharedMemory[] = [
        {
          id: '1',
          title: 'First Trip',
          date: new Date().toISOString(),
          description: 'Our first vacation together',
          createdBy: 'me',
          acknowledged: false
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        sharedMemories: memories
      };

      const insights = getMemoryInsights(relationship);
      expect(insights).toContain('unacknowledged');
    });

    it('provides insights for no memories', () => {
      const insights = getMemoryInsights(baseRelationship);
      expect(insights).toContain('no memories');
    });

    it('provides insights for memory variety', () => {
      const memories: SharedMemory[] = [
        {
          id: '1',
          title: 'First Trip',
          date: new Date().toISOString(),
          description: 'Our first vacation together',
          createdBy: 'me',
          acknowledged: true
        },
        {
          id: '2',
          title: 'Project Success',
          date: new Date().toISOString(),
          description: 'Completed our first project',
          createdBy: 'them',
          acknowledged: true
        },
        {
          id: '3',
          title: 'Special Dinner',
          date: new Date().toISOString(),
          description: 'Celebratory dinner at favorite restaurant',
          createdBy: 'me',
          acknowledged: true
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        sharedMemories: memories
      };

      const insights = getMemoryInsights(relationship);
      expect(insights).toContain('variety');
    });
  });

  describe('shouldShareMemory', () => {
    it('returns true for recent interactions', () => {
      const now = new Date();
      const interactions = [
        {
          id: '1',
          date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'meeting' as const,
          notes: 'Great meeting'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        interactions
      };

      expect(shouldShareMemory(relationship)).toBe(true);
    });

    it('returns false for no recent interactions', () => {
      const now = new Date();
      const interactions = [
        {
          id: '1',
          date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'meeting' as const,
          notes: 'Old meeting'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        interactions
      };

      expect(shouldShareMemory(relationship)).toBe(false);
    });

    it('returns false for no interactions', () => {
      expect(shouldShareMemory(baseRelationship)).toBe(false);
    });
  });
}); 