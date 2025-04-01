import { Relationship, Interaction, InteractionType } from '@/types/relationship';

export function calculateInteractionFrequency(relationship: Relationship): number {
  if (relationship.interactions.length < 2) {
    if (relationship.interactions.length === 1) {
      const lastInteraction = new Date(relationship.interactions[0].date);
      const now = new Date();
      return Math.floor(
        (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24)
      );
    }
    return 0;
  }

  // Sort interactions by date
  const sortedInteractions = [...relationship.interactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate average days between interactions
  let totalDays = 0;
  let count = 0;

  for (let i = 1; i < sortedInteractions.length; i++) {
    const prevDate = new Date(sortedInteractions[i - 1].date);
    const currDate = new Date(sortedInteractions[i].date);
    const days = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    totalDays += days;
    count++;
  }

  return count > 0 ? Math.floor(totalDays / count) : 0;
}

export function getInteractionInsights(relationship: Relationship): string[] {
  const insights: string[] = [];

  if (relationship.interactions.length === 0) {
    insights.push('You have no recorded interactions with this person');
    return insights;
  }

  const frequency = calculateInteractionFrequency(relationship);
  const now = new Date();
  const lastInteraction = new Date(
    relationship.interactions[relationship.interactions.length - 1].date
  );
  const daysSinceLastInteraction = Math.floor(
    (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Frequency insights
  if (frequency <= 7) {
    insights.push('You maintain regular contact with this person');
  } else if (frequency <= 14) {
    insights.push('You have moderate contact frequency');
  } else {
    insights.push('Your interactions are infrequent');
  }

  // Recency insights
  if (daysSinceLastInteraction <= 3) {
    insights.push('You have recently interacted with this person');
  } else if (daysSinceLastInteraction <= 7) {
    insights.push('It has been about a week since your last interaction');
  } else {
    insights.push(`It has been ${daysSinceLastInteraction} days since your last interaction`);
  }

  // Interaction type variety
  const interactionTypes = new Set(
    relationship.interactions.map(interaction => interaction.type)
  );
  if (interactionTypes.size > 2) {
    insights.push('You use a variety of communication methods');
  }

  return insights;
}

export function shouldScheduleInteraction(relationship: Relationship): boolean {
  if (relationship.interactions.length === 0) return true;

  const now = new Date();
  const lastInteraction = new Date(
    relationship.interactions[relationship.interactions.length - 1].date
  );
  const daysSinceLastInteraction = Math.floor(
    (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24)
  );

  return daysSinceLastInteraction >= relationship.reminderFrequency;
} 