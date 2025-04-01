/// <reference types="jest" />
import { 
  calculateNextReminderDate,
  shouldSendReminder,
  getReminderMessage
} from '@/utils/reminder-scheduling';
import { Relationship, RelationshipTag } from '@/types/relationship';

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

    // Additional tests for calculateNextReminderDate
    it('handles zero days frequency', () => {
      const now = new Date();
      const nextDate = calculateNextReminderDate(now, 0);
      
      // Should be same day
      expect(nextDate.getDate()).toBe(now.getDate());
      expect(nextDate.getMonth()).toBe(now.getMonth());
      expect(nextDate.getFullYear()).toBe(now.getFullYear());
    });
    
    it('handles negative days frequency', () => {
      const now = new Date();
      const nextDate = calculateNextReminderDate(now, -1);
      
      // Should be yesterday
      const expectedDate = new Date(now);
      expectedDate.setDate(expectedDate.getDate() - 1);
      
      expect(nextDate.getDate()).toBe(expectedDate.getDate());
    });
    
    it('handles large day count', () => {
      const now = new Date();
      const nextDate = calculateNextReminderDate(now, 365);
      
      // Should be 365 days from now
      const expectedDate = new Date(now);
      expectedDate.setDate(expectedDate.getDate() + 365);
      
      expect(nextDate.getFullYear()).toBe(expectedDate.getFullYear());
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

    // Additional tests for shouldSendReminder
    it('handles interaction exactly at the reminder frequency boundary', () => {
      const borderlineDate = new Date();
      borderlineDate.setDate(borderlineDate.getDate() - 7); // Exactly 7 days ago
      
      const relationship: Relationship = {
        ...baseRelationship,
        lastInteraction: borderlineDate.toISOString(),
        reminderFrequency: 7
      };
      
      expect(shouldSendReminder(relationship)).toBe(true);
    });
    
    it('handles different reminder frequencies', () => {
      const date = new Date();
      date.setDate(date.getDate() - 10); // 10 days ago
      
      // Should trigger for weekly but not bi-weekly
      const weeklyRelationship: Relationship = {
        ...baseRelationship,
        lastInteraction: date.toISOString(),
        reminderFrequency: 7
      };
      
      const biweeklyRelationship: Relationship = {
        ...baseRelationship,
        lastInteraction: date.toISOString(),
        reminderFrequency: 14
      };
      
      expect(shouldSendReminder(weeklyRelationship)).toBe(true);
      expect(shouldSendReminder(biweeklyRelationship)).toBe(false);
    });
    
    it('handles very frequent reminders', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1); // 1 day ago
      
      const relationship: Relationship = {
        ...baseRelationship,
        lastInteraction: yesterday.toISOString(),
        reminderFrequency: 1
      };
      
      expect(shouldSendReminder(relationship)).toBe(true);
    });
    
    it('handles very infrequent reminders', () => {
      const longAgo = new Date();
      longAgo.setDate(longAgo.getDate() - 29); // 29 days ago
      
      const relationship: Relationship = {
        ...baseRelationship,
        lastInteraction: longAgo.toISOString(),
        reminderFrequency: 30
      };
      
      expect(shouldSendReminder(relationship)).toBe(false);
    });
    
    it('handles zero reminder frequency', () => {
      const date = new Date();
      
      const relationship: Relationship = {
        ...baseRelationship,
        lastInteraction: date.toISOString(),
        reminderFrequency: 0
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

    // Additional tests for getReminderMessage
    it('handles all relationship types', () => {
      const relationshipTypes: RelationshipTag[] = [
        'spouse', 'partner', 'family', 'friend', 'colleague', 'mentor', 'mentee', 'business'
      ];
      
      for (const type of relationshipTypes) {
        const relationship: Relationship = {
          ...baseRelationship,
          tags: [type]
        };
        
        const message = getReminderMessage(relationship);
        expect(message).toContain(type);
      }
    });
    
    it('handles interaction from today', () => {
      const today = new Date();
      
      const relationship: Relationship = {
        ...baseRelationship,
        lastInteraction: today.toISOString()
      };
      
      const message = getReminderMessage(relationship);
      expect(message).toContain('today');
    });
    
    it('handles interaction from yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const relationship: Relationship = {
        ...baseRelationship,
        lastInteraction: yesterday.toISOString()
      };
      
      const message = getReminderMessage(relationship);
      expect(message).toContain('yesterday');
    });
    
    it('handles different connection score ranges', () => {
      // Test different connection score ranges
      const scoreRanges = [95, 85, 75, 65, 55, 45, 35, 25, 15, 5];
      
      for (const score of scoreRanges) {
        const relationship: Relationship = {
          ...baseRelationship,
          connectionScore: score
        };
        
        const message = getReminderMessage(relationship);
        // Should contain some form of assessment based on score
        if (score >= 80) {
          expect(message).toContain('strong');
        } else if (score >= 60) {
          expect(message).toContain('good');
        } else {
          expect(message).toContain('strengthen');
        }
      }
    });
    
    it('handles no lastInteraction', () => {
      const relationship: Relationship = {
        ...baseRelationship,
        lastInteraction: undefined
      };
      
      const message = getReminderMessage(relationship);
      expect(message).not.toContain('undefined');
      expect(message).toContain(relationship.name);
    });
    
    it('handles relationships with empty tags', () => {
      const relationship: Relationship = {
        ...baseRelationship,
        tags: []
      };
      
      const message = getReminderMessage(relationship);
      expect(message).toContain(relationship.name);
    });
  });
});