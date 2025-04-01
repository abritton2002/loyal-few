import { Relationship, Interaction } from '@/types/relationship';

// Calculate connection score based on interaction frequency and recency
export function calculateConnectionScore(relationship: Relationship): number {
  let score = 50; // Base score

  // Relationship type impact
  if (relationship.tags.includes('spouse')) {
    score += 20; // Higher base score for spouse relationships
  } else if (relationship.tags.includes('family')) {
    score += 10; // Medium base score for family relationships
  }

  // Interaction frequency impact
  if (relationship.interactions.length > 0) {
    const recentInteractions = relationship.interactions.filter(interaction => {
      const interactionDate = new Date(interaction.date);
      const daysSinceInteraction = Math.floor(
        (new Date().getTime() - interactionDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceInteraction <= 30;
    });

    // Check if the most recent interaction is older than 30 days
    const oldestInteractionDate = new Date(relationship.interactions[0].date);
    const daysSinceOldestInteraction = Math.floor(
      (new Date().getTime() - oldestInteractionDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceOldestInteraction > 30) {
      score -= 20; // Larger penalty for long periods without interaction
    } else if (recentInteractions.length >= 4) {
      score += 15;
    } else if (recentInteractions.length >= 2) {
      score += 10;
    } else if (recentInteractions.length === 1) {
      score += 5;
    } else {
      score -= 10;
    }
  } else {
    // No interactions at all should have a significant penalty
    score -= 15;
  }

  // The rest of the function remains the same...

  // Emotional ratings impact
  if (relationship.emotionHistory.length > 0) {
    const recentEmotions = relationship.emotionHistory.filter(emotion => {
      const emotionDate = new Date(emotion.date);
      const daysSinceEmotion = Math.floor(
        (new Date().getTime() - emotionDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceEmotion <= 30;
    });

    if (recentEmotions.length > 0) {
      const averageRating = recentEmotions.reduce((sum, emotion) => sum + emotion.rating, 0) / recentEmotions.length;
      if (averageRating >= 7) {
        score += 15;
      } else if (averageRating >= 5) {
        score += 10;
      } else if (averageRating <= 3) {
        score -= 10;
      }
    }
  }

  // Goal completion impact
  if (relationship.goals.length > 0) {
    const completedGoals = relationship.goals.filter(goal => goal.completed);
    const completionRate = completedGoals.length / relationship.goals.length;

    if (completionRate >= 0.7) {
      score += 10;
    } else if (completionRate < 0.3) {
      score -= 10;
    }
  }

  // Shared memories impact
  if (relationship.sharedMemories.length > 0) {
    const recentMemories = relationship.sharedMemories.filter(memory => {
      const memoryDate = new Date(memory.date);
      const daysSinceMemory = Math.floor(
        (new Date().getTime() - memoryDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceMemory <= 30;
    });

    if (recentMemories.length > 0) {
      score += 5;
    }
  }

  // Important dates impact
  if (relationship.importantDates.length > 0) {
    const upcomingDates = relationship.importantDates.filter(date => {
      const dateObj = new Date(date.date);
      const daysUntilDate = Math.floor(
        (dateObj.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysUntilDate >= 0 && daysUntilDate <= 30;
    });

    if (upcomingDates.length > 0) {
      score += 5;
    }
  }

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
}

// Helper function to calculate average days between interactions
function calculateAverageDaysBetweenInteractions(interactions: Interaction[]): number {
  if (interactions.length < 2) return 0;
  
  const sortedInteractions = [...interactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let totalDays = 0;
  for (let i = 1; i < sortedInteractions.length; i++) {
    const days = Math.floor(
      (new Date(sortedInteractions[i].date).getTime() - new Date(sortedInteractions[i-1].date).getTime()) 
      / (1000 * 60 * 60 * 24)
    );
    totalDays += days;
  }
  
  return totalDays / (sortedInteractions.length - 1);
}

// Get connection status text and color based on score
export function getConnectionStatus(score: number): { text: string; color: string } {
  if (score >= 90) return { text: 'Excellent', color: '#10B981' }; // Green
  if (score >= 75) return { text: 'Strong', color: '#3B82F6' };    // Blue
  if (score >= 60) return { text: 'Good', color: '#60A5FA' };      // Light blue
  if (score >= 45) return { text: 'Needs attention', color: '#F59E0B' }; // Amber
  if (score >= 30) return { text: 'Weakening', color: '#F97316' }; // Orange
  return { text: 'Critical', color: '#EF4444' };                   // Red
}