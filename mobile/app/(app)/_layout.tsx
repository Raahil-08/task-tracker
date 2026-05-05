import { Redirect, Stack } from 'expo-router';
import { LoadingState } from '../../components/LoadingState';
import { useAuthSession } from '../../lib/AuthProvider';

export default function AppLayout() {
  const { status } = useAuthSession();

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status !== 'authenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
