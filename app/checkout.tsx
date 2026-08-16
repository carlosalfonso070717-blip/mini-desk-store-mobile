import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, shadow, spacing, typography } from '../constants/theme';
import { useCartSummary } from '../hooks/useCart';
import { useCartStore } from '../store/cartStore';
import { formatPrice } from '../utils/formatPrice';

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      router.replace('/success');
    }, 1200);
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, shadow.card]}>
          <Text style={styles.sectionTitle}>Resumen del pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Productos ({lines.length})</Text>
            <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total a pagar</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        <View style={[styles.card, shadow.card]}>
          <Text style={styles.sectionTitle}>Datos de pago (simulado)</Text>

          <View style={styles.inputWrapper}>
            <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Nombre en la tarjeta"
              placeholderTextColor={colors.textSecondary}
              editable={!isProcessing}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="card-outline" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Número de tarjeta"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              editable={!isProcessing}
            />
          </View>

          <Text style={styles.trustText}>Pago simulado, no se procesa ningún cobro real.</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <Pressable
          style={[styles.confirmButton, isProcessing && styles.confirmButtonDisabled]}
          onPress={handleConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <>
              <Ionicons name="lock-closed" size={16} color={colors.primaryText} />
              <Text style={styles.confirmButtonText}>Confirmar pago</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, gap: spacing.md },
  card: { backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  sectionTitle: { ...typography.subtitle, color: colors.text },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { ...typography.body, color: colors.textSecondary },
  summaryValue: { ...typography.body, color: colors.text },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  totalLabel: { ...typography.subtitle, color: colors.text },
  totalValue: { ...typography.subtitle, color: colors.primary },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
  },
  input: { flex: 1, ...typography.body, color: colors.text, paddingVertical: spacing.sm },
  trustText: { ...typography.caption, color: colors.textSecondary },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { ...typography.subtitle, color: colors.primaryText },
});