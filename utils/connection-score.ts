import { Relationship, Interaction } from '@/types/relationship';

// Calculate connection score based on interaction frequency and recency
export function calculateConnectionScore(relationship: Relationship): number {
  if (!relationship.interactions.length) {
    return Math.max(50, relationship.connectionScore - 10); // Initial decay if no interactions
  }

  // Sort interactions by date (newest first)
  const sortedInteractions = [...relationship.interactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const lastInteractionDate = new Date(sortedInteractions[0].date);
  const now = new Date();
  
  // Calculate days since last interaction
  const daysSinceLastInteraction = Math.floor(
    (now.getTime() - lastInteractionDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate interaction frequency (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentInteractions = relationship.interactions.filter(
    interaction => new Date(interaction.date) >= thirtyDaysAgo
  );

  // Enhanced decay rate calculation based on relationship type and history
  let decayRate = 1; // Default decay rate (1 point per day)
  
  // Base decay rate on relationship tags
  if (relationship.tags.includes('spouse') || relationship.tags.includes('partner')) {
    decayRate = 2.5; // Faster decay for closest relationships
  } else if (relationship.tags.includes('family')) {
    decayRate = 2; // High decay for family
  } else if (relationship.tags.includes('mentor') || relationship.tags.includes('mentee')) {
    decayRate = 1.8; // Moderate-high decay for mentorship relationships
  } else if (relationship.tags.includes('friend')) {
    decayRate = 1.5; // Moderate decay for friends
  } else if (relationship.tags.includes('colleague')) {
    decayRate = 0.8; // Slower decay for professional relationships
  }

  // Adjust decay rate based on interaction history
  const avgDaysBetweenInteractions = calculateAverageDaysBetweenInteractions(relationship.interactions);
  if (avgDaysBetweenInteractions > 0) {
    // If current gap is significantly longer than average, increase decay
    if (daysSinceLastInteraction > avgDaysBetweenInteractions * 1.5) {
      decayRate *= 1.2;
    }
    // If current gap is shorter than average, decrease decay
    else if (daysSinceLastInteraction < avgDaysBetweenInteractions * 0.5) {
      decayRate *= 0.8;
    }
  }

  // Calculate new score
  let newScore = relationship.connectionScore;
  
  // Decay based on time since last interaction
  newScore -= Math.min(daysSinceLastInteraction * decayRate, 25); // Cap at 25 points max decay
  
  // Boost from recent interactions
  const interactionBoost = Math.min(recentInteractions.length * 3, 15);
  newScore += interactionBoost;
  
  // Enhanced emotional rating impact
  const recentEmotionRatings = recentInteractions
    .filter(i => i.emotionRating)
    .map(i => i.emotionRating as number);
    
  if (recentEmotionRatings.length > 0) {
    const avgRating = recentEmotionRatings.reduce((sum, rating) => sum + rating, 0) / recentEmotionRatings.length;
    // Increased emotional impact for closer relationships
    const emotionalMultiplier = relationship.tags.includes('spouse') || relationship.tags.includes('partner') ? 1.5 : 1;
    newScore += (avgRating - 5) * emotionalMultiplier; // Adjust score based on average emotion (-7.5 to +7.5)
  }

  // Boost for upcoming important dates
  const upcomingDates = relationship.importantDates.filter(date => {
    const eventDate = new Date(date.date);
    if (date.recurring) {
      eventDate.setFullYear(now.getFullYear());
      if (eventDate < now) {
        eventDate.setFullYear(now.getFullYear() + 1);
      }
    }
    return eventDate >= now && eventDate <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  });
  
  if (upcomingDates.length > 0) {
    newScore += Math.min(upcomingDates.length * 2, 5); // Small boost for upcoming dates
  }
  
  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, newScore));
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