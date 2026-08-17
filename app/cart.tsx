import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartItem } from '../components/CartItem';
import { EmptyState } from '../components/EmptyState';
import { colors, radius, spacing, typography } from '../constants/theme';
import { useCartSummary } from '../hooks/useCart';
import { formatPrice } from '../utils/formatPrice';

export default function CartScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { lines, total, increment, decrement, removeItem } = useCartSummary();

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add products from the shop to see them here."
        actionLabel="Go to Shop"
        onAction={() => router.push('/products')}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={lines}
        keyExtractor={(line) => String(line.productId)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <CartItem
            line={item}
            onIncrement={() => increment(item.product)}
            onDecrement={() => decrement(item.productId)}
            onRemove={() => removeItem(item.productId)}
          />
        )}
      />
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(total)}</Text>
        </View>
        <Pressable style={styles.checkoutButton} onPress={() => router.push('/checkout')}>
          <Text style={styles.checkoutButtonText}>Proceed to Payment</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.accentText} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.md },
  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { ...typography.subtitle, color: colors.text },
  totalValue: { ...typography.title, color: colors.text },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  checkoutButtonText: { ...typography.subtitle, color: colors.accentText },
});