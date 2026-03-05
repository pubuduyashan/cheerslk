import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import type { Order, OrderStatus } from '@cheerslk/shared-types';

interface OrderTimelineProps {
  order: Order;
}

interface TimelineStep {
  status: OrderStatus;
  icon: keyof typeof Ionicons.glyphMap;
  timestampKey: keyof Order;
}

const steps: TimelineStep[] = [
  { status: 'pending', icon: 'receipt-outline', timestampKey: 'created_at' },
  { status: 'confirmed', icon: 'checkmark-circle-outline', timestampKey: 'confirmed_at' },
  { status: 'preparing', icon: 'restaurant-outline', timestampKey: 'preparing_at' },
  { status: 'rider_assigned', icon: 'person-outline', timestampKey: 'rider_assigned_at' },
  { status: 'picked_up', icon: 'bag-check-outline', timestampKey: 'picked_up_at' },
  { status: 'in_transit', icon: 'bicycle-outline', timestampKey: 'in_transit_at' },
  { status: 'delivered', icon: 'home-outline', timestampKey: 'delivered_at' },
];

const statusOrder: OrderStatus[] = [
  'pending', 'paid', 'confirmed', 'preparing',
  'rider_assigned', 'picked_up', 'in_transit', 'delivered',
];

export function OrderTimeline({ order }: OrderTimelineProps) {
  const { t } = useTranslation();

  const currentIndex = statusOrder.indexOf(order.status);
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

  return (
    <View style={styles.container}>
      {steps.map((step, index) => {
        const stepIndex = statusOrder.indexOf(step.status);
        const isCompleted = !isCancelled && currentIndex >= stepIndex;
        const isCurrent = order.status === step.status;
        const timestamp = order[step.timestampKey] as string | undefined;

        return (
          <View key={step.status} style={styles.step}>
            <View style={styles.iconCol}>
              <View style={[
                styles.iconCircle,
                isCompleted && styles.iconCompleted,
                isCurrent && styles.iconCurrent,
              ]}>
                <Ionicons
                  name={isCompleted ? 'checkmark' : step.icon}
                  size={18}
                  color={isCompleted || isCurrent ? '#ffffff' : '#4a4a6a'}
                />
              </View>
              {index < steps.length - 1 && (
                <View style={[styles.line, isCompleted && styles.lineCompleted]} />
              )}
            </View>

            <View style={styles.textCol}>
              <Text style={[
                styles.stepLabel,
                isCompleted && styles.stepLabelCompleted,
                isCurrent && styles.stepLabelCurrent,
              ]}>
                {t(`order.status.${step.status}`)}
              </Text>
              {timestamp && (
                <Text style={styles.stepTime}>
                  {new Date(timestamp).toLocaleString('en-LK', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: 'numeric',
                    month: 'short',
                  })}
                </Text>
              )}
            </View>
          </View>
        );
      })}

      {isCancelled && (
        <View style={styles.step}>
          <View style={styles.iconCol}>
            <View style={[styles.iconCircle, styles.iconCancelled]}>
              <Ionicons name="close" size={18} color="#ffffff" />
            </View>
          </View>
          <View style={styles.textCol}>
            <Text style={[styles.stepLabel, styles.stepLabelCancelled]}>
              {t(`order.status.${order.status}`)}
            </Text>
            {order.cancelled_at && (
              <Text style={styles.stepTime}>
                {new Date(order.cancelled_at).toLocaleString('en-LK', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: 'numeric',
                  month: 'short',
                })}
              </Text>
            )}
            {order.cancellation_reason && (
              <Text style={styles.cancelReason}>{order.cancellation_reason}</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingLeft: 4 },
  step: { flexDirection: 'row', gap: 14 },
  iconCol: { alignItems: 'center', width: 36 },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2a2a4a',
  },
  iconCompleted: { backgroundColor: '#10B981', borderColor: '#10B981' },
  iconCurrent: { backgroundColor: '#e94560', borderColor: '#e94560' },
  iconCancelled: { backgroundColor: '#EF4444', borderColor: '#EF4444' },
  line: {
    width: 2,
    height: 28,
    backgroundColor: '#2a2a4a',
  },
  lineCompleted: { backgroundColor: '#10B981' },
  textCol: { flex: 1, paddingBottom: 24 },
  stepLabel: { color: '#4a4a6a', fontSize: 14, fontWeight: '600' },
  stepLabelCompleted: { color: '#ffffff' },
  stepLabelCurrent: { color: '#e94560' },
  stepLabelCancelled: { color: '#EF4444' },
  stepTime: { color: '#8b8ba7', fontSize: 12, marginTop: 2 },
  cancelReason: { color: '#8b8ba7', fontSize: 12, marginTop: 4, fontStyle: 'italic' },
});
