import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { PrimaryButton } from './PrimaryButton';

interface AddTaskModalProps {
  visible: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => Promise<void>;
}

export function AddTaskModal({ visible, loading = false, onClose, onSubmit }: AddTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    await onSubmit(trimmedTitle, description.trim());
    setTitle('');
    setDescription('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.heading}>Add Task</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#9ca3af"
            style={styles.input}
          />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description (optional)"
            placeholderTextColor="#9ca3af"
            multiline
            style={[styles.input, styles.textArea]}
          />

          <View style={styles.buttons}>
            <PrimaryButton title="Cancel" onPress={onClose} variant="secondary" disabled={loading} />
            <PrimaryButton title="Save Task" onPress={handleSubmit} loading={loading} />
          </View>
          <Pressable onPress={onClose} style={styles.closeHitbox} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 17, 17, 0.35)',
    justifyContent: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    color: '#111111',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  buttons: {
    gap: 10,
  },
  closeHitbox: {
    position: 'absolute',
  },
});
