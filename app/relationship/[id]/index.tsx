import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Pressable,
  Alert
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Edit, 
  Plus, 
  Clock, 
  Calendar, 
  Target,
  Trash2,
  MessageSquare
} from 'lucide-react-native';
import { useRelationshipStore } from '@/store/relationship-store';
import ConnectionScoreRing from '@/components/ConnectionScoreRing';
import InteractionItem from '@/components/InteractionItem';
import ImportantDateItem from '@/components/ImportantDateItem';
import GoalItem from '@/components/GoalItem';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function RelationshipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { 
    getRelationshipById, 
    deleteRelationship,
    toggleGoalCompletion
  } = useRelationshipStore();
  
  const relationship = getRelationshipById(id);
  
  if (!relationship) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Relationship not found</Text>
      </View>
    );
  }
  
  const { 
    name, 
    avatar, 
    tags, 
    connectionScore, 
    notes, 
    importantDates, 
    interactions, 
    goals 
  } = relationship;
  
  // Get recent interactions (last 5)
  const recentInteractions = [...interactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  // Get upcoming important dates
  const today = new Date();
  const upcomingDates = [...importantDates]
    .filter(date => {
      const eventDate = new Date(date.date);
      if (date.recurring) {
        // Set to current year
        eventDate.setFullYear(today.getFullYear());
        // If already passed this year, set to next year
        if (eventDate < today) {
          eventDate.setFullYear(today.getFullYear() + 1);
        }
      }
      return eventDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      if (a.recurring) dateA.setFullYear(today.getFullYear());
      if (b.recurring) dateB.setFullYear(today.getFullYear());
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 3);
  
  // Get active goals
  const activeGoals = goals.filter(goal => !goal.completed);
  
  const handleDeleteRelationship = () => {
    Alert.alert(
      "Delete Relationship",
      `Are you sure you want to delete ${name} from your relationships? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => {
            deleteRelationship(id);
            router.replace('/relationships');
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const navigateToAddInteraction = () => {
    router.push(`/relationship/${id}/add-interaction`);
  };
  
  const navigateToAddImportantDate = () => {
    router.push(`/relationship/${id}/add-date`);
  };
  
  const navigateToAddGoal = () => {
    router.push(`/relationship/${id}/add-goal`);
  };
  
  const navigateToAllInteractions = () => {
    router.push(`/relationship/${id}/interactions`);
  };
  
  const navigateToAllDates = () => {
    router.push(`/relationship/${id}/dates`);
  };
  
  const navigateToAllGoals = () => {
    router.push(`/relationship/${id}/goals`);
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: name,
          headerRight: () => (
            <Pressable 
              style={({ pressed }) => [
                styles.headerButton,
                pressed && styles.headerButtonPressed
              ]}
              onPress={() => router.push(`/relationship/${id}/edit`)}
            >
              <Edit size={20} color={Colors.dark.text} />
            </Pressable>
          )
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.placeholderAvatar]}>
                  <Text style={styles.placeholderText}>{name.charAt(0)}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{name}</Text>
              
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.scoreContainer}>
              <ConnectionScoreRing score={connectionScore} size={70} />
            </View>
          </View>
          
          {/* Notes Section */}
          {notes ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <View style={styles.notesContainer}>
                <Text style={styles.notesText}>{notes}</Text>
              </View>
            </View>
          ) : null}
          
          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Button
              title="Log Interaction"
              onPress={navigateToAddInteraction}
              icon={<MessageSquare size={18} color={Colors.dark.text} />}
              fullWidth
            />
          </View>
          
          {/* Recent Interactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Clock size={20} color={Colors.dark.primary} />
                <Text style={styles.sectionTitle}>Recent Interactions</Text>
              </View>
              
              {interactions.length > 0 && (
                <Pressable 
                  style={styles.viewAllButton}
                  onPress={navigateToAllInteractions}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </Pressable>
              )}
            </View>
            
            {recentInteractions.length > 0 ? (
              recentInteractions.map((interaction) => (
                <InteractionItem 
                  key={interaction.id} 
                  interaction={interaction} 
                />
              ))
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>No interactions recorded yet</Text>
                <Button
                  title="Add First Interaction"
                  onPress={navigateToAddInteraction}
                  variant="outline"
                  size="small"
                  icon={<Plus size={16} color={Colors.dark.primary} />}
                  iconPosition="left"
                  style={styles.emptyButton}
                />
              </View>
            )}
          </View>
          
          {/* Important Dates */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Calendar size={20} color={Colors.dark.primary} />
                <Text style={styles.sectionTitle}>Important Dates</Text>
              </View>
              
              {importantDates.length > 0 && (
                <Pressable 
                  style={styles.viewAllButton}
                  onPress={navigateToAllDates}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </Pressable>
              )}
            </View>
            
            {upcomingDates.length > 0 ? (
              upcomingDates.map((date) => (
                <ImportantDateItem 
                  key={date.id} 
                  date={date} 
                />
              ))
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>No important dates added yet</Text>
                <Button
                  title="Add Important Date"
                  onPress={navigateToAddImportantDate}
                  variant="outline"
                  size="small"
                  icon={<Plus size={16} color={Colors.dark.primary} />}
                  iconPosition="left"
                  style={styles.emptyButton}
                />
              </View>
            )}
          </View>
          
          {/* Goals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Target size={20} color={Colors.dark.primary} />
                <Text style={styles.sectionTitle}>Goals</Text>
              </View>
              
              {goals.length > 0 && (
                <Pressable 
                  style={styles.viewAllButton}
                  onPress={navigateToAllGoals}
                >
                  <Text style={styles.viewAllText}>View All</Text>
                </Pressable>
              )}
            </View>
            
            {activeGoals.length > 0 ? (
              activeGoals.slice(0, 3).map((goal) => (
                <GoalItem 
                  key={goal.id} 
                  goal={goal} 
                  onToggle={() => toggleGoalCompletion(id, goal.id)} 
                />
              ))
            ) : (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>No goals set yet</Text>
                <Button
                  title="Add Goal"
                  onPress={navigateToAddGoal}
                  variant="outline"
                  size="small"
                  icon={<Plus size={16} color={Colors.dark.primary} />}
                  iconPosition="left"
                  style={styles.emptyButton}
                />
              </View>
            )}
          </View>
          
          {/* Delete Button */}
          <View style={styles.deleteContainer}>
            <Button
              title="Delete Relationship"
              onPress={handleDeleteRelationship}
              variant="danger"
              icon={<Trash2 size={18} color={Colors.dark.text} />}
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
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  headerButtonPressed: {
    opacity: 0.7,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderAvatar: {
    backgroundColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.dark.text,
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Colors.dark.card,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: Colors.dark.subtext,
    fontSize: 12,
    fontWeight: '500',
  },
  scoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  notesContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
  },
  notesText: {
    color: Colors.dark.text,
    fontSize: 16,
    lineHeight: 22,
  },
  quickActions: {
    marginBottom: 24,
  },
  emptySection: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.dark.subtext,
    fontSize: 14,
    marginBottom: 12,
  },
  emptyButton: {
    marginTop: 8,
  },
  deleteContainer: {
    marginTop: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
});