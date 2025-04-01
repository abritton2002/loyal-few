import { Relationship, ImportantDate, ImportantDateType } from '@/types/relationship';

/**
 * Calculates upcoming important dates for a relationship
 */
export function calculateUpcomingDates(relationship: Relationship): ImportantDate[] {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return relationship.importantDates.filter(date => {
    const dateObj = new Date(date.date);
    // For recurring dates, check if the next occurrence is within 30 days
    if (date.recurring) {
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth();
      const day = dateObj.getDate();
      
      // Check this year's date
      const thisYearDate = new Date(year, month, day);
      if (thisYearDate > now && thisYearDate <= thirtyDaysFromNow) {
        return true;
      }
      
      // Check next year's date
      const nextYearDate = new Date(year + 1, month, day);
      return nextYearDate > now && nextYearDate <= thirtyDaysFromNow;
    }
    
    // For non-recurring dates, just check if they're in the future
    return dateObj > now && dateObj <= thirtyDaysFromNow;
  });
}

/**
 * Generates insights based on important dates
 */
export function getDateInsights(relationship: Relationship): string[] {
  const insights: string[] = [];
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  if (relationship.importantDates.length === 0) {
    insights.push('No important dates recorded');
    return insights;
  }

  // Check for upcoming dates
  const upcomingDates = relationship.importantDates.filter(date => {
    const dateObj = new Date(date.date);
    return dateObj > now && dateObj <= thirtyDaysFromNow;
  });

  if (upcomingDates.length > 0) {
    insights.push(`${upcomingDates.length} upcoming important date${upcomingDates.length > 1 ? 's' : ''}`);
  }

  // Check for recent dates
  const recentDates = relationship.importantDates.filter(date => {
    const dateObj = new Date(date.date);
    return dateObj >= sevenDaysAgo && dateObj <= now;
  });

  if (recentDates.length > 0) {
    insights.push(`${recentDates.length} recent important date${recentDates.length > 1 ? 's' : ''}`);
  }

  // Check for date variety
  const dateTypes = new Set(relationship.importantDates.map(date => date.type));
  if (dateTypes.size >= 3) {
    insights.push('Good variety of important dates');
  }

  return insights;
}

/**
 * Determines if a date should be reminded about
 */
export function shouldRemindDate(date: ImportantDate): boolean {
  const now = new Date();
  const dateObj = new Date(date.date);
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // For recurring dates, check if the next occurrence is within 7 days
  if (date.recurring) {
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth();
    const day = dateObj.getDate();
    
    // Check this year's date
    const thisYearDate = new Date(year, month, day);
    if (thisYearDate > now && thisYearDate <= sevenDaysFromNow) {
      return true;
    }
    
    // Check next year's date
    const nextYearDate = new Date(year + 1, month, day);
    return nextYearDate > now && nextYearDate <= sevenDaysFromNow;
  }
  
  // For non-recurring dates, check if they're within 7 days in either direction
  return (dateObj > now && dateObj <= sevenDaysFromNow) || 
         (dateObj >= sevenDaysAgo && dateObj <= now);
} 