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
      <Image source={{ uri: line.product.image }} style={styles.image} resizeMode="contain" />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {line.product.title}
        </Text>
        <Text style={styles.unitPrice}>{formatPrice(line.product.price)} c/u</Text>
        <QuantitySelector quantity={line.quantity} onIncrement={onIncrement} onDecrement={onDecrement} />
      </View>
      <View style={styles.right}>
        <Text style={styles.subtotal}>{formatPrice(line.subtotal)}</Text>
        <Pressable onPress={onRemove} hitSlop={8}>
          <Text style={styles.remove}>Eliminar</Text>
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
  image: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...typography.body,
    color: colors.text,
  },
  unitPrice: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  subtotal: {
    ...typography.price,
    color: colors.text,
  },
  remove: {
    ...typography.caption,
    color: colors.error,
  },
});