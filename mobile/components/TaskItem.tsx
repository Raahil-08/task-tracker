import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Task } from '../types/api';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  disabled?: boolean;
}

export function TaskItem({ task, onToggle, onDelete, disabled = false }: TaskItemProps) {
  return (
    <View style={styles.row}>
      <Pressable
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        onPress={() => onToggle(task)}
        disabled={disabled}
      >
        {task.completed ? <Text style={styles.check}>✓</Text> : null}
      </Pressable>

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.completedTitle]}>{task.title}</Text>
        {!!task.description && (
          <Text style={[styles.description, task.completed && styles.completedDescription]}>
            {task.description}
          </Text>
        )}
      </View>

      <Pressable onPress={() => onDelete(task)} disabled={disabled} style={styles.deleteButton}>
        <Text style={styles.deleteText}>🗑</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#6b7280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  check: {
    color: '#ffffff',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    color: '#6b7280',
    fontSize: 14,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  completedDescription: {
    color: '#9ca3af',
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 16,
  },
});
