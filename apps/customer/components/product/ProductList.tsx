import { FlatList, StyleSheet, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Product } from '@cheerslk/shared-types';

interface ProductListProps {
  products: Product[];
  loading?: boolean;
  numColumns?: number;
  onEndReached?: () => void;
}

export function ProductList({ products, loading, numColumns = 2, onEndReached }: ProductListProps) {
  const { t } = useTranslation();

  if (loading && products.length === 0) return <LoadingSpinner />;

  return (
    <FlatList
      data={products}
      numColumns={numColumns}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onPress={() => router.push(`/product/${item.id}`)}
          compact={numColumns > 1}
        />
      )}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t('common.noResults')}</Text>
        </View>
      }
      ListFooterComponent={loading && products.length > 0 ? (
        <View style={styles.footer}>
          <LoadingSpinner />
        </View>
      ) : null}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  row: { gap: 12, marginBottom: 12 },
  empty: { alignItems: 'center', paddingTop: 100 },
  emptyText: { color: '#8b8ba7', fontSize: 16 },
  footer: { height: 60 },
});
