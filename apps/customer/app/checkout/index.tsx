import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { formatLKR } from '@cheerslk/shared-utils';
import { useCartStore } from '@/stores/cartStore';
import { useLocationStore } from '@/stores/locationStore';
import { Button } from '@/components/ui/Button';
import { CartSummary } from '@/components/cart/CartSummary';
import type { DeliveryType, PaymentMethod } from '@cheerslk/shared-types';

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { selectedAddress, addresses } = useLocationStore();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('immediate');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [scheduledTime, setScheduledTime] = useState<string | null>(null);
  const [loyaltyPointsToUse, setLoyaltyPointsToUse] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const subtotal = getSubtotal();
  const deliveryFee = 350;
  const loyaltyDiscount = loyaltyPointsToUse * 0.1;
  const total = subtotal + deliveryFee - loyaltyDiscount;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // TODO: Create order via Supabase Edge Function
      if (paymentMethod === 'payhere') {
        router.push('/checkout/payment');
      } else {
        clearCart();
        router.replace('/(tabs)/orders');
      }
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Address Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('checkout.deliveryAddress')}</Text>
          <TouchableOpacity style={styles.addressCard}>
            {selectedAddress ? (
              <>
                <View style={styles.addressHeader}>
                  <Ionicons name="location" size={20} color="#e94560" />
                  <Text style={styles.addressLabel}>{selectedAddress.label}</Text>
                </View>
                <Text style={styles.addressText}>
                  {selectedAddress.address_line_1}
                  {selectedAddress.address_line_2 ? `, ${selectedAddress.address_line_2}` : ''}
                </Text>
                <Text style={styles.addressCity}>{selectedAddress.city}, {selectedAddress.district}</Text>
              </>
            ) : (
              <View style={styles.addAddressRow}>
                <Ionicons name="add-circle" size={24} color="#e94560" />
                <Text style={styles.addAddressText}>{t('checkout.addAddress')}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Delivery Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('checkout.deliveryTime')}</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.optionCard, deliveryType === 'immediate' && styles.optionActive]}
              onPress={() => setDeliveryType('immediate')}
            >
              <Ionicons name="flash" size={24} color={deliveryType === 'immediate' ? '#e94560' : '#8b8ba7'} />
              <Text style={[styles.optionTitle, deliveryType === 'immediate' && styles.optionTitleActive]}>
                {t('checkout.immediate')}
              </Text>
              <Text style={styles.optionSubtitle}>30-45 min</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionCard, deliveryType === 'scheduled' && styles.optionActive]}
              onPress={() => setDeliveryType('scheduled')}
            >
              <Ionicons name="calendar" size={24} color={deliveryType === 'scheduled' ? '#e94560' : '#8b8ba7'} />
              <Text style={[styles.optionTitle, deliveryType === 'scheduled' && styles.optionTitleActive]}>
                {t('checkout.scheduled')}
              </Text>
              <Text style={styles.optionSubtitle}>{t('checkout.pickTime')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('checkout.paymentMethod')}</Text>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'cash_on_delivery' && styles.paymentActive]}
            onPress={() => setPaymentMethod('cash_on_delivery')}
          >
            <Ionicons name="cash" size={24} color={paymentMethod === 'cash_on_delivery' ? '#e94560' : '#8b8ba7'} />
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, paymentMethod === 'cash_on_delivery' && styles.paymentTitleActive]}>
                {t('checkout.cashOnDelivery')}
              </Text>
              <Text style={styles.paymentSubtitle}>{t('checkout.payWhenDelivered')}</Text>
            </View>
            <View style={[styles.radio, paymentMethod === 'cash_on_delivery' && styles.radioActive]} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'payhere' && styles.paymentActive]}
            onPress={() => setPaymentMethod('payhere')}
          >
            <Ionicons name="card" size={24} color={paymentMethod === 'payhere' ? '#e94560' : '#8b8ba7'} />
            <View style={styles.paymentInfo}>
              <Text style={[styles.paymentTitle, paymentMethod === 'payhere' && styles.paymentTitleActive]}>
                {t('checkout.payhere')}
              </Text>
              <Text style={styles.paymentSubtitle}>{t('checkout.cardOrBank')}</Text>
            </View>
            <View style={[styles.radio, paymentMethod === 'payhere' && styles.radioActive]} />
          </TouchableOpacity>
        </View>

        {/* Loyalty Points */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('checkout.loyaltyPoints')}</Text>
          <View style={styles.loyaltyCard}>
            <View style={styles.loyaltyRow}>
              <Ionicons name="diamond" size={20} color="#F59E0B" />
              <Text style={styles.loyaltyBalance}>0 {t('checkout.pointsAvailable')}</Text>
            </View>
            <Text style={styles.loyaltySavings}>
              {t('checkout.usableValue')}: {formatLKR(0)}
            </Text>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('checkout.orderSummary')}</Text>
          {items.map((item) => (
            <View key={item.product.id} style={styles.summaryItem}>
              <Text style={styles.summaryName} numberOfLines={1}>
                {item.quantity}x {item.product.name_en}
              </Text>
              <Text style={styles.summaryPrice}>
                {formatLKR(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}
          <CartSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            discount={loyaltyDiscount}
            total={total}
          />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t('cart.total')}</Text>
          <Text style={styles.totalAmount}>{formatLKR(total)}</Text>
        </View>
        <Button
          title={t('checkout.placeOrder')}
          onPress={handlePlaceOrder}
          loading={loading}
          disabled={!selectedAddress || items.length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 16, paddingBottom: 32 },
  section: { marginBottom: 24 },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  addressCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  addressHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  addressLabel: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  addressText: { color: '#8b8ba7', fontSize: 14, marginBottom: 4 },
  addressCity: { color: '#8b8ba7', fontSize: 14 },
  addAddressRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addAddressText: { color: '#e94560', fontSize: 16, fontWeight: '600' },
  optionRow: { flexDirection: 'row', gap: 12 },
  optionCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#2a2a4a',
  },
  optionActive: { borderColor: '#e94560' },
  optionTitle: { color: '#8b8ba7', fontSize: 14, fontWeight: '600' },
  optionTitleActive: { color: '#ffffff' },
  optionSubtitle: { color: '#8b8ba7', fontSize: 12 },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    gap: 12,
    borderWidth: 2,
    borderColor: '#2a2a4a',
  },
  paymentActive: { borderColor: '#e94560' },
  paymentInfo: { flex: 1 },
  paymentTitle: { color: '#8b8ba7', fontSize: 16, fontWeight: '600' },
  paymentTitleActive: { color: '#ffffff' },
  paymentSubtitle: { color: '#8b8ba7', fontSize: 12 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#2a2a4a' },
  radioActive: { borderColor: '#e94560', backgroundColor: '#e94560' },
  loyaltyCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    gap: 8,
  },
  loyaltyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loyaltyBalance: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  loyaltySavings: { color: '#8b8ba7', fontSize: 14 },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  summaryName: { color: '#ffffff', fontSize: 14, flex: 1, marginRight: 12 },
  summaryPrice: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
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
