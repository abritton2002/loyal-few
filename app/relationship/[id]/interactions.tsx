import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRelationshipStore } from '@/store/relationship-store';
import InteractionItem from '@/components/InteractionItem';
import Colors from '@/constants/colors';

export default function InteractionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getRelationshipById } = useRelationshipStore();
  
  const relationship = getRelationshipById(id);
  
  if (!relationship) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Relationship not found</Text>
      </View>
    );
  }
  
  const sortedInteractions = [...relationship.interactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `Interactions with ${relationship.name}`,
          headerBackTitle: "Back"
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <FlatList
          data={sortedInteractions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <InteractionItem interaction={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No interactions recorded yet</Text>
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