import { Redirect, Tabs } from 'expo-router';
import { LoadingState } from '../../components/LoadingState';
import { useAuthSession } from '../../lib/AuthProvider';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { FontAwesome5 } from '@expo/vector-icons';
import { View } from 'react-native';

export default function AppLayout() {
  const { status } = useAuthSession();
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (status === 'loading' || !fontsLoaded) {
    return <LoadingState />;
  }

  if (status !== 'authenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#2563eb' : 'transparent',
              padding: 8,
              borderRadius: 8,
            }}>
              <FontAwesome5 name="border-all" size={size} color={focused ? '#ffffff' : color} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => focused ? null : <></>, // Hide label if focused to match mockup, actually let's just keep standard labels for now, or match mockup precisely
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="check-double" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="cog" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
