import { StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { PrimaryButton } from './PrimaryButton';
import { useTheme } from '../lib/ThemeContext';

interface EmptyStateProps {
  onAddTask: () => void;
}

export function EmptyState({ onAddTask }: EmptyStateProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>No tasks yet</Text>
      <Text style={styles.message}>Add your first task</Text>
      <PrimaryButton title="Add Task" onPress={onAddTask} />
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
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
    color: colors.onSurface,
  },
  message: {
    color: colors.onSurfaceVariant,
    marginBottom: 8,
  },
});
