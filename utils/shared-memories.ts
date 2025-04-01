import { Relationship, SharedMemory, Interaction } from '@/types/relationship';

export function calculateMemoryEngagement(relationship: Relationship): number {
  if (relationship.sharedMemories.length === 0) return 0;

  const acknowledgedMemories = relationship.sharedMemories.filter(
    memory => memory.acknowledged
  );

  return Math.floor(
    (acknowledgedMemories.length / relationship.sharedMemories.length) * 100
  );
}

export function getMemoryInsights(relationship: Relationship): string[] {
  const insights: string[] = [];

  if (relationship.sharedMemories.length === 0) {
    insights.push('You have no shared memories with this person');
    return insights;
  }

  const now = new Date();
  const sortedMemories = [...relationship.sharedMemories].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Recent memories
  const recentMemories = sortedMemories.filter(memory => {
    const memoryDate = new Date(memory.date);
    const daysSinceMemory = Math.floor(
      (now.getTime() - memoryDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceMemory <= 30;
  });

  if (recentMemories.length > 0) {
    insights.push(
      `You've created ${recentMemories.length} shared memory${
        recentMemories.length === 1 ? '' : 'ies'
      } recently`
    );
  }

  // Unacknowledged memories
  const unacknowledgedMemories = sortedMemories.filter(
    memory => !memory.acknowledged
  );

  if (unacknowledgedMemories.length > 0) {
    insights.push(
      `You have ${unacknowledgedMemories.length} unacknowledged shared memory${
        unacknowledgedMemories.length === 1 ? '' : 'ies'
      }`
    );
  }

  // Memory variety
  const memoryTypes = new Set(
    sortedMemories.map(memory => memory.title.toLowerCase())
  );
  if (memoryTypes.size > 2) {
    insights.push('You have a variety of different shared memories');
  }

  // Memory creation balance
  const myMemories = sortedMemories.filter(memory => memory.createdBy === 'me');
  const theirMemories = sortedMemories.filter(
    memory => memory.createdBy === 'them'
  );

  if (myMemories.length > 0 && theirMemories.length > 0) {
    const ratio = myMemories.length / theirMemories.length;
    if (ratio > 2) {
      insights.push('You create most of the shared memories');
    } else if (ratio < 0.5) {
      insights.push('The other person creates most of the shared memories');
    } else {
      insights.push('You both contribute to shared memories');
    }
  }

  return insights;
}

export function shouldShareMemory(relationship: Relationship): boolean {
  if (relationship.interactions.length === 0) return false;

  const now = new Date();
  const recentInteractions = relationship.interactions.filter(interaction => {
    const interactionDate = new Date(interaction.date);
    const daysSinceInteraction = Math.floor(
      (now.getTime() - interactionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceInteraction <= 7;
  });

  return recentInteractions.length > 0;
} 