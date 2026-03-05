import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { formatLKR } from '@cheerslk/shared-utils';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@cheerslk/shared-types';

interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
  };
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { product, quantity } = item;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.images[0] || 'https://placehold.co/80x80/1a1a2e/8b8ba7?text=No+Image' }}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name_en}</Text>
        {product.brand && <Text style={styles.brand}>{product.brand}</Text>}
        <Text style={styles.price}>{formatLKR(product.price)}</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => updateQuantity(product.id, quantity - 1)}
          >
            <Ionicons name="remove" size={16} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => updateQuantity(product.id, Math.min(quantity + 1, product.max_per_order))}
          >
            <Ionicons name="add" size={16} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.rightCol}>
        <TouchableOpacity onPress={() => removeItem(product.id)} hitSlop={8}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </TouchableOpacity>
        <Text style={styles.totalPrice}>{formatLKR(product.price * quantity)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#2a2a4a',
  },
  info: { flex: 1, gap: 2 },
  name: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  brand: { color: '#8b8ba7', fontSize: 12 },
  price: { color: '#8b8ba7', fontSize: 13 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
  },
  quantityBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#2a2a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  rightCol: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  totalPrice: {
    color: '#e94560',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
