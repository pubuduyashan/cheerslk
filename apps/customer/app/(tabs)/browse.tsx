import { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { SearchBar } from '@/components/layout/SearchBar';
import { ProductCard } from '@/components/product/ProductCard';
import { router } from 'expo-router';
import type { Product } from '@cheerslk/shared-types';

export default function BrowseScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('browse.allCategories')}</Text>
        <SearchBar
          placeholder={t('common.search')}
          value={search}
          onChangeText={setSearch}
          editable
        />
      </View>

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
  header: { padding: 20, paddingTop: 60, gap: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  list: { padding: 16 },
  row: { gap: 12, marginBottom: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  emptyText: { color: '#8b8ba7', fontSize: 16 },
});
