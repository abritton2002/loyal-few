import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import { Relationship, Interaction, ImportantDate, Goal, EmotionRating } from '@/types/relationship';
import { calculateConnectionScore } from '@/utils/connection-score';
import { mockRelationships } from '@/mocks/relationships';

interface RelationshipState {
  relationships: Relationship[];
  loading: boolean;
  error: string | null;
  
  // Actions
  addRelationship: (relationship: Omit<Relationship, 'id' | 'createdAt' | 'connectionScore'>) => void;
  updateRelationship: (id: string, updates: Partial<Relationship>) => void;
  deleteRelationship: (id: string) => void;
  
  // Interaction actions
  addInteraction: (relationshipId: string, interaction: Omit<Interaction, 'id'>) => void;
  updateInteraction: (relationshipId: string, interactionId: string, updates: Partial<Interaction>) => void;
  deleteInteraction: (relationshipId: string, interactionId: string) => void;
  
  // Important date actions
  addImportantDate: (relationshipId: string, date: Omit<ImportantDate, 'id'>) => void;
  updateImportantDate: (relationshipId: string, dateId: string, updates: Partial<ImportantDate>) => void;
  deleteImportantDate: (relationshipId: string, dateId: string) => void;
  
  // Goal actions
  addGoal: (relationshipId: string, goal: Omit<Goal, 'id'>) => void;
  updateGoal: (relationshipId: string, goalId: string, updates: Partial<Goal>) => void;
  toggleGoalCompletion: (relationshipId: string, goalId: string) => void;
  deleteGoal: (relationshipId: string, goalId: string) => void;
  
  // Emotion tracking
  addEmotionRating: (relationshipId: string, rating: EmotionRating) => void;
  
  // Utility functions
  getRelationshipById: (id: string) => Relationship | undefined;
  updateAllConnectionScores: () => void;
  resetToMockData: () => void;
}

