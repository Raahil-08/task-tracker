import { Pressable, StyleSheet, Text, View, Animated } from 'react-native';
import { useRef } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Task } from '../types/api';

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onPress?: (task: Task) => void;
  disabled?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TaskItem({ task, onToggle, onDelete, onPress, disabled = false }: TaskItemProps) {
  const timeText = task.dueDate ? new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No time set';
  const isHigh = task.priority === 'High';
  const priorityColor = isHigh ? '#dc2626' : (task.priority === 'Medium' ? '#2563eb' : '#6b7280');

  const checkScale = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    Animated.sequence([
      Animated.spring(checkScale, { toValue: 0.7, useNativeDriver: true }),
      Animated.spring(checkScale, { toValue: 1, useNativeDriver: true })
    ]).start();
    onToggle(task);
  };

  const renderRightActions = () => {
    if (!onDelete) return null;
    return (
      <Pressable onPress={() => onDelete(task)} style={styles.deleteAction}>
        <FontAwesome5 name="trash-alt" size={20} color="#ffffff" />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Swipeable renderRightActions={renderRightActions} containerStyle={styles.swipeableContainer} enabled={!disabled && !!onDelete}>
        <Pressable style={styles.row} onPress={() => onPress && onPress(task)} disabled={disabled}>
          <AnimatedPressable
            style={[styles.checkbox, task.completed && styles.checkboxChecked, { transform: [{ scale: checkScale }] }]}
            onPress={handleToggle}
            disabled={disabled}
          >
            {task.completed ? <FontAwesome5 name="check" size={10} color="#ffffff" /> : null}
          </AnimatedPressable>

          <View style={styles.content}>
            <Text style={[styles.title, task.completed && styles.completedTitle]}>{task.title}</Text>
            <View style={styles.timeRow}>
              <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              <FontAwesome5 name="clock" size={12} color="#6b7280" style={{ marginLeft: 4 }} />
              <Text style={styles.timeText}>{timeText}</Text>
            </View>
          </View>
        </Pressable>
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  swipeableContainer: {
    borderRadius: 12,
    backgroundColor: '#dc2626', // Red background behind swipeable
  },
  deleteAction: {
    width: 64,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
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
});
