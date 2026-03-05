import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { formatLKR } from '@cheerslk/shared-utils';
import type { Product } from '@cheerslk/shared-types';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  compact?: boolean;
}

export function ProductCard({ product, onPress, compact }: ProductCardProps) {
  return (
    <TouchableOpacity style={[styles.card, compact && styles.compact]} onPress={onPress}>
      <Image
        source={{ uri: product.images[0] || 'https://placehold.co/200x200/1a1a2e/8b8ba7?text=No+Image' }}
        style={[styles.image, compact && styles.compactImage]}
        contentFit="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name_en}</Text>
        {product.brand && <Text style={styles.brand}>{product.brand}</Text>}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatLKR(product.price)}</Text>
          {product.compare_at_price && (
            <Text style={styles.comparePrice}>{formatLKR(product.compare_at_price)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  compact: { flex: 1 },
  image: { width: '100%', height: 140 },
  compactImage: { height: 120 },
  info: { padding: 12, gap: 4 },
  name: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  brand: { color: '#8b8ba7', fontSize: 12 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  price: { color: '#e94560', fontSize: 16, fontWeight: 'bold' },
  comparePrice: { color: '#8b8ba7', fontSize: 12, textDecorationLine: 'line-through' },
});
