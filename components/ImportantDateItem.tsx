import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Calendar, Gift, Award } from 'lucide-react-native';
import { ImportantDate } from '@/types/relationship';
import Colors from '@/constants/colors';

interface ImportantDateItemProps {
  date: ImportantDate;
  onPress?: () => void;
}

export default function ImportantDateItem({ date, onPress }: ImportantDateItemProps) {
  const { title, date: dateString, type, recurring } = date;
  
  const getTypeIcon = () => {
    switch (type) {
      case 'birthday': return <Gift size={18} color="#F472B6" />; // Pink
      case 'anniversary': return <Award size={18} color={Colors.dark.accent} />;
      default: return <Calendar size={18} color={Colors.dark.primary} />;
    }
  };
  
  // Format date
  const formatDate = () => {
    const dateObj = new Date(dateString);
    
    // For birthdays and recurring events, we only show month and day
    if (recurring) {
      return dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      });
    }
    
    // For non-recurring events, show full date
    return dateObj.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Calculate days until next occurrence
  const getDaysUntil = () => {
    const today = new Date();
    const eventDate = new Date(dateString);
    
    if (recurring) {
      // Set event to current year
      eventDate.setFullYear(today.getFullYear());
      
      // If the date has already passed this year, set to next year
      if (eventDate < today) {
        eventDate.setFullYear(today.getFullYear() + 1);
      }
    }
    
    // Calculate difference in days
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today!";
    if (diffDays === 1) return "Tomorrow";
    return `In ${diffDays} days`;
  };
  
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
      <View style={styles.iconContainer}>
        {getTypeIcon()}
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.dateText}>{formatDate()}</Text>
      </View>
      
      <View style={styles.countdownContainer}>
        <Text style={styles.countdownText}>{getDaysUntil()}</Text>
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
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: '#252525',
  },
  pressable: {
    // Additional styles for pressable items
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  titleText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  countdownContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
  },
  countdownText: {
    color: Colors.dark.accent,
    fontSize: 12,
    fontWeight: '600',
  },
});