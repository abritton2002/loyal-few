/// <reference types="jest" />
import { calculateEmotionTrend, getEmotionInsights } from '@/utils/emotion-tracking';
import { EmotionRating } from '@/types/relationship';

describe('Emotion Tracking Utils', () => {
  const mockEmotionHistory = [
    { date: '2024-01-01T00:00:00Z', rating: 8 as EmotionRating },
    { date: '2024-01-08T00:00:00Z', rating: 9 as EmotionRating },
    { date: '2024-01-15T00:00:00Z', rating: 7 as EmotionRating },
    { date: '2024-01-22T00:00:00Z', rating: 8 as EmotionRating }
  ];

  describe('calculateEmotionTrend', () => {
    it('calculates positive trend for increasing ratings', () => {
      const increasingRatings = [
        { date: '2024-01-01T00:00:00Z', rating: 5 as EmotionRating },
        { date: '2024-01-08T00:00:00Z', rating: 7 as EmotionRating },
        { date: '2024-01-15T00:00:00Z', rating: 8 as EmotionRating }
      ];
      const trend = calculateEmotionTrend(increasingRatings);
      expect(trend).toBeGreaterThan(0);
    });

    it('calculates negative trend for decreasing ratings', () => {
      const decreasingRatings = [
        { date: '2024-01-01T00:00:00Z', rating: 8 as EmotionRating },
        { date: '2024-01-08T00:00:00Z', rating: 6 as EmotionRating },
        { date: '2024-01-15T00:00:00Z', rating: 5 as EmotionRating }
      ];
      const trend = calculateEmotionTrend(decreasingRatings);
      expect(trend).toBeLessThan(0);
    });

    it('returns 0 for stable ratings', () => {
      const stableRatings = [
        { date: '2024-01-01T00:00:00Z', rating: 7 as EmotionRating },
        { date: '2024-01-08T00:00:00Z', rating: 7 as EmotionRating },
        { date: '2024-01-15T00:00:00Z', rating: 7 as EmotionRating }
      ];
      const trend = calculateEmotionTrend(stableRatings);
      expect(trend).toBe(0);
    });

    it('handles empty emotion history', () => {
      const trend = calculateEmotionTrend([]);
      expect(trend).toBe(0);
    });
  });

  describe('getEmotionInsights', () => {
    it('provides insights for consistent positive emotions', () => {
      const positiveRatings = [
        { date: '2024-01-01T00:00:00Z', rating: 8 as EmotionRating },
        { date: '2024-01-08T00:00:00Z', rating: 9 as EmotionRating },
        { date: '2024-01-15T00:00:00Z', rating: 8 as EmotionRating }
      ];
      const insights = getEmotionInsights(positiveRatings);
      expect(insights).toContain('consistently positive');
    });

    it('provides insights for emotional volatility', () => {
      const volatileRatings = [
        { date: '2024-01-01T00:00:00Z', rating: 9 as EmotionRating },
        { date: '2024-01-08T00:00:00Z', rating: 3 as EmotionRating },
        { date: '2024-01-15T00:00:00Z', rating: 8 as EmotionRating }
      ];
      const insights = getEmotionInsights(volatileRatings);
      expect(insights).toContain('volatile');
    });

    it('provides insights for improving emotions', () => {
      const improvingRatings = [
        { date: '2024-01-01T00:00:00Z', rating: 4 as EmotionRating },
        { date: '2024-01-08T00:00:00Z', rating: 6 as EmotionRating },
        { date: '2024-01-15T00:00:00Z', rating: 8 as EmotionRating }
      ];
      const insights = getEmotionInsights(improvingRatings);
      expect(insights).toContain('improving');
    });

    it('handles empty emotion history', () => {
      const insights = getEmotionInsights([]);
      expect(insights).toContain('insufficient data');
    });
  });
}); 