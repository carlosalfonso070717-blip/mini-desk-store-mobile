import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { CartLine } from '../types/cart';
import { formatPrice } from '../utils/formatPrice';
import { QuantitySelector } from './QuantitySelector';

interface CartItemProps {
  line: CartLine;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItem({ line, onIncrement, onDecrement, onRemove }: CartItemProps) {
  return (
    <View style={styles.row}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: line.product.image }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {line.product.title}
        </Text>
        <Text style={styles.unitPrice}>{formatPrice(line.product.price)} each</Text>
        <QuantitySelector quantity={line.quantity} onIncrement={onIncrement} onDecrement={onDecrement} />
      </View>
      <View style={styles.right}>
        <Text style={styles.subtotal}>{formatPrice(line.subtotal)}</Text>
        <Pressable onPress={onRemove} hitSlop={8}>
          <Ionicons name="trash-outline" size={18} color={colors.error} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  imageWrapper: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '75%', height: '75%' },
  info: { flex: 1, gap: spacing.xs },
  title: { ...typography.body, color: colors.text },
  unitPrice: { ...typography.caption, color: colors.textSecondary },
  right: { alignItems: 'flex-end', justifyContent: 'space-between' },
  subtotal: { ...typography.price, color: colors.text },
});