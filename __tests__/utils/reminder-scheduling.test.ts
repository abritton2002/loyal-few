/// <reference types="jest" />
import { 
  calculateNextReminderDate,
  shouldSendReminder,
  getReminderMessage
} from '@/utils/reminder-scheduling';
import { Relationship } from '@/types/relationship';

describe('Reminder Scheduling Utils', () => {
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

  describe('calculateNextReminderDate', () => {
    it('calculates next reminder date based on frequency', () => {
      const now = new Date();
      const nextDate = calculateNextReminderDate(now, 7);
      
      // Should be 7 days from now
      const expectedDate = new Date(now);
      expectedDate.setDate(expectedDate.getDate() + 7);
      
      expect(nextDate.getDate()).toBe(expectedDate.getDate());
      expect(nextDate.getMonth()).toBe(expectedDate.getMonth());
      expect(nextDate.getFullYear()).toBe(expectedDate.getFullYear());
    });

    it('handles different reminder frequencies', () => {
      const now = new Date();
      const weeklyDate = calculateNextReminderDate(now, 7);
      const biweeklyDate = calculateNextReminderDate(now, 14);
      
      const weeklyExpected = new Date(now);
      weeklyExpected.setDate(weeklyExpected.getDate() + 7);
      
      const biweeklyExpected = new Date(now);
      biweeklyExpected.setDate(biweeklyExpected.getDate() + 14);
      
      expect(weeklyDate.getDate()).toBe(weeklyExpected.getDate());
      expect(biweeklyDate.getDate()).toBe(biweeklyExpected.getDate());
    });
  });

  describe('shouldSendReminder', () => {
    it('returns true when last interaction is older than reminder frequency', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 8); // 8 days ago
      
      const relationship: Relationship = {
        ...baseRelationship,
        lastInteraction: oldDate.toISOString(),
        reminderFrequency: 7
      };
      
      expect(shouldSendReminder(relationship)).toBe(true);
    });

    it('returns false when last interaction is within reminder frequency', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 3); // 3 days ago
      
      const relationship: Relationship = {
        ...baseRelationship,
        lastInteraction: recentDate.toISOString(),
        reminderFrequency: 7
      };
      
      expect(shouldSendReminder(relationship)).toBe(false);
    });

    it('returns true when there is no last interaction', () => {
      const relationship: Relationship = {
        ...baseRelationship,
        lastInteraction: undefined,
        reminderFrequency: 7
      };
      
      expect(shouldSendReminder(relationship)).toBe(true);
    });
  });

  describe('getReminderMessage', () => {
    it('generates appropriate message for different relationship types', () => {
      const spouseRelationship: Relationship = {
        ...baseRelationship,
        tags: ['spouse' as const]
      };
      
      const friendRelationship: Relationship = {
        ...baseRelationship,
        tags: ['friend' as const]
      };
      
      const spouseMessage = getReminderMessage(spouseRelationship);
      const friendMessage = getReminderMessage(friendRelationship);
      
      expect(spouseMessage).toContain('spouse');
      expect(friendMessage).toContain('friend');
    });

    it('includes connection score in message', () => {
      const relationship: Relationship = {
        ...baseRelationship,
        connectionScore: 85
      };
      
      const message = getReminderMessage(relationship);
      expect(message).toContain('85');
    });

    it('includes last interaction date in message', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 10);
      
      const relationship: Relationship = {
        ...baseRelationship,
        lastInteraction: oldDate.toISOString()
      };
      
      const message = getReminderMessage(relationship);
      expect(message).toContain('10 days');
    });
  });
}); 