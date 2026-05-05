import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { AuthProvider } from '../lib/AuthProvider';
import { queryClient } from '../lib/queryClient';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
