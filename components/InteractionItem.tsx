import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Phone, MessageSquare, Users, Gift, FileText } from 'lucide-react-native';
import { Interaction } from '@/types/relationship';
import Colors from '@/constants/colors';

interface InteractionItemProps {
  interaction: Interaction;
  onPress?: () => void;
}

export default function InteractionItem({ interaction, onPress }: InteractionItemProps) {
  const { type, date, notes, emotionRating } = interaction;
  
  const getTypeIcon = () => {
    switch (type) {
      case 'call': return <Phone size={18} color={Colors.dark.primary} />;
      case 'message': return <MessageSquare size={18} color={Colors.dark.accent} />;
      case 'meeting': return <Users size={18} color={Colors.dark.success} />;
      case 'gift': return <Gift size={18} color="#E879F9" />; // Purple
      default: return <FileText size={18} color={Colors.dark.secondary} />;
    }
  };
  
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  const getEmotionColor = (rating?: number) => {
    if (!rating) return Colors.dark.subtext;
    if (rating <= 3) return Colors.dark.danger;
    if (rating <= 5) return Colors.dark.warning;
    if (rating <= 7) return Colors.dark.primary;
    return Colors.dark.success;
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
        <View style={styles.headerContainer}>
          <Text style={styles.typeText}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>
        
        {notes ? (
          <Text style={styles.notesText} numberOfLines={2}>
            {notes}
          </Text>
        ) : null}
        
        {emotionRating ? (
          <View style={styles.ratingContainer}>
            <View 
              style={[
                styles.ratingBadge, 
                { backgroundColor: getEmotionColor(emotionRating) }
              ]}
            >
              <Text style={styles.ratingText}>{emotionRating}</Text>
            </View>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
  },
  dateText: {
    color: Colors.dark.subtext,
    fontSize: 12,
  },
  notesText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    lineHeight: 20,
  },
  ratingContainer: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ratingText: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
});