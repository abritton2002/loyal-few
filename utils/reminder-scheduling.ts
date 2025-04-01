import { Relationship, RelationshipTag } from '@/types/relationship';
import { calculateConnectionScore } from './connection-score';

export function calculateNextReminderDate(
  currentDate: Date,
  reminderFrequency: number
): Date {
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + reminderFrequency);
  return nextDate;
}

export function shouldSendReminder(relationship: Relationship): boolean {
  if (!relationship.lastInteraction) return true;

  const lastInteractionDate = new Date(relationship.lastInteraction);
  const now = new Date();
  const daysSinceLastInteraction = Math.floor(
    (now.getTime() - lastInteractionDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceLastInteraction >= relationship.reminderFrequency;
}

export function getReminderMessage(relationship: Relationship): string {
  const daysSinceLastInteraction = relationship.lastInteraction
    ? Math.floor(
        (new Date().getTime() - new Date(relationship.lastInteraction).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const relationshipType = relationship.tags[0] || 'friend';
  const daysText = daysSinceLastInteraction === 0
    ? 'today'
    : daysSinceLastInteraction === 1
    ? 'yesterday'
    : `${daysSinceLastInteraction} days ago`;

  const baseMessage = `As a ${relationshipType}, It's been ${daysText} since your last interaction with ${
    relationship.name
  }`;

  // Include the actual connection score in the message
  return `${baseMessage}. Your connection score is ${relationship.connectionScore}. ${getRelationshipSpecificMessage(
    relationshipType,
    relationship.connectionScore
  )}`;
}

function getRelationshipSpecificMessage(
  relationshipType: RelationshipTag,
  connectionScore: number
): string {
  const scoreMessage = connectionScore >= 80
    ? `Your connection is strong (${connectionScore})`
    : connectionScore >= 60
    ? `Your connection is good (${connectionScore})`
    : `Your connection needs attention (${connectionScore})`;

  switch (relationshipType) {
    case 'spouse':
      return `${scoreMessage}. Take a moment to show your appreciation.`;
    case 'partner':
      return `${scoreMessage}. Plan a special moment together.`;
    case 'family':
      return `${scoreMessage}. Family bonds are important.`;
    case 'friend':
      return `${scoreMessage}. Friendships need regular nurturing.`;
    case 'colleague':
      return `${scoreMessage}. Professional relationships matter.`;
    case 'mentor':
      return `${scoreMessage}. Mentorship relationships are valuable.`;
    case 'mentee':
      return `${scoreMessage}. Support your mentee's growth.`;
    case 'business':
      return `${scoreMessage}. Maintain your business network.`;
    default:
      return scoreMessage;
  }
} 