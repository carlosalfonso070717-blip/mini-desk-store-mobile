import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { type ReactNode, useEffect, useState } from 'react';
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
    const orderNumber = String(Math.floor(100000 + Math.random() * 900000));
    const itemCount = lines.length;
    const totalPaid = total;

    setTimeout(() => {
      clearCart();
      router.replace({
        pathname: '/success',
        params: {
          orderNumber,
          totalPaid: totalPaid.toFixed(2),
          itemCount: String(itemCount),
        },
      });
    }, 1200);
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, shadow.card]}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <Field label="FULL NAME">
            <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor={colors.textSecondary}
              editable={!isProcessing}
            />
          </Field>

          <Field label="CARD NUMBER">
            <Ionicons name="card-outline" size={18} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="0000 0000 0000 0000"
              placeholderTextColor={colors.textSecondary}
              keyboardType="number-pad"
              editable={!isProcessing}
            />
          </Field>

          <View style={styles.row}>
            <View style={styles.flexInput}>
              <Field label="EXPIRATION">
                <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  maxLength={5}
                  editable={!isProcessing}
                />
              </Field>
            </View>
            <View style={styles.flexInput}>
              <Field label="CVV">
                <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                  editable={!isProcessing}
                />
              </Field>
            </View>
          </View>
        </View>

        <View style={[styles.card, shadow.card]}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal ({lines.length} items)</Text>
            <Text style={styles.summaryValue}>{formatPrice(total)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        </View>

        <Text style={styles.trustText}>
          This is a simulated payment — no real charge will be made.
        </Text>
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
              <Text style={styles.confirmButtonText}>Confirm Payment</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrapper}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, gap: spacing.md },
  card: { backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  sectionTitle: { ...typography.subtitle, color: colors.text, marginBottom: spacing.xs },
  field: { gap: 4 },
  fieldLabel: { ...typography.caption, color: colors.textSecondary, fontWeight: '600', letterSpacing: 0.4 },
  row: { flexDirection: 'row', gap: spacing.sm },
  flexInput: { flex: 1 },
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
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { ...typography.body, color: colors.textSecondary },
  summaryValue: { ...typography.body, color: colors.text },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
  totalLabel: { ...typography.subtitle, color: colors.text },
  totalValue: { ...typography.subtitle, color: colors.primary },
  trustText: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
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