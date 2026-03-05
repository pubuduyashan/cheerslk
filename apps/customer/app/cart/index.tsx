import { View, Text, StyleSheet, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/stores/cartStore';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { PromoCodeInput } from '@/components/cart/PromoCodeInput';
import { Button } from '@/components/ui/Button';

export default function CartScreen() {
  const { t } = useTranslation();
  const { items, getSubtotal, clearCart } = useCartStore();

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 350 : 0;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={80} color="#2a2a4a" />
        <Text style={styles.emptyTitle}>{t('cart.empty')}</Text>
        <Text style={styles.emptyMessage}>{t('cart.emptyMessage')}</Text>
        <Button
          title={t('cart.startShopping')}
          onPress={() => router.push('/(tabs)/browse')}
          style={styles.shopButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => <CartItem item={item} />}
        ListFooterComponent={
          <View style={styles.footer}>
            <PromoCodeInput />
            <CartSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              discount={discount}
              total={total}
            />
          </View>
        }
      />

      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('cart.total')}</Text>
          <Text style={styles.totalAmount}>
            {t('common.currency', { amount: total.toLocaleString('en-LK', { minimumFractionDigits: 2 }) })}
          </Text>
        </View>
        <Button
          title={t('cart.checkout')}
          onPress={() => router.push('/checkout')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  emptyTitle: { color: '#ffffff', fontSize: 20, fontWeight: 'bold' },
  emptyMessage: { color: '#8b8ba7', fontSize: 14, textAlign: 'center' },
  shopButton: { marginTop: 16, width: '100%' },
  list: { padding: 16 },
  footer: { gap: 16, marginTop: 16 },
  bottomBar: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#2a2a4a',
    gap: 12,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: '#8b8ba7', fontSize: 16 },
  totalAmount: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
});
