import { Relationship, RelationshipTag } from '@/types/relationship';

export function calculateNextReminderDate(
  currentDate: Date,
  reminderFrequency: number
): Date {
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + (reminderFrequency >= 0 ? reminderFrequency : 0));
  return nextDate;
}

export function shouldSendReminder(relationship: Relationship): boolean {
  if (!relationship.lastInteraction) return true;
  if (relationship.reminderFrequency <= 0) return true;

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

  const relationshipType = relationship.tags && relationship.tags.length > 0 
    ? relationship.tags[0] 
    : 'friend';
    
  let daysText;
  if (daysSinceLastInteraction === 0) {
    daysText = 'today';
  } else if (daysSinceLastInteraction === 1) {
    daysText = 'yesterday';
  } else {
    daysText = `${daysSinceLastInteraction} days ago`;
  }

  const baseMessage = relationship.lastInteraction 
    ? `It's been ${daysText} since your last interaction with ${relationship.name}`
    : `You haven't recorded any interactions with ${relationship.name} yet`;

  const relationshipSpecificMessage = getRelationshipSpecificMessage(
    relationshipType,
    relationship.connectionScore
  );

  return `${baseMessage}. ${relationshipSpecificMessage}`;
}

function getRelationshipSpecificMessage(
  relationshipType: RelationshipTag,
  connectionScore: number
): string {
  const scoreMessage = connectionScore >= 80
    ? 'Your connection is strong'
    : connectionScore >= 60
    ? 'Your connection is good'
    : 'Consider strengthening your connection';

  switch (relationshipType) {
    case 'spouse':
      return `${scoreMessage}. Take a moment to show your spouse appreciation.`;
    case 'partner':
      return `${scoreMessage}. Plan a special moment with your partner.`;
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