import { useRouter } from 'expo-router';
import { FlatList } from 'react-native';
import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { ProductCard } from '../../components/ProductCard';
import { colors, spacing } from '../../constants/theme';
import { useProducts } from '../../hooks/useProducts';

export default function ProductsScreen() {
  const router = useRouter();
  const { data: products, isPending, isError, error, refetch, isRefetching } = useProducts();

  if (isPending) {
    return <LoadingState message="Cargando catálogo..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : undefined}
        onRetry={refetch}
      />
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      refreshing={isRefetching}
      onRefresh={refetch}
      contentContainerStyle={{ padding: spacing.sm, backgroundColor: colors.background }}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() =>
            router.push({ pathname: '/products/[id]', params: { id: String(item.id) } })
          }
        />
      )}
    />
  );
}