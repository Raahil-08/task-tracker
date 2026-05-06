import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuthSession } from '../../lib/AuthProvider';
import { useTasks } from '../../lib/hooks/useTasks';
import { LoadingState } from '../../components/LoadingState';

export default function DashboardScreen() {
  const { data: tasks, isLoading } = useTasks();

  if (isLoading) {
    return <LoadingState />;
  }

  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const pendingTasks = tasks?.filter(t => !t.completed).length || 0;
  const totalTasks = (tasks?.length || 0);
  const pulse = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <FontAwesome5 name="bars" size={20} color="#2563eb" />
          <Text style={styles.headerTitle}>Task Tracker</Text>
          <FontAwesome5 name="user-circle" size={24} color="#2563eb" />
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Hello, User!</Text>
          <Text style={styles.greetingSubtitle}>Here is a quick overview of your day.</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Productivity Pulse</Text>
          <Text style={styles.heroPulse}>{pulse}%</Text>
          <Text style={styles.heroSubtitle}>of tasks completed today. Keep it up!</Text>
          <View style={styles.heroStatsRow}>
            <View style={styles.heroStatCircle}>
              <Text style={styles.heroStatValue}>{completedTasks}</Text>
            </View>
            <View style={styles.heroStatCircleOutline}>
              <Text style={styles.heroStatValueOutline}>{pendingTasks}</Text>
            </View>
          </View>
          <View style={styles.heroStatsLabelRow}>
            <Text style={styles.heroStatLabel}>Done</Text>
            <Text style={styles.heroStatLabelOutline}>Left</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={styles.gridCard}>
            <FontAwesome5 name="tasks" size={16} color="#2563eb" style={styles.gridIcon} />
            <Text style={styles.gridLabel}>Total Tasks</Text>
            <Text style={styles.gridValue}>{totalTasks}</Text>
          </View>
          <View style={styles.gridCard}>
            <FontAwesome5 name="exclamation-square" size={16} color="#dc2626" style={styles.gridIcon} />
            <Text style={styles.gridLabel}>Overdue</Text>
            <Text style={[styles.gridValue, { color: '#dc2626' }]}>
              {tasks?.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length || 0}
            </Text>
          </View>
          <View style={styles.gridCard}>
            <FontAwesome5 name="fire" size={16} color="#bc4b00" style={styles.gridIcon} />
            <Text style={styles.gridLabel}>High Priority</Text>
            <Text style={[styles.gridValue, { color: '#bc4b00' }]}>
              {tasks?.filter(t => !t.completed && t.priority === 'High').length || 0}
            </Text>
          </View>
          <View style={styles.gridCard}>
            <FontAwesome5 name="check-circle" size={16} color="#2563eb" style={styles.gridIcon} />
            <Text style={styles.gridLabel}>Completed</Text>
            <Text style={styles.gridValue}>{completedTasks}</Text>
          </View>
        </View>

        <View style={styles.deadlinesSection}>
          <View style={styles.deadlinesHeader}>
            <Text style={styles.deadlinesTitle}>Upcoming Deadlines</Text>
          </View>
          
          {(tasks || [])
            .filter(t => !t.completed && t.dueDate && new Date(t.dueDate) >= new Date())
            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
            .slice(0, 3)
            .map(task => {
              const date = new Date(task.dueDate!);
              const dateString = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
              const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              const isHigh = task.priority === 'High';
              const priorityColor = isHigh ? '#dc2626' : (task.priority === 'Medium' ? '#2563eb' : '#6b7280');

              return (
                <View key={task.id} style={styles.deadlineCard}>
                  <View style={styles.deadlineCardHeader}>
                    <View style={styles.priorityRow}>
                      <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                      <Text style={[styles.priorityText, { color: priorityColor }]}>{task.priority} Priority</Text>
                    </View>
                  </View>
                  <Text style={styles.deadlineTaskTitle}>{task.title}</Text>
                  {!!task.description && (
                    <Text style={styles.deadlineTaskDesc} numberOfLines={2}>
                      {task.description}
                    </Text>
                  )}
                  <View style={styles.deadlineCardFooter}>
                    <View style={styles.timeRow}>
                      <FontAwesome5 name="calendar-alt" size={12} color="#6b7280" />
                      <Text style={styles.timeText}>{dateString}, {timeString}</Text>
                    </View>
                    <View style={styles.checkboxOutline} />
                  </View>
                </View>
              );
          })}
          
          {(!tasks || tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) >= new Date()).length === 0) && (
            <Text style={{ color: '#6b7280', fontFamily: 'Inter_400Regular', marginTop: 8 }}>No upcoming deadlines.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9fafb' },
  container: { padding: 16, paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#2563eb',
  },
  greetingSection: {
    marginBottom: 20,
  },
  greetingTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#111827',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  heroCard: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 8,
  },
  heroPulse: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#e0e7ff',
    marginBottom: 16,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroStatCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStatCircleOutline: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#60a5fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroStatValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  heroStatValueOutline: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  heroStatsLabelRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  heroStatLabel: {
    width: 48,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#ffffff',
  },
  heroStatLabelOutline: {
    width: 48,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#e0e7ff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  gridCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  gridIcon: {
    marginBottom: 12,
  },
  gridLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  gridValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#111827',
  },
  deadlinesSection: {
    gap: 12,
  },
  deadlinesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  deadlinesTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: '#111827',
  },
  viewAll: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#2563eb',
  },
  deadlineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  deadlineCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  priorityText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  deadlineTaskTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  deadlineTaskDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  deadlineCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#6b7280',
  },
  checkboxOutline: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
});
