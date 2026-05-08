import { Redirect, Tabs } from 'expo-router';
import { LoadingState } from '../../components/LoadingState';
import { useAuthSession } from '../../lib/AuthProvider';
import { useTheme } from '../../lib/ThemeContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { FontAwesome5 } from '@expo/vector-icons';
import { View } from 'react-native';

export default function AppLayout() {
  const { status } = useAuthSession();
  const { colors } = useTheme();
  
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
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.outline,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
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
              backgroundColor: focused ? colors.primary : 'transparent',
              padding: 8,
              borderRadius: 8,
            }}>
              <FontAwesome5 name="border-all" size={size} color={focused ? colors.onPrimary : color} />
            </View>
          ),
          tabBarLabel: ({ focused, color }) => focused ? null : <></>, 
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
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <FontAwesome5 name="cog" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
