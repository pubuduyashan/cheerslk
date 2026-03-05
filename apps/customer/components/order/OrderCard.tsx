import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatLKR } from '@cheerslk/shared-utils';
import { useTranslation } from 'react-i18next';
import type { Order, OrderStatus } from '@cheerslk/shared-types';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

const statusColors: Record<OrderStatus, string> = {
  pending: '#F59E0B',
  paid: '#3B82F6',
  confirmed: '#3B82F6',
  preparing: '#8B5CF6',
  rider_assigned: '#8B5CF6',
  picked_up: '#10B981',
  in_transit: '#10B981',
  delivered: '#10B981',
  cancelled: '#EF4444',
  refunded: '#8b8ba7',
};

export function OrderCard({ order, onPress }: OrderCardProps) {
  const { t } = useTranslation();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.orderNumber}>#{order.order_number}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] + '20' }]}>
          <Text style={[styles.statusText, { color: statusColors[order.status] }]}>
            {t(`order.status.${order.status}`)}
          </Text>
        </View>
      </View>

      <View style={styles.itemsPreview}>
        <Ionicons name="cube-outline" size={16} color="#8b8ba7" />
        <Text style={styles.itemsText}>
          {order.items?.length || 0} {t('common.items')}
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.total}>{formatLKR(order.total_amount)}</Text>
        <Text style={styles.date}>
          {new Date(order.created_at).toLocaleDateString('en-LK', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.paymentRow}>
        <Ionicons
          name={order.payment_method === 'payhere' ? 'card-outline' : 'cash-outline'}
          size={14}
          color="#8b8ba7"
        />
        <Text style={styles.paymentText}>
          {order.payment_method === 'payhere' ? 'PayHere' : t('checkout.cashOnDelivery')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    gap: 10,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderNumber: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '700' },
  itemsPreview: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  itemsText: { color: '#8b8ba7', fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { color: '#e94560', fontSize: 18, fontWeight: 'bold' },
  date: { color: '#8b8ba7', fontSize: 12 },
  paymentRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  paymentText: { color: '#8b8ba7', fontSize: 12 },
});
