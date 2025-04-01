import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Clock, Calendar } from 'lucide-react-native';
import { Relationship } from '@/types/relationship';
import ConnectionScoreRing from './ConnectionScoreRing';
import Colors from '@/constants/colors';

interface RelationshipCardProps {
  relationship: Relationship;
}

export default function RelationshipCard({ relationship }: RelationshipCardProps) {
  const router = useRouter();
  const { id, name, avatar, tags, connectionScore, lastInteraction } = relationship;
  
  const formattedDate = lastInteraction 
    ? new Date(lastInteraction).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    : 'Never';
  
  const handlePress = () => {
    router.push(`/relationship/${id}`);
  };
  
  return (
    <Pressable 
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed
      ]}
      onPress={handlePress}
    >
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>{name.charAt(0)}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.lastInteractionContainer}>
          <Clock size={14} color={Colors.dark.subtext} />
          <Text style={styles.lastInteractionText}>
            Last: {formattedDate}
          </Text>
        </View>
      </View>
      
      <View style={styles.scoreContainer}>
        <ConnectionScoreRing score={connectionScore} size={60} showLabel={false} />
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
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.8,
    backgroundColor: '#252525',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  placeholderAvatar: {
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: Colors.dark.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    color: Colors.dark.subtext,
    fontSize: 12,
  },
  lastInteractionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastInteractionText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginLeft: 4,
  },
  scoreContainer: {
    marginLeft: 8,
  },
});