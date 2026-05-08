import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';
import { PrimaryButton } from './PrimaryButton';
import { useTheme } from '../lib/ThemeContext';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={loading ? undefined : onCancel}>
        <Pressable style={styles.container} onPress={() => {}}>
          <View style={styles.iconRow}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>!</Text>
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttons}>
            <PrimaryButton title={cancelLabel} onPress={onCancel} variant="secondary" disabled={loading} />
            <PrimaryButton title={confirmLabel} onPress={onConfirm} loading={loading} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.scrim,
    justifyContent: 'center',
    padding: 24,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 12,
    alignItems: 'center',
    maxWidth: 360,
    alignSelf: 'center',
    width: '100%',
  },
  iconRow: {
    marginBottom: 4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.errorContainer,
    borderWidth: 1,
    borderColor: colors.errorContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.error,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.onSurface,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttons: {
    width: '100%',
    gap: 10,
    marginTop: 4,
  },
});
