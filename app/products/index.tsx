import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorState } from '../../components/ErrorState';
import { LoadingState } from '../../components/LoadingState';
import { ProductCard } from '../../components/ProductCard';
import { colors, radius, spacing, typography } from '../../constants/theme';
import { useProducts } from '../../hooks/useProducts';
export default function ProductsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: products, isPending, isError, error, refetch, isRefetching } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    if (!products) return [];
    return Array.from(new Set(products.map((product) => product.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!selectedCategory) return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  if (isPending) {
    return <LoadingState message="Cargando catálogo..." />;
  }

  if (isError) {
    return (
      <ErrorState message={error instanceof Error ? error.message : undefined} onRetry={refetch} />
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
      >
        <CategoryChip
          label="Todos"
          active={selectedCategory === null}
          onPress={() => setSelectedCategory(null)}
        />
        {categories.map((category) => (
          <CategoryChip
            key={category}
            label={category}
            active={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        refreshing={isRefetching}
        onRefresh={refetch}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.md }]}        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              router.push({ pathname: '/products/[id]', params: { id: String(item.id) } })
            }
          />
        )}
      />
    </View>
  );
}

function CategoryChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  chipsRow: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.body, color: colors.textSecondary, textTransform: 'capitalize' },
  chipTextActive: { color: colors.primaryText, fontWeight: '600' },
  list: { padding: spacing.sm },
});