import { EmotionRating } from '@/types/relationship';

interface EmotionEntry {
  date: string;
  rating: EmotionRating;
}

export function calculateEmotionTrend(emotionHistory: EmotionEntry[]): number {
  if (emotionHistory.length < 2) return 0;

  // Sort entries by date
  const sortedHistory = [...emotionHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Calculate the trend using linear regression
  const n = sortedHistory.length;
  const sumX = (n - 1) * n / 2;
  const sumY = sortedHistory.reduce((sum, entry) => sum + entry.rating, 0);
  const sumXY = sortedHistory.reduce(
    (sum, entry, index) => sum + entry.rating * index,
    0
  );
  const sumX2 = (n - 1) * n * (2 * n - 1) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  return slope;
}

export function getEmotionInsights(emotionHistory: EmotionEntry[]): string[] {
  const insights: string[] = [];

  if (emotionHistory.length < 3) {
    insights.push('Insufficient data to generate insights');
    return insights;
  }

  // Calculate average rating
  const avgRating = emotionHistory.reduce(
    (sum, entry) => sum + entry.rating,
    0
  ) / emotionHistory.length;

  // Calculate standard deviation
  const variance = emotionHistory.reduce(
    (sum, entry) => sum + Math.pow(entry.rating - avgRating, 2),
    0
  ) / emotionHistory.length;
  const stdDev = Math.sqrt(variance);

  // Calculate trend
  const trend = calculateEmotionTrend(emotionHistory);

  // Generate insights based on statistics
  if (avgRating >= 8) {
    insights.push('Your relationship is consistently positive');
  } else if (avgRating <= 3) {
    insights.push('Your relationship may need attention');
  }

  if (stdDev > 2) {
    insights.push('Your emotional connection is volatile');
  }

  if (trend > 0.5) {
    insights.push('Your relationship is improving');
  } else if (trend < -0.5) {
    insights.push('Your relationship may be declining');
  }

  // Add specific insights based on recent patterns
  const recentRatings = [...emotionHistory]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const recentAvg = recentRatings.reduce(
    (sum, entry) => sum + entry.rating,
    0
  ) / recentRatings.length;

  if (recentAvg > avgRating + 1) {
    insights.push('Recent interactions have been particularly positive');
  } else if (recentAvg < avgRating - 1) {
    insights.push('Recent interactions have been challenging');
  }

  return insights;
} 