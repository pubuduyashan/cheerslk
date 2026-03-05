import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '@/components/product/ProductCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Product, Category } from '@cheerslk/shared-types';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { t } = useTranslation();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch category and products from Supabase
    setLoading(false);
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: category?.name_en || '' }} />

      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => router.push(`/product/${item.id}`)}
            compact
          />
        )}
        ListHeaderComponent={
          category ? (
            <View style={styles.header}>
              <Text style={styles.title}>{category.name_en}</Text>
              <Text style={styles.count}>
                {products.length} {t('common.items')}
              </Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{t('common.noResults')}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  header: { paddingHorizontal: 4, paddingBottom: 16 },
  title: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  count: { color: '#8b8ba7', fontSize: 14 },
  list: { padding: 16 },
  row: { gap: 12, marginBottom: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { color: '#8b8ba7', fontSize: 16 },
});
