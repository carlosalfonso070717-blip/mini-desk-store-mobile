import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { useCartSummary } from '../hooks/useCart';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/formatPrice';

export default function CheckoutScreen() {
  const router = useRouter();
  const { lines, total } = useCartSummary();
  const clearCart = useCartStore((state) => state.clear);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (lines.length === 0 && !isProcessing) {
      router.replace('/products');
    }
  }, [lines.length, isProcessing, router]);

  if (lines.length === 0) {
    return null;
  }

  function handleConfirm() {
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      router.replace('./success');
    }, 1200);
  }

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.sectionTitle}>Resumen del pedido</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Productos ({lines.length})</Text>
          <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Datos de pago (simulado)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre en la tarjeta"
          placeholderTextColor={colors.textSecondary}
          editable={!isProcessing}
        />
        <TextInput
          style={styles.input}
          placeholder="Número de tarjeta"
          placeholderTextColor={colors.textSecondary}
          keyboardType="number-pad"
          editable={!isProcessing}
        />
      </View>

      <Pressable
        style={[styles.confirmButton, isProcessing && styles.confirmButtonDisabled]}
        onPress={handleConfirm}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator color={colors.primaryText} />
        ) : (
          <Text style={styles.confirmButtonText}>Confirmar pago</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.lg },
  summary: { gap: spacing.xs },
  sectionTitle: { ...typography.subtitle, color: colors.text, marginBottom: spacing.xs },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { ...typography.body, color: colors.textSecondary },
  summaryValue: { ...typography.body, color: colors.text },
  totalLabel: { ...typography.subtitle, color: colors.text },
  totalValue: { ...typography.subtitle, color: colors.text },
  form: { gap: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    color: colors.text,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { ...typography.subtitle, color: colors.primaryText },
});