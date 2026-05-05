import { Link, router } from 'expo-router';
import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useSignup } from '../../lib/hooks/useAuth';
import { useAuthSession } from '../../lib/AuthProvider';

export default function SignupScreen() {
  const signupMutation = useSignup();
  const { signIn } = useAuthSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    try {
      setError(null);
      const result = await signupMutation.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      await signIn(result.token);
      router.replace('/(app)/tasks');
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Failed to sign up.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Start tracking your tasks</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
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
            title={signupMutation.isPending ? 'Signing up...' : 'Sign Up'}
            onPress={handleSignup}
            loading={signupMutation.isPending}
          />

          <Text style={styles.footerText}>
            Have an account? <Link href="/(auth)/login" style={styles.link}>Sign in</Link>
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
