import { Modal, Pressable, StyleSheet, Text, TextInput, View, ScrollView, Platform } from 'react-native';
import { useState } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { PrimaryButton } from './PrimaryButton';

interface AddTaskModalProps {
  visible: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string, priority: string, dueDate: string) => Promise<void>;
}

export function AddTaskModal({ visible, loading = false, onClose, onSubmit }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    await onSubmit(trimmedTitle, description.trim(), priority, dueDate.toISOString());
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setDueDate(new Date());
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = new Date(dueDate);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDueDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = new Date(dueDate);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0);
      setDueDate(newDate);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <FontAwesome5 name="times" size={16} color="#6b7280" />
              <Text style={styles.closeText}>Cancel</Text>
            </Pressable>
            <Text style={styles.heading}>New Task</Text>
            <View style={{ width: 60 }} /> {/* Spacer to balance header */}
          </View>
          
          <ScrollView style={styles.form}>
            <Text style={styles.label}>Task Name</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Prepare Q3 Report"
              placeholderTextColor="#9ca3af"
              style={styles.input}
            />

            <Text style={styles.label}>Notes</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Add details or context..."
              placeholderTextColor="#9ca3af"
              multiline
              style={[styles.input, styles.textArea]}
            />

            <Text style={styles.label}>Set Deadline</Text>
            {Platform.OS === 'web' ? (
              <View style={styles.row}>
                {/* @ts-ignore: HTML inputs for Expo Web */}
                <input
                  type="date"
                  value={dueDate.toLocaleDateString('en-CA')} // YYYY-MM-DD
                  onChange={(e: any) => {
                    const val = e.target.value;
                    if (val) {
                      const newDate = new Date(dueDate);
                      const [y, m, d] = val.split('-');
                      newDate.setFullYear(parseInt(y), parseInt(m) - 1, parseInt(d));
                      setDueDate(newDate);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    fontFamily: 'Inter_400Regular',
                    fontSize: 14,
                    color: '#111827',
                  }}
                />
                {/* @ts-ignore: HTML inputs for Expo Web */}
                <input
                  type="time"
                  value={dueDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} // HH:mm
                  onChange={(e: any) => {
                    const val = e.target.value;
                    if (val) {
                      const newDate = new Date(dueDate);
                      const [h, min] = val.split(':');
                      newDate.setHours(parseInt(h), parseInt(min), 0);
                      setDueDate(newDate);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                    fontFamily: 'Inter_400Regular',
                    fontSize: 14,
                    color: '#111827',
                  }}
                />
              </View>
            ) : (
              <>
                <View style={styles.row}>
                  <Pressable style={styles.dateInputWrapper} onPress={() => setShowDatePicker(true)}>
                    <FontAwesome5 name="calendar" size={14} color="#6b7280" style={styles.inputIcon} />
                    <Text style={styles.mockInputText}>
                      {dueDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </Text>
                  </Pressable>
                  <Pressable style={styles.dateInputWrapper} onPress={() => setShowTimePicker(true)}>
                    <FontAwesome5 name="clock" size={14} color="#6b7280" style={styles.inputIcon} />
                    <Text style={styles.mockInputText}>
                      {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </Pressable>
                </View>
                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
                {showTimePicker && (
                  <DateTimePicker
                    value={dueDate}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
              </>
            )}

            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityRow}>
              {(['Low', 'Medium', 'High'] as const).map((p) => (
                <Pressable
                  key={p}
                  style={[styles.priorityPill, priority === p && styles.priorityPillActive]}
                  onPress={() => setPriority(p)}
                >
                  {priority === p && <FontAwesome5 name="check" size={12} color="#ffffff" style={{ marginRight: 6 }} />}
                  <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>{p}</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <PrimaryButton title="Add Task" onPress={handleSubmit} loading={loading} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 17, 17, 0.35)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '80%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: 60,
  },
  closeText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#6b7280',
  },
  heading: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },
  form: {
    padding: 16,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    color: '#111827',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  mockInputText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#6b7280',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  priorityPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 100,
    backgroundColor: '#ffffff',
  },
  priorityPillActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  priorityText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#111827',
  },
  priorityTextActive: {
    color: '#ffffff',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
});
