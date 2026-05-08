import { Modal, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useMemo } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../lib/ThemeContext';
import { Task } from '../types/api';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskDetailsModal({ task, onClose }: TaskDetailsModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!task) return null;

  const dateStr = task.dueDate 
    ? new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    : 'No date set';
  const timeStr = task.dueDate
    ? new Date(task.dueDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    : 'No time set';

  const isHigh = task.priority === 'High';
  const priorityColor = isHigh ? colors.error : (task.priority === 'Medium' ? colors.primary : colors.secondary);

  return (
    <Modal visible={!!task} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={{ width: 60 }} />
            <Text style={styles.heading}>Task Details</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
          
          <ScrollView style={styles.content}>
            <View style={styles.titleSection}>
              <View style={[styles.priorityPill, { backgroundColor: priorityColor + '20' }]}>
                <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
                <Text style={[styles.priorityText, { color: priorityColor }]}>{task.priority} Priority</Text>
              </View>
              <Text style={styles.title}>{task.title}</Text>
            </View>

            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <FontAwesome5 name="calendar-day" size={16} color={colors.onSurfaceVariant} style={styles.icon} />
                <View>
                  <Text style={styles.infoLabel}>Deadline Date</Text>
                  <Text style={styles.infoValue}>{dateStr}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />

              <View style={styles.infoRow}>
                <FontAwesome5 name="clock" size={16} color={colors.onSurfaceVariant} style={styles.icon} />
                <View>
                  <Text style={styles.infoLabel}>Time</Text>
                  <Text style={styles.infoValue}>{timeStr}</Text>
                </View>
              </View>
            </View>

            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText}>
                  {task.description ? task.description : "No description provided."}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  closeButton: {
    width: 60,
    alignItems: 'flex-end',
  },
  closeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.primary,
  },
  heading: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: colors.onSurface,
  },
  content: {
    padding: 24,
  },
  titleSection: {
    marginBottom: 24,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  priorityText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.onSurface,
  },
  infoBox: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 16,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    marginRight: 12,
    textAlign: 'center',
  },
  infoLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: colors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outline,
    marginVertical: 12,
    marginLeft: 36,
  },
  descriptionSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: colors.onSurface,
    marginBottom: 12,
  },
  descriptionBox: {
    backgroundColor: colors.background,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.outline,
    padding: 16,
    minHeight: 100,
  },
  descriptionText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 24,
    color: colors.onSurface,
  },
});
