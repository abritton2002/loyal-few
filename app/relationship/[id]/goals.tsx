import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRelationshipStore } from '@/store/relationship-store';
import GoalItem from '@/components/GoalItem';
import Colors from '@/constants/colors';

export default function GoalsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRelationshipById, toggleGoalCompletion } = useRelationshipStore();
  
  const relationship = getRelationshipById(id);
  
  if (!relationship) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Relationship not found</Text>
      </View>
    );
  }
  
  const sortedGoals = [...relationship.goals]
    .sort((a, b) => {
      // Sort completed goals to the bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Sort by target date if available
      if (a.targetDate && b.targetDate) {
        return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
      }
      // Sort by title
      return a.title.localeCompare(b.title);
    });
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `Goals with ${relationship.name}`,
          headerBackTitle: "Back"
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <FlatList
          data={sortedGoals}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <GoalItem 
              goal={item} 
              onToggle={() => toggleGoalCompletion(id, item.id)} 
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No goals set yet</Text>
            </View>
          }
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  list: {
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
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.dark.subtext,
    fontSize: 16,
  },
}); 