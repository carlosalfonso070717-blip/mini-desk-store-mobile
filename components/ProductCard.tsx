import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../constants/theme';
import { useCartItem } from '../hooks/useCart';
import { Product } from '../types/product';
import { formatPrice } from '../utils/formatPrice';
import { QuantitySelector } from './QuantitySelector';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}

export function ProductCard({ product, onPress }: ProductCardProps) {
  const { quantity, increment, decrement } = useCartItem(product);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
      <QuantitySelector quantity={quantity} onIncrement={increment} onDecrement={decrement} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    margin: spacing.xs,
    gap: spacing.xs,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  title: {
    ...typography.body,
    color: colors.text,
  },
  price: {
    ...typography.price,
    color: colors.text,
  },
});