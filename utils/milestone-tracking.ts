import { Relationship, Milestone } from '@/types/relationship';

export function calculateMilestoneProgress(relationship: Relationship): number {
  if (relationship.milestones.length === 0) return 0;
  if (relationship.milestones.length === 1) return 1;

  const now = new Date();
  const sortedMilestones = [...relationship.milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate the time span between first and last milestone
  const firstMilestone = new Date(sortedMilestones[0].date);
  const lastMilestone = new Date(sortedMilestones[sortedMilestones.length - 1].date);
  const totalTimeSpan = lastMilestone.getTime() - firstMilestone.getTime();

  // Calculate the time span between first milestone and now
  const currentTimeSpan = now.getTime() - firstMilestone.getTime();

  // Calculate progress as a ratio of current time span to total time span
  const progress = Math.min(currentTimeSpan / totalTimeSpan, 1);
  return Math.floor(progress * 100);
}

export function getMilestoneInsights(relationship: Relationship): string[] {
  const insights: string[] = [];

  if (relationship.milestones.length === 0) {
    insights.push('You have no recorded milestones with this person');
    return insights;
  }

  const now = new Date();
  const sortedMilestones = [...relationship.milestones].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Recent milestones
  const recentMilestones = sortedMilestones.filter(milestone => {
    const milestoneDate = new Date(milestone.date);
    const daysSinceMilestone = Math.floor(
      (now.getTime() - milestoneDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceMilestone <= 30;
  });

  if (recentMilestones.length > 0) {
    insights.push(
      `You've reached ${recentMilestones.length} milestone${
        recentMilestones.length === 1 ? '' : 's'
      } recently`
    );
  }

  // Upcoming milestones
  const upcomingMilestones = sortedMilestones.filter(milestone => {
    const milestoneDate = new Date(milestone.date);
    return milestoneDate > now;
  });

  if (upcomingMilestones.length > 0) {
    insights.push(
      `You have ${upcomingMilestones.length} upcoming milestone${
        upcomingMilestones.length === 1 ? '' : 's'
      }`
    );
  }

  // Milestone variety
  const milestoneTypes = new Set(
    sortedMilestones.map(milestone => milestone.title.toLowerCase())
  );
  if (milestoneTypes.size > 2) {
    insights.push('You have a variety of different milestones');
  }

  return insights;
}

export function shouldCelebrateMilestone(milestone: Milestone): boolean {
  const now = new Date();
  const milestoneDate = new Date(milestone.date);
  const daysUntilMilestone = Math.floor(
    (milestoneDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Celebrate if milestone is within 7 days in the future or past
  return Math.abs(daysUntilMilestone) <= 7;
} 