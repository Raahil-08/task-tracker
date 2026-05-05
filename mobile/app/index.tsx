import { Redirect } from 'expo-router';
import { LoadingState } from '../components/LoadingState';
import { useAuthSession } from '../lib/AuthProvider';

export default function Index() {
  const { status } = useAuthSession();

  if (status === 'loading') {
    return <LoadingState />;
  }

  if (status === 'authenticated') {
    return <Redirect href="/(app)/tasks" />;
  }

  return <Redirect href="/(auth)/login" />;
}