export const useRelationshipStore = create<RelationshipState>()(
  persist(
    (set, get) => ({
      relationships: mockRelationships,
      loading: false,
      error: null,
      
      addRelationship: (relationship) => {
        const newRelationship: Relationship = {
          ...relationship,
          id: uuidv4(),
          connectionScore: 50, // Default starting score
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          relationships: [...state.relationships, newRelationship]
        }));
      },
      
      updateRelationship: (id, updates) => {
        set((state) => ({
          relationships: state.relationships.map((relationship) => 
            relationship.id === id 
              ? { ...relationship, ...updates } 
              : relationship
          )
        }));
      },
      
      deleteRelationship: (id) => {
        set((state) => ({
          relationships: state.relationships.filter((relationship) => relationship.id !== id)
        }));
      },
      
      addInteraction: (relationshipId, interaction) => {
        const newInteraction: Interaction = {
          ...interaction,
          id: uuidv4(),
        };
        
        set((state) => {
          const updatedRelationships = state.relationships.map((relationship) => {
            if (relationship.id === relationshipId) {
              const updatedRelationship = {
                ...relationship,
                interactions: [...relationship.interactions, newInteraction],
                lastInteraction: interaction.date,
              };
              
              // Recalculate connection score
              updatedRelationship.connectionScore = calculateConnectionScore(updatedRelationship);
              
              return updatedRelationship;
            }
            return relationship;
          });
          
          return { relationships: updatedRelationships };
        });
      },
      
      updateInteraction: (relationshipId, interactionId, updates) => {
        set((state) => {
          const updatedRelationships = state.relationships.map((relationship) => {
            if (relationship.id === relationshipId) {
              const updatedInteractions = relationship.interactions.map((interaction) => 
                interaction.id === interactionId 
                  ? { ...interaction, ...updates } 
                  : interaction
              );
              
              const updatedRelationship = {
                ...relationship,
                interactions: updatedInteractions,
              };
              
              // Update lastInteraction if needed
              if (updates.date) {
                const sortedInteractions = [...updatedInteractions].sort(
                  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                
                if (sortedInteractions.length > 0) {
                  updatedRelationship.lastInteraction = sortedInteractions[0].date;
                }
              }
              
              // Recalculate connection score
              updatedRelationship.connectionScore = calculateConnectionScore(updatedRelationship);
              
              return updatedRelationship;
            }
            return relationship;
          });
          
          return { relationships: updatedRelationships };
        });
      },
      
      deleteInteraction: (relationshipId, interactionId) => {
        set((state) => {
          const updatedRelationships = state.relationships.map((relationship) => {
            if (relationship.id === relationshipId) {
              const updatedInteractions = relationship.interactions.filter(
                (interaction) => interaction.id !== interactionId
              );
              
              const updatedRelationship = {
                ...relationship,
                interactions: updatedInteractions,
              };
              
              // Update lastInteraction
              const sortedInteractions = [...updatedInteractions].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
              );
              
              if (sortedInteractions.length > 0) {
                updatedRelationship.lastInteraction = sortedInteractions[0].date;
              } else {
                updatedRelationship.lastInteraction = undefined;
              }
              
              // Recalculate connection score
              updatedRelationship.connectionScore = calculateConnectionScore(updatedRelationship);
              
              return updatedRelationship;
            }
            return relationship;
          });
          
          return { relationships: updatedRelationships };
        });
      },
      
      addImportantDate: (relationshipId, date) => {
        const newDate: ImportantDate = {
          ...date,
          id: uuidv4(),
        };
        
        set((state) => ({
          relationships: state.relationships.map((relationship) => 
            relationship.id === relationshipId 
              ? { 
                  ...relationship, 
                  importantDates: [...relationship.importantDates, newDate] 
                } 
              : relationship
          )
        }));
      },
      
      updateImportantDate: (relationshipId, dateId, updates) => {
        set((state) => ({
          relationships: state.relationships.map((relationship) => 
            relationship.id === relationshipId 
              ? { 
                  ...relationship, 
                  importantDates: relationship.importantDates.map((date) => 
                    date.id === dateId 
                      ? { ...date, ...updates } 
                      : date
                  ) 
                } 
              : relationship
          )
        }));
      },
      
      deleteImportantDate: (relationshipId, dateId) => {
        set((state) => ({
          relationships: state.relationships.map((relationship) => 
            relationship.id === relationshipId 
              ? { 
                  ...relationship, 
                  importantDates: relationship.importantDates.filter((date) => date.id !== dateId) 
                } 
              : relationship
          )
        }));
      },
      
      addGoal: (relationshipId, goal) => {
        const newGoal: Goal = {
          ...goal,
          id: uuidv4(),
        };
        
        set((state) => ({
          relationships: state.relationships.map((relationship) => 
            relationship.id === relationshipId 
              ? { 
                  ...relationship, 
                  goals: [...relationship.goals, newGoal] 
                } 
              : relationship
          )
        }));
      },
      
      updateGoal: (relationshipId, goalId, updates) => {
        set((state) => ({
          relationships: state.relationships.map((relationship) => 
            relationship.id === relationshipId 
              ? { 
                  ...relationship, 
                  goals: relationship.goals.map((goal) => 
                    goal.id === goalId 
                      ? { ...goal, ...updates } 
                      : goal
                  ) 
                } 
              : relationship
          )
        }));
      },
      
      toggleGoalCompletion: (relationshipId, goalId) => {
        set((state) => ({
          relationships: state.relationships.map((relationship) => 
            relationship.id === relationshipId 
              ? { 
                  ...relationship, 
                  goals: relationship.goals.map((goal) => 
                    goal.id === goalId 
                      ? { ...goal, completed: !goal.completed } 
                      : goal
                  ) 
                } 
              : relationship
          )
        }));
      },
      
      deleteGoal: (relationshipId, goalId) => {
        set((state) => ({
          relationships: state.relationships.map((relationship) => 
            relationship.id === relationshipId 
              ? { 
                  ...relationship, 
                  goals: relationship.goals.filter((goal) => goal.id !== goalId) 
                } 
              : relationship
          )
        }));
      },
      
      addEmotionRating: (relationshipId, rating) => {
        const newRating = {
          date: new Date().toISOString(),
          rating,
        };
        
        set((state) => ({
          relationships: state.relationships.map((relationship) => 
            relationship.id === relationshipId 
              ? { 
                  ...relationship, 
                  emotionHistory: [...relationship.emotionHistory, newRating] 
                } 
              : relationship
          )
        }));
      },
      
      getRelationshipById: (id) => {
        return get().relationships.find((relationship) => relationship.id === id);
      },
      
      updateAllConnectionScores: () => {
        set((state) => ({
          relationships: state.relationships.map((relationship) => ({
            ...relationship,
            connectionScore: calculateConnectionScore(relationship)
          }))
        }));
      },
      
      resetToMockData: () => {
        set({ relationships: mockRelationships });
      },
    }),
    {
      name: 'loyal-few-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);