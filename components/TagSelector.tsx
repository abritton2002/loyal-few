import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { RelationshipTag } from '@/types/relationship';
import Colors from '@/constants/colors';

interface TagSelectorProps {
  selectedTags: RelationshipTag[];
  onTagToggle: (tag: RelationshipTag) => void;
}

export default function TagSelector({ selectedTags, onTagToggle }: TagSelectorProps) {
  const availableTags: RelationshipTag[] = [
    'spouse', 'partner', 'family', 'friend', 'colleague', 'mentor', 'mentee', 'business'
  ];
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {availableTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <Pressable
            key={tag}
            style={[
              styles.tagButton,
              isSelected && styles.selectedTagButton
            ]}
            onPress={() => onTagToggle(tag)}
          >
            <Text 
              style={[
                styles.tagText,
                isSelected && styles.selectedTagText
              ]}
            >
              {tag}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  tagButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginRight: 8,
  },
  selectedTagButton: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  tagText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedTagText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
});