import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { ProductCard } from '@/components/product/ProductCard';
import { CategoryCard } from '@/components/layout/CategoryCard';
import { SearchBar } from '@/components/layout/SearchBar';
import type { Product, Category } from '@cheerslk/shared-types';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { profile } = useAuthStore();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch from Supabase
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {t('home.greeting', { name: profile?.full_name || 'Guest' })}
          </Text>
          <TouchableOpacity style={styles.locationRow}>
            <Ionicons name="location" size={16} color="#e94560" />
            <Text style={styles.locationText}>{t('home.deliverTo')}: Colombo</Text>
            <Text style={styles.changeText}>{t('home.changeAddress')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar
        placeholder={t('common.search')}
        onPress={() => router.push('/browse')}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onPress={() => router.push(`/category/${cat.slug}`)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.featured')}</Text>
          <TouchableOpacity onPress={() => router.push('/browse')}>
            <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productList}>
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/product/${product.id}`)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.popular')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productList}>
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => router.push(`/product/${product.id}`)}
            />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  header: { padding: 20, paddingTop: 60 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { color: '#8b8ba7', fontSize: 14 },
  changeText: { color: '#e94560', fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#ffffff', paddingHorizontal: 20, marginBottom: 12 },
  seeAll: { color: '#e94560', fontSize: 14, fontWeight: '600' },
  categoryList: { paddingHorizontal: 16, gap: 12 },
  productList: { paddingHorizontal: 16, gap: 12 },
});
