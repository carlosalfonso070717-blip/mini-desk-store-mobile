import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { QuantitySelector } from '../../components/QuantitySelector';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { useCartItem } from '../../hooks/useCart';
import { useProduct } from '../../hooks/useProduct';
import { Product } from '../../types/product';
import { formatPrice } from '../../utils/formatPrice';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);
  const { data: product, isPending, isError, error, refetch } = useProduct(productId);

  if (isPending) {
    return <LoadingState message="Loading product..." />;
  }

  if (isError || !product) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Product not found.'}
        onRetry={refetch}
      />
    );
  }

  return <ProductDetailContent product={product} />;
}

function ProductDetailContent({ product }: { product: Product }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { quantity, increment, decrement } = useCartItem(product);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.body}>
          <View style={styles.metaRow}>
            <Text style={styles.category}>{product.category}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={colors.star} />
              <Text style={styles.ratingText}>
                {product.rating.rate.toFixed(1)} ({product.rating.count} reviews)
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.sm }]}>
        <QuantitySelector quantity={quantity} onIncrement={increment} onDecrement={decrement} />
        <Pressable style={styles.cartButton} onPress={() => router.push('/cart')}>
          <Ionicons name="cart-outline" size={18} color={colors.accentText} />
          <Text style={styles.cartButtonText}>Go to Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: spacing.lg },
  imageWrapper: {
    height: 280,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: { width: '70%', height: '70%' },
  body: { padding: spacing.lg, gap: spacing.xs },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  category: { ...typography.caption, color: colors.textSecondary, textTransform: 'capitalize' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { ...typography.caption, color: colors.textSecondary },
  title: { ...typography.title, color: colors.text, marginTop: spacing.xs },
  price: { ...typography.price, fontSize: 22, color: colors.primary, marginBottom: spacing.sm },
  sectionTitle: { ...typography.subtitle, color: colors.text, marginTop: spacing.sm },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 20 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  cartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  cartButtonText: { ...typography.subtitle, color: colors.accentText },
});