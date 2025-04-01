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
    insights.push('no interactions');
    return insights;
  }

  const now = new Date();
  const sortedInteractions = [...relationship.interactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Recent interactions
  const recentInteractions = sortedInteractions.filter(interaction => {
    const interactionDate = new Date(interaction.date);
    const daysSinceInteraction = Math.floor(
      (now.getTime() - interactionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceInteraction <= 7;
  });

  if (recentInteractions.length > 0) {
    insights.push('recent');
  }

  // Regular interactions (4 or more in the last 30 days)
  const regularInteractions = sortedInteractions.filter(interaction => {
    const interactionDate = new Date(interaction.date);
    const daysSinceInteraction = Math.floor(
      (now.getTime() - interactionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceInteraction <= 30;
  });

  if (regularInteractions.length >= 4) {
    insights.push('regular');
  } else if (regularInteractions.length < 4) {
    insights.push('infrequent');
  }

  // Interaction variety (3 or more different types in the last 30 days)
  const recentInteractionTypes = new Set(
    regularInteractions.map(interaction => interaction.type.toLowerCase())
  );
  if (recentInteractionTypes.size >= 3) {
    insights.push('variety');
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