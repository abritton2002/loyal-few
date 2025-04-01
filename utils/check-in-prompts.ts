import { Relationship, RelationshipTag } from '@/types/relationship';

interface CheckInPrompt {
  text: string;
  type: 'general' | 'specific' | 'emotional' | 'goal';
}

// Generate personalized check-in prompts based on relationship data
export function generateCheckInPrompts(relationship: Relationship): CheckInPrompt[] {
  const prompts: CheckInPrompt[] = [];
  const { name, tags, lastInteraction, goals, emotionHistory } = relationship;
  
  // General prompts based on relationship type
  if (tags.includes('spouse') || tags.includes('partner')) {
    prompts.push({ 
      text: `How is ${name} feeling today?`, 
      type: 'emotional' 
    });
    prompts.push({ 
      text: `What's something you appreciate about ${name}?`, 
      type: 'emotional' 
    });
  }
  
  if (tags.includes('family')) {
    prompts.push({ 
      text: `When did you last have a meaningful conversation with ${name}?`, 
      type: 'general' 
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
  
  // Time-based prompts
  if (lastInteraction) {
    const daysSinceLastInteraction = Math.floor(
      (new Date().getTime() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastInteraction > 14) {
      prompts.push({ 
        text: `It's been ${daysSinceLastInteraction} days since you connected with ${name}. What's a good way to reach out?`, 
        type: 'specific' 
      });
    }
  }
  
  // Goal-based prompts
  const incompleteGoals = goals.filter(goal => !goal.completed);
  if (incompleteGoals.length > 0) {
    const randomGoal = incompleteGoals[Math.floor(Math.random() * incompleteGoals.length)];
    prompts.push({ 
      text: `You have a goal with ${name}: "${randomGoal.title}". What progress have you made?`, 
      type: 'goal' 
    });
  }
  
  // Emotional check-in prompts
  if (emotionHistory.length > 0) {
    const latestEmotion = emotionHistory[emotionHistory.length - 1];
    if (latestEmotion.rating < 5) {
      prompts.push({ 
        text: `Last time you noted your connection with ${name} wasn't great. Has anything improved?`, 
        type: 'emotional' 
      });
    }
  }
  
  // Add some universal prompts
  prompts.push({ 
    text: `What's something important happening in ${name}'s life right now?`, 
    type: 'general' 
  });
  
  prompts.push({ 
    text: `What's one thing you could do to strengthen your relationship with ${name}?`, 
    type: 'general' 
  });
  
  // Return 3 random prompts
  return shuffleArray(prompts).slice(0, 3);
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}