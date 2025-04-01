import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRelationshipStore } from '@/store/relationship-store';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function AddGoalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getRelationshipById, addGoal } = useRelationshipStore();
  
  const relationship = getRelationshipById(id);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  
  if (!relationship) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Relationship not found</Text>
      </View>
    );
  }
  
  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a title for the goal');
      return;
    }
    
    // Validate date format if provided (YYYY-MM-DD)
    if (targetDate) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(targetDate)) {
        alert('Please enter a valid date in YYYY-MM-DD format');
        return;
      }
    }
    
    addGoal(id, {
      title: title.trim(),
      description: description.trim(),
      targetDate: targetDate || undefined,
      completed: false,
    });
    
    router.back();
  };
  
  return (
    <>
      <Stack.Screen options={{ title: `Add Goal with ${relationship.name}` }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Add Relationship Goal</Text>
          
          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Goal Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Plan a weekend trip, Have monthly dinners"
              placeholderTextColor={Colors.dark.subtext}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          
          {/* Description Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add more details about this goal..."
              placeholderTextColor={Colors.dark.subtext}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          {/* Target Date Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Target Date (Optional)</Text>
            <Text style={styles.dateHint}>Format: YYYY-MM-DD</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2023-12-31"
              placeholderTextColor={Colors.dark.subtext}
              value={targetDate}
              onChangeText={setTargetDate}
              keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
            />
          </View>
          
          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Save Goal"
              onPress={handleSave}
              fullWidth
              disabled={!title.trim()}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    padding: 16,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
  },
  notFoundText: {
    color: Colors.dark.text,
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 8,
  },
  dateHint: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    color: Colors.dark.text,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
});