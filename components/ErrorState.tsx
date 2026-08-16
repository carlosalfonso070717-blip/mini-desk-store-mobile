import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Ocurrió un error al cargar la información.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <Ionicons name="alert-circle-outline" size={40} color={colors.error} />
      </View>
      <Text style={styles.title}>Algo salió mal</Text>
      <Text style={styles.text}>{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} style={styles.button}>
          <Text style={styles.buttonText}>Reintentar</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: { ...typography.subtitle, color: colors.text },
  text: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  button: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  buttonText: { ...typography.subtitle, color: colors.primaryText },
});