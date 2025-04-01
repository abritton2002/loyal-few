import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  Pressable
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, MessageSquare, Users, Gift, FileText } from 'lucide-react-native';
import { useRelationshipStore } from '@/store/relationship-store';
import { EmotionRating } from '@/types/relationship';
import EmotionRatingPicker from '@/components/EmotionRatingPicker';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

type InteractionType = 'call' | 'message' | 'meeting' | 'gift' | 'other';

export default function AddInteractionScreen() {
  const { id, promptText } = useLocalSearchParams<{ id: string, promptText?: string }>();
  const router = useRouter();
  const { getRelationshipById, addInteraction } = useRelationshipStore();
  
  const relationship = getRelationshipById(id);
  
  const [type, setType] = useState<InteractionType>('meeting');
  const [notes, setNotes] = useState(promptText || '');
  const [emotionRating, setEmotionRating] = useState<EmotionRating | undefined>(undefined);
  
  if (!relationship) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Relationship not found</Text>
      </View>
    );
  }
  
  const handleSave = () => {
    addInteraction(id, {
      date: new Date().toISOString(),
      type,
      notes,
      emotionRating,
    });
    
    router.back();
  };
  
  const interactionTypes: { type: InteractionType; icon: React.ReactNode; label: string }[] = [
    { type: 'call', icon: <Phone size={24} color={Colors.dark.primary} />, label: 'Call' },
    { type: 'message', icon: <MessageSquare size={24} color={Colors.dark.accent} />, label: 'Message' },
    { type: 'meeting', icon: <Users size={24} color={Colors.dark.success} />, label: 'Meeting' },
    { type: 'gift', icon: <Gift size={24} color="#E879F9" />, label: 'Gift' },
    { type: 'other', icon: <FileText size={24} color={Colors.dark.secondary} />, label: 'Other' },
  ];
  
  return (
    <>
      <Stack.Screen options={{ title: `Log Interaction with ${relationship.name}` }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Log an Interaction</Text>
          
          {/* Interaction Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type of Interaction</Text>
            <View style={styles.typeContainer}>
              {interactionTypes.map((item) => (
                <Pressable
                  key={item.type}
                  style={[
                    styles.typeButton,
                    type === item.type && styles.selectedTypeButton
                  ]}
                  onPress={() => setType(item.type)}
                >
                  <View style={styles.typeIconContainer}>
                    {item.icon}
                  </View>
                  <Text 
                    style={[
                      styles.typeText,
                      type === item.type && styles.selectedTypeText
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          
          {/* Notes Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="What did you talk about? How did it go?"
              placeholderTextColor={Colors.dark.subtext}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
          
          {/* Emotion Rating */}
          <View style={styles.section}>
            <EmotionRatingPicker
              value={emotionRating}
              onChange={setEmotionRating}
            />
          </View>
          
          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Save Interaction"
              onPress={handleSave}
              fullWidth
              disabled={!notes.trim()}
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
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    width: '30%',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedTypeButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  typeIconContainer: {
    marginBottom: 8,
  },
  typeText: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  selectedTypeText: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    color: Colors.dark.text,
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
});