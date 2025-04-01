import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getConnectionStatus } from '@/utils/connection-score';
import Colors from '@/constants/colors';

interface ConnectionScoreRingProps {
  score: number;
  size?: number;
  showLabel?: boolean;
  showText?: boolean;
}

export default function ConnectionScoreRing({ 
  score, 
  size = 80, 
  showLabel = true,
  showText = true
}: ConnectionScoreRingProps) {
  const { text, color } = getConnectionStatus(score);
  const strokeWidth = size * 0.1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background circle */}
      <View style={[
        styles.ring, 
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: Colors.dark.border
        }
      ]} />
      
      {/* Progress circle */}
      <View style={[
        styles.progressRing,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: color,
          // This creates a partial border based on the score
          borderTopColor: score > 75 ? color : 'transparent',
          borderRightColor: score > 50 ? color : 'transparent',
          borderBottomColor: score > 25 ? color : 'transparent',
          borderLeftColor: color,
          transform: [{ rotate: `${score * 3.6}deg` }]
        }
      ]} />
      
      {/* Score text */}
      {showText && (
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, { fontSize: size * 0.25 }]}>
            {Math.round(score)}
          </Text>
        </View>
      )}
      
      {/* Status label */}
      {showLabel && (
        <Text style={[styles.statusText, { color }]}>
          {text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  statusText: {
    position: 'absolute',
    bottom: -24,
    fontSize: 12,
    fontWeight: '600',
  }
});