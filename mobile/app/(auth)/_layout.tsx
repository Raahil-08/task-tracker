import { Redirect, Stack } from 'expo-router';
import { useAuthSession } from '../../lib/AuthProvider';

export default function AuthLayout() {
  const { status } = useAuthSession();

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    return <Redirect href="/(app)/tasks" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
