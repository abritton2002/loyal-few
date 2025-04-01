/// <reference types="jest" />
import { calculateConnectionScore } from '@/utils/connection-score';
import { Relationship, InteractionType, RelationshipTag } from '@/types/relationship';

describe('calculateConnectionScore', () => {
  const baseRelationship: Relationship = {
    id: '1',
    name: 'Test Person',
    tags: ['friend' as RelationshipTag],
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
      preferredChannels: ['message' as InteractionType],
      notificationFrequency: 'medium'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it('calculates base score for new relationship', () => {
    const score = calculateConnectionScore(baseRelationship);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('increases score for recent interactions', () => {
    const relationship: Relationship = {
      ...baseRelationship,
      interactions: [
        {
          id: '1',
          date: new Date().toISOString(),
          type: 'message' as InteractionType,
          notes: 'Test interaction'
        }
      ]
    };
    const score = calculateConnectionScore(relationship);
    expect(score).toBeGreaterThan(calculateConnectionScore(baseRelationship));
  });

  it('increases score for emotional ratings', () => {
    const relationship: Relationship = {
      ...baseRelationship,
      emotionHistory: [
        {
          date: new Date().toISOString(),
          rating: 8
        }
      ]
    };
    const score = calculateConnectionScore(relationship);
    expect(score).toBeGreaterThan(calculateConnectionScore(baseRelationship));
  });

  it('increases score for completed goals', () => {
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
    const score = calculateConnectionScore(relationship);
    expect(score).toBeGreaterThan(calculateConnectionScore(baseRelationship));
  });

  it('decreases score for long periods without interaction', () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 30);
    
    const relationship: Relationship = {
      ...baseRelationship,
      interactions: [
        {
          id: '1',
          date: oldDate.toISOString(),
          type: 'message' as InteractionType,
          notes: 'Old interaction'
        }
      ]
    };
    const score = calculateConnectionScore(relationship);
    expect(score).toBeLessThan(calculateConnectionScore(baseRelationship));
  });

  it('handles different relationship types appropriately', () => {
    const spouseRelationship: Relationship = {
      ...baseRelationship,
      tags: ['spouse' as RelationshipTag]
    };
    const friendRelationship: Relationship = {
      ...baseRelationship,
      tags: ['friend' as RelationshipTag]
    };
    
    const spouseScore = calculateConnectionScore(spouseRelationship);
    const friendScore = calculateConnectionScore(friendRelationship);
    
    // Spouse relationships should have a higher base score
    expect(spouseScore).toBeGreaterThan(friendScore);
  });
}); 