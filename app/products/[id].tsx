import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    return <LoadingState message="Cargando producto..." />;
  }

  if (isError || !product) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'No se encontró el producto.'}
        onRetry={refetch}
      />
    );
  }

  return <ProductDetailContent product={product} />;
}

function ProductDetailContent({ product }: { product: Product }) {
  const { quantity, increment, decrement } = useCartItem(product);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.title}>{product.title}</Text>
      <View style={styles.row}>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={styles.rating}>
          ⭐ {product.rating.rate} ({product.rating.count})
        </Text>
      </View>
      <Text style={styles.description}>{product.description}</Text>
      <View style={styles.selectorWrapper}>
        <QuantitySelector quantity={quantity} onIncrement={increment} onDecrement={decrement} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.background },
  image: { width: '100%', height: 260, borderRadius: radius.md, backgroundColor: colors.surface },
  category: { ...typography.caption, color: colors.textSecondary, textTransform: 'uppercase' },
  title: { ...typography.title, color: colors.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { ...typography.price, fontSize: 20, color: colors.text },
  rating: { ...typography.body, color: colors.textSecondary },
  description: { ...typography.body, color: colors.text, lineHeight: 20 },
  selectorWrapper: { marginTop: spacing.md },
});