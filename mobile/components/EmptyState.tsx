import { StyleSheet, Text, View } from 'react-native';
import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  onAddTask: () => void;
}

export function EmptyState({ onAddTask }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📝</Text>
      <Text style={styles.title}>No tasks yet</Text>
      <Text style={styles.message}>Add your first task</Text>
      <PrimaryButton title="Add Task" onPress={onAddTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  message: {
    color: '#6b7280',
    marginBottom: 8,
  },
});
