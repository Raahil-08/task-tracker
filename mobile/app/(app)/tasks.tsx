import { useState, useMemo, useEffect } from 'react';
import {
  SectionList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { AddTaskModal } from '../../components/AddTaskModal';
import { ConfirmModal } from '../../components/ConfirmModal';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { EmptyState } from '../../components/EmptyState';
import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { TaskItem } from '../../components/TaskItem';
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask } from '../../lib/hooks/useTasks';
import { useAuthSession } from '../../lib/AuthProvider';
import { Task } from '../../types/api';

export default function TasksScreen() {
  const { signOut } = useAuthSession();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const tasksQuery = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleAddTask = async (title: string, description: string, priority?: string, dueDate?: string) => {
    await createTaskMutation.mutateAsync({
      title,
      description: description || undefined,
      priority: priority as any,
      dueDate,
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
    setTaskToDelete(task);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await deleteTaskMutation.mutateAsync(taskToDelete.id);
    } catch {
      // error is surfaced via deleteTaskMutation.error in the footer
    } finally {
      setTaskToDelete(null);
    }
  };

  const tasks = tasksQuery.data ?? [];

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [tasks.length]);

  const sections = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const dayAfterTomorrowStart = new Date(todayStart);
    dayAfterTomorrowStart.setDate(dayAfterTomorrowStart.getDate() + 2);

    const overdue: Task[] = [];
    const today: Task[] = [];
    const tomorrow: Task[] = [];
    const upcoming: Task[] = [];
    const noDate: Task[] = [];
    const completed: Task[] = [];

    tasks.forEach(t => {
      if (t.completed) {
        completed.push(t);
        return;
      }
      if (!t.dueDate) {
        noDate.push(t);
        return;
      }
      const d = new Date(t.dueDate);
      if (d < todayStart) overdue.push(t);
      else if (d >= todayStart && d < tomorrowStart) today.push(t);
      else if (d >= tomorrowStart && d < dayAfterTomorrowStart) tomorrow.push(t);
      else upcoming.push(t);
    });

    const prioritySort = (a: Task, b: Task) => {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      const pA = pMap[a.priority as keyof typeof pMap] || 0;
      const pB = pMap[b.priority as keyof typeof pMap] || 0;
      return pB - pA;
    };

    const sortFn = (a: Task, b: Task) => {
      const p = prioritySort(a, b);
      if (p !== 0) return p;
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    };

    overdue.sort(sortFn);
    today.sort(sortFn);
    tomorrow.sort(sortFn);
    upcoming.sort(sortFn);
    noDate.sort(sortFn);

    const result = [];
    if (overdue.length) result.push({ title: 'Overdue', data: overdue });
    if (today.length) result.push({ title: 'Today', data: today });
    if (tomorrow.length) result.push({ title: 'Tomorrow', data: tomorrow });
    if (upcoming.length) result.push({ title: 'Upcoming', data: upcoming });
    if (noDate.length) result.push({ title: 'No Deadline', data: noDate });
    if (completed.length) result.push({ title: 'Completed', data: completed });

    return result;
  }, [tasks]);

  if (tasksQuery.isLoading) {
    return <LoadingState />;
  }

  if (tasksQuery.isError) {
    return <ErrorState message={tasksQuery.error.message} onRetry={tasksQuery.refetch} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <FontAwesome5 name="bars" size={20} color="#2563eb" />
        <Text style={styles.headerTitle}>Task Tracker</Text>
        <Pressable onPress={() => setShowLogoutConfirm(true)}>
          <FontAwesome5 name="user-circle" size={24} color="#2563eb" />
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        {tasks.length === 0 ? (
          <EmptyState onAddTask={() => setShowAddModal(true)} />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={tasksQuery.isRefetching} onRefresh={tasksQuery.refetch} />
            }
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionTitle}>{title}</Text>
            )}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                disabled={updateTaskMutation.isPending || deleteTaskMutation.isPending}
              />
            )}
          />
        )}
      </View>

      <Pressable style={styles.fab} onPress={() => setShowAddModal(true)}>
        <FontAwesome5 name="plus" size={20} color="#ffffff" />
      </Pressable>

      <AddTaskModal
        visible={showAddModal}
        loading={createTaskMutation.isPending}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTask}
      />

      <ConfirmModal
        visible={taskToDelete !== null}
        title="Delete task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmLabel="Delete"
        loading={deleteTaskMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />

      <ConfirmModal
        visible={showLogoutConfirm}
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log Out"
        onConfirm={signOut}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#2563eb',
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  listContent: { paddingTop: 8, paddingBottom: 80, paddingHorizontal: 16 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});
