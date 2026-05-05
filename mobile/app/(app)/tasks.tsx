import { useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AddTaskModal } from '../../components/AddTaskModal';
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { PrimaryButton } from '../../components/PrimaryButton';
import { TaskItem } from '../../components/TaskItem';
import { useAuthSession } from '../../lib/AuthProvider';
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from '../../lib/hooks/useTasks';
import { Task } from '../../types/api';

export default function TasksScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const { signOut } = useAuthSession();
  const tasksQuery = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleAddTask = async (title: string, description: string) => {
    await createTaskMutation.mutateAsync({
      title,
      description: description || undefined,
    });
    setShowAddModal(false);
  };

  const handleToggleTask = async (task: Task) => {
    await updateTaskMutation.mutateAsync({
      id: task.id,
      completed: !task.completed,
    });
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert('Delete task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTaskMutation.mutateAsync(task.id);
        },
      },
    ]);
  };

  if (tasksQuery.isLoading) {
    return <LoadingState />;
  }

  if (tasksQuery.isError) {
    return <ErrorState message={tasksQuery.error.message} onRetry={tasksQuery.refetch} />;
  }

  const tasks = tasksQuery.data ?? [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <View style={styles.headerActions}>
          <PressableText text="+ Add" onPress={() => setShowAddModal(true)} />
          <PressableText text="Logout" onPress={signOut} />
        </View>
      </View>

      {tasks.length === 0 ? (
        <EmptyState onAddTask={() => setShowAddModal(true)} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskItem
              task={item}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
              disabled={updateTaskMutation.isPending || deleteTaskMutation.isPending}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={tasksQuery.isRefetching} onRefresh={tasksQuery.refetch} />
          }
        />
      )}

      <AddTaskModal
        visible={showAddModal}
        loading={createTaskMutation.isPending}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTask}
      />

      {!!createTaskMutation.error && (
        <View style={styles.footerError}>
          <Text style={styles.errorText}>{createTaskMutation.error.message}</Text>
          <PrimaryButton title="Try again" variant="secondary" onPress={() => setShowAddModal(true)} />
        </View>
      )}
    </SafeAreaView>
  );
}

function PressableText({ text, onPress }: { text: string; onPress: () => void | Promise<void> }) {
  return (
    <Text style={styles.actionText} onPress={onPress}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerActions: { flexDirection: 'row', gap: 14 },
  title: { fontSize: 28, fontWeight: '700', color: '#111111' },
  actionText: { color: '#2563eb', fontWeight: '600', fontSize: 15 },
  listContent: { paddingTop: 8, paddingBottom: 24 },
  footerError: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  errorText: { color: '#dc2626', fontSize: 13, textAlign: 'center' },
});
