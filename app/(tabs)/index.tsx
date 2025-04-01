import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Clock, AlertCircle } from 'lucide-react-native';
import { useRelationshipStore } from '@/store/relationship-store';
import RelationshipCard from '@/components/RelationshipCard';
import CheckInPrompt from '@/components/CheckInPrompt';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import { generateCheckInPrompts } from '@/utils/check-in-prompts';
import Colors from '@/constants/colors';

export default function HomeScreen() {
  const router = useRouter();
  const { relationships, updateAllConnectionScores } = useRelationshipStore();
  
  // Update all connection scores on app load
  useEffect(() => {
    updateAllConnectionScores();
  }, []);
  
  // Sort relationships by connection score (lowest first)
  const sortedRelationships = [...relationships].sort(
    (a, b) => a.connectionScore - b.connectionScore
  );
  
  // Get relationships that need attention (score < 60)
  const needsAttentionRelationships = sortedRelationships.filter(
    (relationship) => relationship.connectionScore < 60
  );
  
  // Get a random relationship for check-in prompts
  const getRandomRelationship = () => {
    if (relationships.length === 0) return null;
    return relationships[Math.floor(Math.random() * relationships.length)];
  };
  
  const randomRelationship = getRandomRelationship();
  const checkInPrompts = randomRelationship 
    ? generateCheckInPrompts(randomRelationship)
    : [];
  
  const handlePromptPress = (promptText: string) => {
    if (randomRelationship) {
      router.push({
        pathname: `/relationship/${randomRelationship.id}/add-interaction`,
        params: { promptText }
      });
    }
  };
  
  const navigateToAddRelationship = () => {
    router.push('/add-relationship');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Loyal Few</Text>
          <Text style={styles.subtitle}>Stay connected with those who matter</Text>
        </View>
        
        {relationships.length === 0 ? (
          <EmptyState
            icon={<Users size={60} color={Colors.dark.primary} />}
            title="No relationships yet"
            message="Add your first relationship to start tracking your connections."
            action={
              <Button 
                title="Add Relationship" 
                onPress={navigateToAddRelationship}
                icon={<UserPlus size={18} color={Colors.dark.text} />}
              />
            }
          />
        ) : (
          <>
            {/* Needs Attention Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertCircle size={20} color={Colors.dark.warning} />
                <Text style={styles.sectionTitle}>Needs Attention</Text>
              </View>
              
              {needsAttentionRelationships.length > 0 ? (
                needsAttentionRelationships.slice(0, 3).map((relationship) => (
                  <RelationshipCard 
                    key={relationship.id} 
                    relationship={relationship} 
                  />
                ))
              ) : (
                <View style={styles.emptySection}>
                  <Text style={styles.emptyText}>
                    All your relationships are in good standing!
                  </Text>
                </View>
              )}
              
              {needsAttentionRelationships.length > 3 && (
                <Pressable 
                  style={styles.viewAllButton}
                  onPress={() => router.push('/relationships')}
                >
                  <Text style={styles.viewAllText}>
                    View all ({needsAttentionRelationships.length})
                  </Text>
                </Pressable>
              )}
            </View>
            
            {/* Check-in Prompts Section */}
            {randomRelationship && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Clock size={20} color={Colors.dark.primary} />
                  <Text style={styles.sectionTitle}>
                    Check-in with {randomRelationship.name}
                  </Text>
                </View>
                
                {checkInPrompts.map((prompt, index) => (
                  <CheckInPrompt
                    key={index}
                    text={prompt.text}
                    type={prompt.type}
                    onPress={() => handlePromptPress(prompt.text)}
                  />
                ))}
              </View>
            )}
          </>
        )}
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.subtext,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginLeft: 8,
  },
  emptySection: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
  },
  viewAllButton: {
    alignSelf: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  viewAllText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});