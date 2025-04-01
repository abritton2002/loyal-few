import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRelationshipStore } from '@/store/relationship-store';
import ImportantDateItem from '@/components/ImportantDateItem';
import Colors from '@/constants/colors';

export default function DatesScreen() {
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
  
  const sortedDates = [...relationship.importantDates]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: `Important Dates with ${relationship.name}`,
          headerBackTitle: "Back"
        }} 
      />
      
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <FlatList
          data={sortedDates}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ImportantDateItem date={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No important dates added yet</Text>
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