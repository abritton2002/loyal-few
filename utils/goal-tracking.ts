import { Relationship, Goal } from '@/types/relationship';

export function calculateGoalProgress(goal: Goal): number {
  if (goal.completed) return 100;
  return goal.progress || 0;
}

export function getGoalInsights(relationship: Relationship): string[] {
  const insights: string[] = [];

  if (relationship.goals.length === 0) {
    insights.push('no goals');
    return insights;
  }

  const now = new Date();
  const sortedGoals = [...relationship.goals].sort((a, b) => {
    const dateA = a.targetDate ? new Date(a.targetDate) : new Date(0);
    const dateB = b.targetDate ? new Date(b.targetDate) : new Date(0);
    return dateA.getTime() - dateB.getTime();
  });

  // Completed goals
  const completedGoals = sortedGoals.filter(goal => goal.completed);
  if (completedGoals.length > 0) {
    insights.push('completed');
  }

  // Overdue goals
  const overdueGoals = sortedGoals.filter(
    goal => !goal.completed && goal.targetDate && new Date(goal.targetDate) < now
  );
  if (overdueGoals.length > 0) {
    insights.push('overdue');
  }

  // Upcoming goals
  const upcomingGoals = sortedGoals.filter(
    goal => !goal.completed && goal.targetDate && new Date(goal.targetDate) > now
  );
  if (upcomingGoals.length > 0) {
    insights.push('upcoming');
  }

  // Goal variety
  const goalTypes = new Set(sortedGoals.map(goal => goal.title.toLowerCase()));
  if (goalTypes.size > 2) {
    insights.push('variety');
  }

  return insights;
}

export function shouldUpdateGoal(goal: Goal): boolean {
  if (goal.completed) return false;
  if (!goal.targetDate) return false;

  const targetDate = new Date(goal.targetDate);
  const now = new Date();
  const daysUntilTarget = Math.floor(
    (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Update if goal is overdue or within 3 days of target date
  return daysUntilTarget <= 3;
} 