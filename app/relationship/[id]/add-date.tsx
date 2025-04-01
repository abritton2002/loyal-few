import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView,
  Pressable,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Gift, Award } from 'lucide-react-native';
import { useRelationshipStore } from '@/store/relationship-store';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

type DateType = 'birthday' | 'anniversary' | 'other';

export default function AddImportantDateScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getRelationshipById, addImportantDate } = useRelationshipStore();
  
  const relationship = getRelationshipById(id);
  
  const [title, setTitle] = useState('');
  const [dateString, setDateString] = useState('');
  const [type, setType] = useState<DateType>('birthday');
  const [recurring, setRecurring] = useState(true);
  
  if (!relationship) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Relationship not found</Text>
      </View>
    );
  }
  
  const handleSave = () => {
    if (!title.trim() || !dateString) {
      alert('Please fill in all fields');
      return;
    }
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      alert('Please enter a valid date in YYYY-MM-DD format');
      return;
    }
    
    addImportantDate(id, {
      title: title.trim(),
      date: dateString,
      type,
      recurring,
    });
    
    router.back();
  };
  
  const dateTypes: { type: DateType; icon: React.ReactNode; label: string }[] = [
    { type: 'birthday', icon: <Gift size={24} color="#F472B6" />, label: 'Birthday' },
    { type: 'anniversary', icon: <Award size={24} color={Colors.dark.accent} />, label: 'Anniversary' },
    { type: 'other', icon: <Calendar size={24} color={Colors.dark.primary} />, label: 'Other' },
  ];
  
  return (
    <>
      <Stack.Screen options={{ title: `Add Important Date for ${relationship.name}` }} />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Add Important Date</Text>
          
          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Birthday, Anniversary, etc."
              placeholderTextColor={Colors.dark.subtext}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          
          {/* Date Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 1990-05-15"
              placeholderTextColor={Colors.dark.subtext}
              value={dateString}
              onChangeText={setDateString}
              keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
            />
          </View>
          
          {/* Date Type Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Type</Text>
            <View style={styles.typeContainer}>
              {dateTypes.map((item) => (
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
          
          {/* Recurring Toggle */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recurring Annually</Text>
            <View style={styles.recurringContainer}>
              <Pressable
                style={[
                  styles.recurringButton,
                  recurring && styles.selectedRecurringButton
                ]}
                onPress={() => setRecurring(true)}
              >
                <Text 
                  style={[
                    styles.recurringText,
                    recurring && styles.selectedRecurringText
                  ]}
                >
                  Yes
                </Text>
              </Pressable>
              
              <Pressable
                style={[
                  styles.recurringButton,
                  !recurring && styles.selectedRecurringButton
                ]}
                onPress={() => setRecurring(false)}
              >
                <Text 
                  style={[
                    styles.recurringText,
                    !recurring && styles.selectedRecurringText
                  ]}
                >
                  No
                </Text>
              </Pressable>
            </View>
          </View>
          
          {/* Save Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Save Important Date"
              onPress={handleSave}
              fullWidth
              disabled={!title.trim() || !dateString}
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
  input: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    color: Colors.dark.text,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  typeButton: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
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
  recurringContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recurringButton: {
    flex: 1,
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  selectedRecurringButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },
  recurringText: {
    color: Colors.dark.subtext,
    fontSize: 16,
    fontWeight: '500',
  },
  selectedRecurringText: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
});