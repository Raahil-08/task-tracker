import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Task } from '../types/api';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onPress?: (task: Task) => void;
  disabled?: boolean;
}

export function TaskItem({ task, onToggle, onDelete, onPress, disabled = false }: TaskItemProps) {
  // Use either the real due date or a fallback text if not present, based on design
  const timeText = task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time set';
  
  const isHigh = task.priority === 'High';
  const priorityColor = isHigh ? '#dc2626' : (task.priority === 'Medium' ? '#2563eb' : '#6b7280');

  return (
    <Pressable style={styles.row} onPress={() => onPress && onPress(task)} disabled={disabled}>
      <Pressable
        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
        onPress={() => onToggle(task)}
        disabled={disabled}
      >
        {task.completed ? <FontAwesome5 name="check" size={10} color="#ffffff" /> : null}
      </Pressable>

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.completedTitle]}>{task.title}</Text>
        <View style={styles.timeRow}>
          <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
          <FontAwesome5 name="clock" size={12} color="#6b7280" style={{ marginLeft: 4 }} />
          <Text style={styles.timeText}>{timeText}</Text>
        </View>
      </View>

      {onDelete && (
        <Pressable onPress={() => onDelete(task)} disabled={disabled} style={styles.actionButton}>
          <FontAwesome5 name="trash-alt" size={16} color="#6b7280" />
        </Pressable>
      )}
    </Pressable>
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
    padding: 16,
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  checkboxChecked: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: '#111827',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    color: '#6b7280',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  actionButton: {
    padding: 8,
  },
});
