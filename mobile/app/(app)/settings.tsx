import { SafeAreaView, StyleSheet, Text, View, Switch } from 'react-native';
import { useTheme } from '../../lib/ThemeContext';
import { useMemo } from 'react';

export default function SettingsScreen() {
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.outline, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 28, color: colors.onSurface },
  container: { flex: 1, padding: 24 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  settingLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: colors.onSurface,
  },
});
