/// <reference types="jest" />
import { 
  calculateInteractionFrequency,
  getInteractionInsights,
  shouldScheduleInteraction
} from '@/utils/interaction-tracking';
import { Relationship, Interaction, InteractionType } from '@/types/relationship';

describe('Interaction Tracking Utils', () => {
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

  describe('calculateInteractionFrequency', () => {
    it('calculates frequency for regular interactions', () => {
      const now = new Date();
      const interactions: Interaction[] = [
        {
          id: '1',
          date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'message' as InteractionType,
          notes: 'Test interaction 1'
        },
        {
          id: '2',
          date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'message' as InteractionType,
          notes: 'Test interaction 2'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        interactions
      };

      const frequency = calculateInteractionFrequency(relationship);
      expect(frequency).toBeCloseTo(7, 0); // Approximately 7 days
    });

    it('handles single interaction', () => {
      const now = new Date();
      const interactions: Interaction[] = [
        {
          id: '1',
          date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'message' as InteractionType,
          notes: 'Test interaction'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        interactions
      };

      const frequency = calculateInteractionFrequency(relationship);
      expect(frequency).toBe(7);
    });

    it('handles no interactions', () => {
      const frequency = calculateInteractionFrequency(baseRelationship);
      expect(frequency).toBe(0);
    });
  });

  describe('getInteractionInsights', () => {
    it('provides insights for regular interactions', () => {
      const now = new Date();
      const interactions: Interaction[] = [
        {
          id: '1',
          date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'message' as InteractionType,
          notes: 'Test interaction 1'
        },
        {
          id: '2',
          date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'message' as InteractionType,
          notes: 'Test interaction 2'
        },
        {
          id: '3',
          date: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'message' as InteractionType,
          notes: 'Test interaction 3'
        },
        {
          id: '4',
          date: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'message' as InteractionType,
          notes: 'Test interaction 4'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        interactions
      };

      const insights = getInteractionInsights(relationship);
      expect(insights).toContain('regular');
    });

    it('provides insights for infrequent interactions', () => {
      const now = new Date();
      const interactions: Interaction[] = [
        {
          id: '1',
          date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'message' as InteractionType,
          notes: 'Test interaction'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        interactions
      };

      const insights = getInteractionInsights(relationship);
      expect(insights).toContain('infrequent');
    });

    it('provides insights for no interactions', () => {
      const insights = getInteractionInsights(baseRelationship);
      expect(insights).toContain('no interactions');
    });

    it('provides insights for different interaction types', () => {
      const now = new Date();
      const interactions: Interaction[] = [
        {
          id: '1',
          date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'call' as InteractionType,
          notes: 'Test call'
        },
        {
          id: '2',
          date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'meeting' as InteractionType,
          notes: 'Test meeting'
        },
        {
          id: '3',
          date: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'message' as InteractionType,
          notes: 'Test message'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        interactions
      };

      const insights = getInteractionInsights(relationship);
      expect(insights).toContain('variety');
    });
  });

  describe('shouldScheduleInteraction', () => {
    it('returns true when no recent interactions', () => {
      const now = new Date();
      const interactions: Interaction[] = [
        {
          id: '1',
          date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'message' as InteractionType,
          notes: 'Old interaction'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        interactions,
        reminderFrequency: 7
      };

      expect(shouldScheduleInteraction(relationship)).toBe(true);
    });

    it('returns false when recent interaction exists', () => {
      const now = new Date();
      const interactions: Interaction[] = [
        {
          id: '1',
          date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          type: 'message' as InteractionType,
          notes: 'Recent interaction'
        }
      ];

      const relationship: Relationship = {
        ...baseRelationship,
        interactions,
        reminderFrequency: 7
      };

      expect(shouldScheduleInteraction(relationship)).toBe(false);
    });

    it('returns true when no interactions exist', () => {
      const relationship: Relationship = {
        ...baseRelationship,
        reminderFrequency: 7
      };

      expect(shouldScheduleInteraction(relationship)).toBe(true);
    });
  });
}); 