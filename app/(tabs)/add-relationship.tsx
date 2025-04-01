import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRelationshipStore } from '@/store/relationship-store';
import { RelationshipTag } from '@/types/relationship';
import TagSelector from '@/components/TagSelector';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function AddRelationshipScreen() {
  const router = useRouter();
  const { addRelationship } = useRelationshipStore();
  
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<RelationshipTag[]>([]);
  const [notes, setNotes] = useState('');
  const [reminderFrequency, setReminderFrequency] = useState(7); // Default to weekly
  
  const handleTagToggle = (tag: RelationshipTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  
  const pickImage = async () => {
    if (Platform.OS !== 'web') {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }
    
    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };
  
  const removeImage = () => {
    setAvatar(undefined);
  };
  
  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a name');
      return;
    }
    
    if (selectedTags.length === 0) {
      alert('Please select at least one tag');
      return;
    }
    
    addRelationship({
      name: name.trim(),
      avatar,
      tags: selectedTags,
      notes,
      importantDates: [],
      interactions: [],
      goals: [],
      emotionHistory: [],
      reminderFrequency,
    });
    
    router.push('/relationships');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Add New Relationship</Text>
        
        {/* Avatar Picker */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity style={styles.avatarPicker} onPress={pickImage}>
            {avatar ? (
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <TouchableOpacity style={styles.removeButton} onPress={removeImage}>
                  <X size={16} color={Colors.dark.text} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Camera size={32} color={Colors.dark.subtext} />
                <Text style={styles.avatarText}>Add Photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter name"
            placeholderTextColor={Colors.dark.subtext}
            value={name}
            onChangeText={setName}
          />
        </View>
        
        {/* Tags Selector */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Relationship Type</Text>
          <TagSelector
            selectedTags={selectedTags}
            onTagToggle={handleTagToggle}
          />
        </View>
        
        {/* Reminder Frequency */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Reminder Frequency</Text>
          <View style={styles.frequencyContainer}>
            {[3, 7, 14, 30].map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.frequencyButton,
                  reminderFrequency === days && styles.selectedFrequency
                ]}
                onPress={() => setReminderFrequency(days)}
              >
                <Text 
                  style={[
                    styles.frequencyText,
                    reminderFrequency === days && styles.selectedFrequencyText
                  ]}
                >
                  {days === 3 ? 'Often' : 
                   days === 7 ? 'Weekly' : 
                   days === 14 ? 'Bi-weekly' : 'Monthly'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Notes Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add notes about this relationship..."
            placeholderTextColor={Colors.dark.subtext}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        
        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button
            title="Save Relationship"
            onPress={handleSave}
            fullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarPicker: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  avatarText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    marginTop: 4,
  },
  avatarWrapper: {
    width: '100%',
    height: '100%',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 12,
    color: Colors.dark.text,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  frequencyButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedFrequency: {
    backgroundColor: Colors.dark.primary,
  },
  frequencyText: {
    color: Colors.dark.subtext,
    fontSize: 14,
  },
  selectedFrequencyText: {
    color: Colors.dark.text,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 12,
    marginBottom: 24,
  },
});