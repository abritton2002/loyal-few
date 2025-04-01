import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Target, CheckCircle, Circle } from 'lucide-react-native';
import { Goal } from '@/types/relationship';
import Colors from '@/constants/colors';

interface GoalItemProps {
  goal: Goal;
  onToggle: () => void;
  onPress?: () => void;
}

export default function GoalItem({ goal, onToggle, onPress }: GoalItemProps) {
  const { title, description, targetDate, completed } = goal;
  
  // Format target date if exists
  const formattedDate = targetDate 
    ? new Date(targetDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : null;
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        onPress ? styles.pressable : null
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <Pressable 
        style={styles.checkboxContainer}
        onPress={onToggle}
        hitSlop={10}
      >
        {completed ? (
          <CheckCircle size={24} color={Colors.dark.success} />
        ) : (
          <Circle size={24} color={Colors.dark.border} />
        )}
      </Pressable>
      
      <View style={styles.contentContainer}>
        <Text 
          style={[
            styles.titleText,
            completed && styles.completedText
          ]}
        >
          {title}
        </Text>
        
        {description ? (
          <Text 
            style={[
              styles.descriptionText,
              completed && styles.completedText
            ]}
            numberOfLines={2}
          >
            {description}
          </Text>
        ) : null}
        
        {targetDate ? (
          <View style={styles.dateContainer}>
            <Target size={14} color={Colors.dark.subtext} />
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: '#252525',
  },
  pressable: {
    // Additional styles for pressable items
  },
  checkboxContainer: {
    marginRight: 12,
    padding: 2,
  },
  contentContainer: {
    flex: 1,
  },
  titleText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  descriptionText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginLeft: 4,
  },
});