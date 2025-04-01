import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Users } from 'lucide-react-native';
import { useRelationshipStore } from '@/store/relationship-store';
import RelationshipCard from '@/components/RelationshipCard';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useRouter } from 'expo-router';

export default function RelationshipsScreen() {
  const router = useRouter();
  const { relationships } = useRelationshipStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter relationships based on search query
  const filteredRelationships = relationships.filter((relationship) => 
    relationship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    relationship.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Sort relationships by name
  const sortedRelationships = [...filteredRelationships].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  const navigateToAddRelationship = () => {
    router.push('/add-relationship');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Relationships</Text>
        
        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.dark.subtext} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or tag..."
            placeholderTextColor={Colors.dark.subtext}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
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
        <FlatList
          data={sortedRelationships}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RelationshipCard relationship={item} />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptySearch}>
              <Text style={styles.emptySearchText}>
                No relationships found matching "{searchQuery}"
              </Text>
            </View>
          }
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
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: Colors.dark.text,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptySearch: {
    padding: 24,
    alignItems: 'center',
  },
  emptySearchText: {
    color: Colors.dark.subtext,
    fontSize: 16,
    textAlign: 'center',
  },
});