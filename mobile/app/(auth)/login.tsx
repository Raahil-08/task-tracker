import { Link, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useLogin } from '../../lib/hooks/useAuth';
import { useAuthSession } from '../../lib/AuthProvider';

export default function LoginScreen() {
  const loginMutation = useLogin();
  const { signIn } = useAuthSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      const result = await loginMutation.mutateAsync({ email: email.trim(), password });
      await signIn(result.token);
      router.replace('/(app)/tasks');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to sign in.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton
            title={loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            onPress={handleLogin}
            loading={loginMutation.isPending}
          />

          <Text style={styles.footerText}>
            No account? <Link href="/(auth)/signup" style={styles.link}>Create one</Link>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 16 },
  content: { gap: 12 },
  title: { color: '#111111', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#6b7280', marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    color: '#111111',
  },
  error: { color: '#dc2626', fontSize: 13 },
  footerText: { color: '#6b7280', textAlign: 'center', marginTop: 8 },
  link: { color: '#2563eb', fontWeight: '600' },
});
