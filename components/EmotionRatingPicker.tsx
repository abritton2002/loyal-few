import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { EmotionRating } from '@/types/relationship';
import Colors from '@/constants/colors';

interface EmotionRatingPickerProps {
  value: EmotionRating | undefined;
  onChange: (rating: EmotionRating) => void;
}

export default function EmotionRatingPicker({ value, onChange }: EmotionRatingPickerProps) {
  const ratings: EmotionRating[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  
  const getRatingColor = (rating: number): string => {
    if (rating <= 3) return Colors.dark.danger;
    if (rating <= 5) return Colors.dark.warning;
    if (rating <= 7) return Colors.dark.primary;
    return Colors.dark.success;
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>How did this interaction feel?</Text>
      
      <View style={styles.ratingsContainer}>
        {ratings.map((rating) => (
          <Pressable
            key={rating}
            style={[
              styles.ratingButton,
              value === rating && { 
                backgroundColor: getRatingColor(rating),
                borderColor: getRatingColor(rating)
              }
            ]}
            onPress={() => onChange(rating)}
          >
            <Text 
              style={[
                styles.ratingText,
                value === rating && styles.selectedRatingText
              ]}
            >
              {rating}
            </Text>
          </Pressable>
        ))}
      </View>
      
      <View style={styles.labelContainer}>
        <Text style={styles.labelText}>Poor</Text>
        <Text style={styles.labelText}>Great</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  ratingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  ratingText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    fontWeight: '500',
  },
  selectedRatingText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  labelText: {
    color: Colors.dark.subtext,
    fontSize: 12,
  },
});