import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>¡Pago completado con éxito!</Text>
      <Text style={styles.message}>
        Tu pedido fue procesado correctamente. Gracias por tu compra.
      </Text>
      <Pressable style={styles.button} onPress={() => router.dismissTo('/products')}>
        <Text style={styles.buttonText}>Volver al catálogo</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  icon: { fontSize: 64, marginBottom: spacing.md },
  title: { ...typography.title, color: colors.text, textAlign: 'center', marginBottom: spacing.xs },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  buttonText: { ...typography.subtitle, color: colors.primaryText },
});