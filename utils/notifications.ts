import { Relationship, Interaction, ImportantDate } from '@/types/relationship';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export async function requestNotificationPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return false;
  }
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  
  return true;
}

// Schedule a notification
async function scheduleNotification(
  title: string,
  body: string,
  trigger: Notifications.NotificationTriggerInput
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });
}

// Calculate next interaction time based on relationship data
function calculateNextInteractionTime(relationship: Relationship): Date | null {
  const { lastInteraction, reminderFrequency, communicationPreferences } = relationship;
  
  if (!lastInteraction) return null;
  
  const lastInteractionDate = new Date(lastInteraction);
  const nextInteractionDate = new Date(lastInteractionDate);
  nextInteractionDate.setDate(nextInteractionDate.getDate() + reminderFrequency);
  
  // Adjust for preferred contact times
  if (communicationPreferences?.bestTimesToContact) {
    const now = new Date();
    const preferredTimes = communicationPreferences.bestTimesToContact;
    
    // If we're past the last preferred time, move to next day
    if (preferredTimes.includes('morning') && now.getHours() > 12) {
      nextInteractionDate.setDate(nextInteractionDate.getDate() + 1);
    }
  }
  
  return nextInteractionDate;
}

// Generate notification content based on relationship data
function generateNotificationContent(relationship: Relationship): { title: string; body: string } {
  const { name, connectionScore, lastInteraction } = relationship;
  
  if (!lastInteraction) {
    return {
      title: `Start your journey with ${name}`,
      body: "Add your first interaction to begin tracking your connection.",
    };
  }
  
  const daysSinceLastInteraction = Math.floor(
    (new Date().getTime() - new Date(lastInteraction).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (connectionScore < 40) {
    return {
      title: `Your connection with ${name} needs attention`,
      body: `It's been ${daysSinceLastInteraction} days since your last interaction. Want to reach out?`,
    };
  }
  
  if (connectionScore > 80) {
    return {
      title: `Keep the momentum with ${name}`,
      body: "Your connection is strong! Schedule your next interaction to maintain it.",
    };
  }
  
  return {
    title: `Time to connect with ${name}`,
    body: `It's been ${daysSinceLastInteraction} days. Want to catch up?`,
  };
}

// Schedule notifications for a relationship
export async function scheduleRelationshipNotifications(relationship: Relationship) {
  // Cancel any existing notifications for this relationship
  await cancelRelationshipNotifications(relationship.id);
  
  // Schedule next interaction reminder
  const nextInteractionTime = calculateNextInteractionTime(relationship);
  if (nextInteractionTime) {
    const { title, body } = generateNotificationContent(relationship);
    await scheduleNotification(title, body, {
      type: 'date',
      date: nextInteractionTime,
      repeats: true,
      seconds: relationship.reminderFrequency * 24 * 60 * 60, // Convert days to seconds
    } as Notifications.NotificationTriggerInput);
  }
  
  // Schedule notifications for upcoming important dates
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  relationship.importantDates.forEach(date => {
    const eventDate = new Date(date.date);
    if (date.recurring) {
      eventDate.setFullYear(now.getFullYear());
      if (eventDate < now) {
        eventDate.setFullYear(now.getFullYear() + 1);
      }
    }
    
    if (eventDate >= now && eventDate <= thirtyDaysFromNow) {
      const daysUntil = Math.floor(
        (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Schedule notifications at different intervals
      if (daysUntil <= 7) {
        scheduleNotification(
          `${date.title} with ${relationship.name} coming up!`,
          `It's in ${daysUntil} days. Want to plan something special?`,
          { type: 'date', date: eventDate } as Notifications.NotificationTriggerInput
        );
      }
      
      if (daysUntil <= 3) {
        scheduleNotification(
          `${date.title} with ${relationship.name} is soon!`,
          `Only ${daysUntil} days away. Have you made plans?`,
          { type: 'date', date: eventDate } as Notifications.NotificationTriggerInput
        );
      }
    }
  });
}

// Cancel all notifications for a relationship
export async function cancelRelationshipNotifications(relationshipId: string) {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  const relationshipNotifications = scheduledNotifications.filter(
    (notification: Notifications.NotificationRequest) => notification.content.data?.relationshipId === relationshipId
  );
  
  for (const notification of relationshipNotifications) {
    await Notifications.cancelScheduledNotificationAsync(notification.identifier);
  }
}

// Initialize notifications for all relationships
export async function initializeNotifications(relationships: Relationship[]) {
  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) return;
  
  for (const relationship of relationships) {
    await scheduleRelationshipNotifications(relationship);
  }
} 