import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadow, spacing, typography } from '../constants/theme';
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
    <Pressable onPress={onPress} style={[styles.card, shadow.card]}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={12} color={colors.star} />
        <Text style={styles.ratingText}>
          {product.rating.rate.toFixed(1)} ({product.rating.count})
        </Text>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <QuantitySelector quantity={quantity} onIncrement={increment} onDecrement={decrement} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.sm,
    margin: spacing.xs,
    gap: spacing.xs,
  },
  imageWrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '80%', height: '80%' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { ...typography.caption, color: colors.textSecondary },
  title: { ...typography.body, color: colors.text, minHeight: 34 },
  footer: { gap: spacing.xs },
  price: { ...typography.price, color: colors.text },
});