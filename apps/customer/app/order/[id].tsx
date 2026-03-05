import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { formatLKR } from '@cheerslk/shared-utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { OrderTimeline } from '@/components/order/OrderTimeline';
import { Button } from '@/components/ui/Button';
import type { Order } from '@cheerslk/shared-types';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch order from Supabase with realtime subscription
    setLoading(false);
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!order) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="receipt-outline" size={64} color="#2a2a4a" />
        <Text style={styles.emptyText}>{t('common.notFound')}</Text>
      </View>
    );
  }

  const isActive = !['delivered', 'cancelled', 'refunded'].includes(order.status);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `#${order.order_number}` }} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>{t(`order.status.${order.status}`)}</Text>
          {isActive && order.status === 'in_transit' && (
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => router.push(`/order/tracking/${order.id}`)}
            >
              <Ionicons name="navigate" size={18} color="#e94560" />
              <Text style={styles.trackText}>{t('order.trackOrder')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('order.timeline')}</Text>
          <OrderTimeline order={order} />
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('order.items')}</Text>
          {order.items?.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemQuantity}>
                <Text style={styles.itemQuantityText}>{item.quantity}x</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product?.name_en || 'Product'}</Text>
                <Text style={styles.itemUnitPrice}>{formatLKR(item.unit_price)} each</Text>
              </View>
              <Text style={styles.itemTotal}>{formatLKR(item.total_price)}</Text>
            </View>
          ))}
        </View>

        {/* Rider Info */}
        {order.rider_id && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('order.riderInfo')}</Text>
            <View style={styles.riderCard}>
              <View style={styles.riderAvatar}>
                <Ionicons name="person" size={24} color="#ffffff" />
              </View>
              <View style={styles.riderInfo}>
                <Text style={styles.riderName}>{t('order.assignedRider')}</Text>
                <Text style={styles.riderStatus}>{t('order.riderOnTheWay')}</Text>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call" size={20} color="#10B981" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Delivery Address */}
        {order.address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('checkout.deliveryAddress')}</Text>
            <View style={styles.addressCard}>
              <Ionicons name="location" size={20} color="#e94560" />
              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>{order.address.label}</Text>
                <Text style={styles.addressText}>
                  {order.address.address_line_1}, {order.address.city}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('checkout.orderSummary')}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
            <Text style={styles.summaryValue}>{formatLKR(order.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{t('cart.deliveryFee')}</Text>
            <Text style={styles.summaryValue}>{formatLKR(order.delivery_fee)}</Text>
          </View>
          {order.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t('cart.discount')}</Text>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>-{formatLKR(order.discount)}</Text>
            </View>
          )}
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>{t('cart.total')}</Text>
            <Text style={styles.totalValue}>{formatLKR(order.total_amount)}</Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('order.payment')}</Text>
          <View style={styles.paymentRow}>
            <Ionicons
              name={order.payment_method === 'payhere' ? 'card' : 'cash'}
              size={20}
              color="#8b8ba7"
            />
            <Text style={styles.paymentMethod}>
              {order.payment_method === 'payhere' ? 'PayHere' : t('checkout.cashOnDelivery')}
            </Text>
            <Text style={[styles.paymentStatus, {
              color: order.payment_status === 'paid' ? '#10B981' : '#F59E0B'
            }]}>
              {t(`order.paymentStatus.${order.payment_status}`)}
            </Text>
          </View>
        </View>

        {/* Actions */}
        {order.status === 'delivered' && (
          <Button
            title={t('order.writeReview')}
            onPress={() => router.push('/reviews')}
            variant="outline"
            style={styles.actionButton}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  emptyContainer: { flex: 1, backgroundColor: '#0f0f23', justifyContent: 'center', alignItems: 'center', gap: 16 },
  emptyText: { color: '#8b8ba7', fontSize: 16 },
  content: { padding: 16, paddingBottom: 32 },
  statusCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  statusTitle: { color: '#e94560', fontSize: 20, fontWeight: 'bold' },
  trackButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  trackText: { color: '#e94560', fontSize: 14, fontWeight: '600' },
  section: { marginBottom: 24 },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
    gap: 12,
  },
  itemQuantity: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2a2a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemQuantityText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  itemInfo: { flex: 1 },
  itemName: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  itemUnitPrice: { color: '#8b8ba7', fontSize: 12 },
  itemTotal: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  riderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  riderAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a4a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  riderInfo: { flex: 1 },
  riderName: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  riderStatus: { color: '#8b8ba7', fontSize: 12 },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a3a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  addressInfo: { flex: 1 },
  addressLabel: { color: '#ffffff', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  addressText: { color: '#8b8ba7', fontSize: 13 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: { color: '#8b8ba7', fontSize: 14 },
  summaryValue: { color: '#ffffff', fontSize: 14 },
  totalRow: { borderTopWidth: 1, borderTopColor: '#2a2a4a', marginTop: 8, paddingTop: 12 },
  totalLabel: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  totalValue: { color: '#e94560', fontSize: 18, fontWeight: 'bold' },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  paymentMethod: { color: '#ffffff', fontSize: 14, flex: 1 },
  paymentStatus: { fontSize: 14, fontWeight: '600' },
  actionButton: { marginTop: 8 },
});
