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

  // Base decay rate depends on relationship type
  let decayRate = 1; // Default decay rate (1 point per day)
  
  // Adjust decay rate based on relationship tags
  if (relationship.tags.includes('spouse') || relationship.tags.includes('partner')) {
    decayRate = 2; // Faster decay for closer relationships
  } else if (relationship.tags.includes('family')) {
    decayRate = 1.5;
  } else if (relationship.tags.includes('colleague')) {
    decayRate = 0.7; // Slower decay for professional relationships
  }

  // Calculate new score
  let newScore = relationship.connectionScore;
  
  // Decay based on time since last interaction
  newScore -= Math.min(daysSinceLastInteraction * decayRate, 20); // Cap at 20 points max decay
  
  // Boost from recent interactions
  newScore += Math.min(recentInteractions.length * 3, 15); // Cap at 15 points max boost
  
  // Add emotional rating bonus if available
  const recentEmotionRatings = recentInteractions
    .filter(i => i.emotionRating)
    .map(i => i.emotionRating as number);
    
  if (recentEmotionRatings.length > 0) {
    const avgRating = recentEmotionRatings.reduce((sum, rating) => sum + rating, 0) / recentEmotionRatings.length;
    newScore += (avgRating - 5); // Adjust score based on average emotion (-5 to +5)
  }
  
  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, newScore));
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