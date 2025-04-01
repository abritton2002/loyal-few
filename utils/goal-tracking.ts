import { Relationship, Goal } from '@/types/relationship';

export function calculateGoalProgress(goal: Goal): number {
  if (goal.completed) return 100;
  return goal.progress || 0;
}

export function getGoalInsights(relationship: Relationship): string[] {
  const insights: string[] = [];

  if (relationship.goals.length === 0) {
    insights.push('You have no goals set for this relationship');
    return insights;
  }

  const completedGoals = relationship.goals.filter(goal => goal.completed);
  const upcomingGoals = relationship.goals.filter(goal => {
    if (goal.completed) return false;
    const targetDate = new Date(goal.targetDate || '');
    return targetDate > new Date();
  });
  const overdueGoals = relationship.goals.filter(goal => {
    if (goal.completed) return false;
    const targetDate = new Date(goal.targetDate || '');
    return targetDate < new Date();
  });

  if (completedGoals.length > 0) {
    insights.push(`You've completed ${completedGoals.length} goal${
      completedGoals.length === 1 ? '' : 's'
    }`);
  }

  if (upcomingGoals.length > 0) {
    insights.push(`You have ${upcomingGoals.length} upcoming goal${
      upcomingGoals.length === 1 ? '' : 's'
    }`);
  }

  if (overdueGoals.length > 0) {
    insights.push(`You have ${overdueGoals.length} overdue goal${
      overdueGoals.length === 1 ? '' : 's'
    }`);
  }

  // Add specific insights for goals near their target date
  const now = new Date();
  const nearDeadlineGoals = relationship.goals.filter(goal => {
    if (goal.completed || !goal.targetDate) return false;
    const targetDate = new Date(goal.targetDate);
    const daysUntilTarget = Math.floor(
      (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysUntilTarget >= 0 && daysUntilTarget <= 3;
  });

  if (nearDeadlineGoals.length > 0) {
    insights.push(
      `${nearDeadlineGoals.length} goal${
        nearDeadlineGoals.length === 1 ? ' is' : 's are'
      } due soon`
    );
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