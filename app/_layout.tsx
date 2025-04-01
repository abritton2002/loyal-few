import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Colors from "@/constants/colors";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.dark.background,
        },
        headerTintColor: Colors.dark.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: Colors.dark.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      <Stack.Screen 
        name="relationship/[id]/index" 
        options={{ 
          title: "Relationship Details",
          headerBackTitle: "Back"
        }} 
      />
      <Stack.Screen 
        name="relationship/[id]/add-interaction" 
        options={{ 
          title: "Add Interaction",
          headerBackTitle: "Back"
        }} 
      />
      <Stack.Screen 
        name="relationship/[id]/add-date" 
        options={{ 
          title: "Add Important Date",
          headerBackTitle: "Back"
        }} 
      />
      <Stack.Screen 
        name="relationship/[id]/add-goal" 
        options={{ 
          title: "Add Goal",
          headerBackTitle: "Back"
        }} 
      />
      <Stack.Screen 
        name="relationship/[id]/interactions" 
        options={{ 
          title: "All Interactions",
          headerBackTitle: "Back"
        }} 
      />
      <Stack.Screen 
        name="relationship/[id]/dates" 
        options={{ 
          title: "Important Dates",
          headerBackTitle: "Back"
        }} 
      />
      <Stack.Screen 
        name="relationship/[id]/goals" 
        options={{ 
          title: "Goals",
          headerBackTitle: "Back"
        }} 
      />
      <Stack.Screen 
        name="relationship/[id]/edit" 
        options={{ 
          title: "Edit Relationship",
          headerBackTitle: "Back"
        }} 
      />
    </Stack>
  );
}