import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  Moon, 
  Shield, 
  HelpCircle, 
  LogOut, 
  RefreshCw,
  Trash2
} from 'lucide-react-native';
import { useRelationshipStore } from '@/store/relationship-store';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

export default function SettingsScreen() {
  const { resetToMockData, relationships } = useRelationshipStore();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(true);
  
  const handleResetData = () => {
    Alert.alert(
      "Reset Data",
      "This will reset all your data to the default examples. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Reset", 
          onPress: () => resetToMockData(),
          style: "destructive"
        }
      ]
    );
  };
  
  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will permanently delete all your relationships and data. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete Everything", 
          onPress: () => {}, // This would clear all data
          style: "destructive"
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Bell size={20} color={Colors.dark.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive reminders to connect with your relationships
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
              thumbColor={Colors.dark.text}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Moon size={20} color={Colors.dark.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Use dark theme throughout the app
                </Text>
              </View>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: Colors.dark.border, true: Colors.dark.primary }}
              thumbColor={Colors.dark.text}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Shield size={20} color={Colors.dark.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Privacy</Text>
                <Text style={styles.settingDescription}>
                  Manage your data and privacy settings
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <HelpCircle size={20} color={Colors.dark.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Help & Support</Text>
                <Text style={styles.settingDescription}>
                  Get help using Loyal Few
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <View style={styles.dataInfo}>
            <Text style={styles.dataInfoText}>
              You have {relationships.length} relationships and {
                relationships.reduce((sum, r) => sum + r.interactions.length, 0)
              } interactions tracked.
            </Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Reset to Example Data"
              onPress={handleResetData}
              variant="outline"
              icon={<RefreshCw size={18} color={Colors.dark.primary} />}
              fullWidth
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Clear All Data"
              onPress={handleClearData}
              variant="danger"
              icon={<Trash2 size={18} color={Colors.dark.text} />}
              fullWidth
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.buttonContainer}>
            <Button
              title="Log Out"
              onPress={() => {}}
              variant="secondary"
              icon={<LogOut size={18} color={Colors.dark.text} />}
              fullWidth
            />
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Loyal Few v1.0.0</Text>
          <Text style={styles.footerText}>© 2023 Loyal Few</Text>
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  dataInfo: {
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  dataInfoText: {
    fontSize: 14,
    color: Colors.dark.subtext,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginBottom: 4,
  },
});