import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useRelationshipStore } from '@/store/relationship-store';
import RelationshipCard from '@/components/RelationshipCard';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { LucideIcon } from 'lucide-react-native';

export default function RelationshipsScreen() {
  const router = useRouter();
  const { relationships } = useRelationshipStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRelationships = relationships
    .filter(relationship => {
      const query = searchQuery.toLowerCase();
      return (
        relationship.name.toLowerCase().includes(query) ||
        relationship.tags.some(tag => tag.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Relationships</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.dark.text} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search relationships..."
          placeholderTextColor={Colors.dark.subtext}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredRelationships.length === 0 ? (
        <EmptyState
          icon={<View><Users size={48} color={Colors.dark.text} /></View>}
          title="No relationships yet"
          message="Start by adding your first relationship"
          action={
            <Button
              title="Add Relationship"
              onPress={() => router.push('/add-relationship')}
            />
          }
        />
      ) : (
        <FlatList
          data={filteredRelationships}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <RelationshipCard relationship={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: Colors.dark.text,
    fontSize: 16,
  },
  list: {
    padding: 16,
  },
});