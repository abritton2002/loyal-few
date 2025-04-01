import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface CheckInPromptProps {
  text: string;
  type: 'general' | 'specific' | 'emotional' | 'goal';
  onPress: () => void;
}

export default function CheckInPrompt({ text, type, onPress }: CheckInPromptProps) {
  // Get color based on prompt type
  const getTypeColor = () => {
    switch (type) {
      case 'emotional': return Colors.dark.accent;
      case 'specific': return Colors.dark.primary;
      case 'goal': return Colors.dark.success;
      default: return Colors.dark.secondary;
    }
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        { borderLeftColor: getTypeColor() },
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.iconContainer}>
        <ArrowRight size={20} color={Colors.dark.subtext} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: '#252525',
  },
  content: {
    flex: 1,
  },
  text: {
    color: Colors.dark.text,
    fontSize: 16,
    lineHeight: 22,
  },
  iconContainer: {
    marginLeft: 12,
  },
});