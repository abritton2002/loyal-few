import { Relationship } from '@/types/relationship';

export type CheckInPrompt = {
  text: string;
  type: 'general' | 'specific' | 'emotional' | 'goal';
};

// Generate personalized check-in prompts based on relationship data
export function generateCheckInPrompts(relationship: Relationship): CheckInPrompt[] {
  const prompts: CheckInPrompt[] = [];
  const { name, tags, lastInteraction, goals, emotionHistory, connectionScore } = relationship;
  
  // Get days since last interaction
  const daysSinceLastInteraction = lastInteraction 
    ? Math.floor((new Date().getTime() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Get recent emotional trend
  const recentEmotions = emotionHistory
    .slice(-3)
    .map(r => r.rating);
  const emotionalTrend = recentEmotions.length > 0
    ? recentEmotions.reduce((sum, rating) => sum + rating, 0) / recentEmotions.length
    : null;

  // Get upcoming important dates
  const upcomingDates = relationship.importantDates.filter(date => {
    const eventDate = new Date(date.date);
    if (date.recurring) {
      eventDate.setFullYear(new Date().getFullYear());
      if (eventDate < new Date()) {
        eventDate.setFullYear(new Date().getFullYear() + 1);
      }
    }
    return eventDate >= new Date() && eventDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  });

  // Connection score based prompts
  if (connectionScore < 40) {
    prompts.push({
      text: `Your connection with ${name} needs attention. What's one small way you can reach out today?`,
      type: 'specific'
    });
  } else if (connectionScore > 80) {
    prompts.push({
      text: `You're doing great staying connected with ${name}! What's something you appreciate about this relationship?`,
      type: 'emotional'
    });
  }

  // Time-based prompts
  if (daysSinceLastInteraction !== null) {
    if (daysSinceLastInteraction > 14) {
      prompts.push({
        text: `It's been ${daysSinceLastInteraction} days since you connected with ${name}. Want to schedule a catch-up?`,
        type: 'specific'
      });
    } else if (daysSinceLastInteraction < 3) {
      prompts.push({
        text: `You recently connected with ${name}. How did that interaction make you feel?`,
        type: 'emotional'
      });
    }
  }

  // Emotional trend based prompts
  if (emotionalTrend !== null) {
    if (emotionalTrend < 5) {
      prompts.push({
        text: `Your recent interactions with ${name} have been challenging. What's one thing you can do to improve the connection?`,
        type: 'emotional'
      });
    } else if (emotionalTrend > 8) {
      prompts.push({
        text: `Your connection with ${name} is thriving! What's working well?`,
        type: 'emotional'
      });
    }
  }

  // Goal-based prompts
  const incompleteGoals = goals.filter(goal => !goal.completed);
  if (incompleteGoals.length > 0) {
    const nextGoal = incompleteGoals[0];
    prompts.push({
      text: `You have an open goal with ${name}: "${nextGoal.title}". Want to make progress on it?`,
      type: 'goal'
    });
  }

  // Upcoming dates prompts
  if (upcomingDates.length > 0) {
    const nextDate = upcomingDates[0];
    const daysUntil = Math.floor(
      (new Date(nextDate.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntil <= 7) {
      prompts.push({
        text: `${name}'s ${nextDate.title} is coming up in ${daysUntil} days. Want to plan something special?`,
        type: 'specific'
      });
    }
  }

  // Relationship type specific prompts
  if (tags.includes('spouse') || tags.includes('partner')) {
    prompts.push({
      text: `What's one thing you love about your relationship with ${name}?`,
      type: 'emotional'
    });
    prompts.push({
      text: `How can you show ${name} you care today?`,
      type: 'specific'
    });
  }
  
  if (tags.includes('family')) {
    prompts.push({
      text: `What's a favorite memory you share with ${name}?`,
      type: 'emotional'
    });
  }
  
  if (tags.includes('friend')) {
    prompts.push({
      text: `What activities do you and ${name} enjoy doing together?`,
      type: 'general'
    });
  }
  
  if (tags.includes('colleague') || tags.includes('business')) {
    prompts.push({
      text: `What professional goals does ${name} have right now?`,
      type: 'specific'
    });
  }
  
  if (tags.includes('mentor')) {
    prompts.push({
      text: `What advice from ${name} have you applied recently?`,
      type: 'specific'
    });
  }

  // Ensure we have at least 3 prompts
  while (prompts.length < 3) {
    prompts.push({
      text: `How can you strengthen your connection with ${name} today?`,
      type: 'general'
    });
  }

  // Return 3 random prompts
  return prompts.sort(() => Math.random() - 0.5).slice(0, 3);
}