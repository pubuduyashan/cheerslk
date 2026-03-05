import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { formatLKR } from '@cheerslk/shared-utils';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@cheerslk/shared-types';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { addItem, items } = useCartStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch product from Supabase
    setLoading(false);
  }, [id]);

  const cartItem = items.find((i) => i.product.id === id);
  const inCart = !!cartItem;

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!product) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="wine-outline" size={64} color="#2a2a4a" />
        <Text style={styles.emptyText}>{t('common.notFound')}</Text>
      </View>
    );
  }

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setActiveImageIndex(index);
            }}
          >
            {(product.images.length > 0 ? product.images : ['https://placehold.co/400x400/1a1a2e/8b8ba7?text=No+Image']).map(
              (uri, index) => (
                <Image key={index} source={{ uri }} style={styles.productImage} contentFit="cover" />
              )
            )}
          </ScrollView>
          {product.images.length > 1 && (
            <View style={styles.dots}>
              {product.images.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, index === activeImageIndex && styles.activeDot]}
                />
              ))}
            </View>
          )}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>

        <View style={styles.details}>
          {product.brand && <Text style={styles.brand}>{product.brand}</Text>}
          <Text style={styles.name}>{product.name_en}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatLKR(product.price)}</Text>
            {product.compare_at_price && (
              <Text style={styles.comparePrice}>{formatLKR(product.compare_at_price)}</Text>
            )}
          </View>

          <View style={styles.metaRow}>
            {product.abv != null && (
              <View style={styles.metaItem}>
                <Ionicons name="water" size={16} color="#8b8ba7" />
                <Text style={styles.metaText}>{product.abv}% ABV</Text>
              </View>
            )}
            {product.volume_ml != null && (
              <View style={styles.metaItem}>
                <Ionicons name="flask" size={16} color="#8b8ba7" />
                <Text style={styles.metaText}>{product.volume_ml}ml</Text>
              </View>
            )}
            {product.origin_country && (
              <View style={styles.metaItem}>
                <Ionicons name="globe" size={16} color="#8b8ba7" />
                <Text style={styles.metaText}>{product.origin_country}</Text>
              </View>
            )}
          </View>

          {product.average_rating != null && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={styles.ratingText}>{product.average_rating.toFixed(1)}</Text>
              <Text style={styles.reviewCount}>({product.review_count || 0} reviews)</Text>
            </View>
          )}

          {product.description_en && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('product.description')}</Text>
              <Text style={styles.description}>{product.description_en}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('product.details')}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>SKU</Text>
              <Text style={styles.detailValue}>{product.sku}</Text>
            </View>
            {product.brand && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{t('product.brand')}</Text>
                <Text style={styles.detailValue}>{product.brand}</Text>
              </View>
            )}
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('product.maxPerOrder')}</Text>
              <Text style={styles.detailValue}>{product.max_per_order}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('product.availability')}</Text>
              <Text style={[styles.detailValue, { color: product.stock_quantity > 0 ? '#10B981' : '#EF4444' }]}>
                {product.stock_quantity > 0 ? t('product.inStock') : t('product.outOfStock')}
              </Text>
            </View>
          </View>

          {similarProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('product.similar')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.similarList}>
                {similarProducts.map((p) => (
                  <ProductCard key={p.id} product={p} onPress={() => router.push(`/product/${p.id}`)} />
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={20} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => setQuantity(Math.min(product.max_per_order, quantity + 1))}
          >
            <Ionicons name="add" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <Button
          title={inCart ? t('product.updateCart') : t('product.addToCart')}
          onPress={handleAddToCart}
          disabled={product.stock_quantity <= 0}
          style={styles.addButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  emptyContainer: { flex: 1, backgroundColor: '#0f0f23', justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { color: '#8b8ba7', fontSize: 16 },
  imageContainer: { position: 'relative' },
  productImage: { width, height: width, backgroundColor: '#1a1a2e' },
  dots: { position: 'absolute', bottom: 16, flexDirection: 'row', alignSelf: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2a2a4a' },
  activeDot: { backgroundColor: '#e94560', width: 24 },
  discountBadge: {
    position: 'absolute',
    top: 60,
    right: 16,
    backgroundColor: '#e94560',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  details: { padding: 20 },
  brand: { color: '#8b8ba7', fontSize: 14, marginBottom: 4 },
  name: { color: '#ffffff', fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  price: { color: '#e94560', fontSize: 28, fontWeight: 'bold' },
  comparePrice: { color: '#8b8ba7', fontSize: 18, textDecorationLine: 'line-through' },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: '#8b8ba7', fontSize: 14 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  ratingText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  reviewCount: { color: '#8b8ba7', fontSize: 14 },
  section: { marginTop: 24 },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  description: { color: '#8b8ba7', fontSize: 15, lineHeight: 24 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  detailLabel: { color: '#8b8ba7', fontSize: 14 },
  detailValue: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  similarList: { gap: 12, paddingRight: 20 },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#2a2a4a',
    gap: 16,
    alignItems: 'center',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f23',
    borderRadius: 12,
    gap: 12,
    paddingHorizontal: 4,
  },
  quantityBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a4a',
  },
  quantityText: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', minWidth: 24, textAlign: 'center' },
  addButton: { flex: 1 },
});
