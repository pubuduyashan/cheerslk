import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Order } from '@cheerslk/shared-types';
import { APP_CONFIG } from '@cheerslk/shared-constants';

interface OrderRequestProps {
  order: Order;
  onAccept: () => void;
  onDecline: () => void;
}

const TIMEOUT_SECONDS = APP_CONFIG.riderAssignmentTimeoutSeconds;

export function OrderRequest({ order, onAccept, onDecline }: OrderRequestProps) {
  const [secondsLeft, setSecondsLeft] = useState(TIMEOUT_SECONDS);
  const progressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: TIMEOUT_SECONDS * 1000,
      useNativeDriver: false,
    }).start();

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const itemCount = order.items?.length ?? 0;
  const estimatedEarnings = Math.round(order.delivery_fee * 0.8);

  return (
    <Modal transparent animationType="slide" visible>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.timerContainer}>
            <View style={styles.timerCircle}>
              <Text style={styles.timerText}>{secondsLeft}</Text>
              <Text style={styles.timerLabel}>sec</Text>
            </View>
            <Animated.View
              style={[
                styles.timerProgress,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          <Text style={styles.title}>New Delivery Request</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Feather name="package" size={20} color="#16c79a" />
              <Text style={styles.infoValue}>{itemCount}</Text>
              <Text style={styles.infoLabel}>Items</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Feather name="map-pin" size={20} color="#16c79a" />
              <Text style={styles.infoValue}>2.5 km</Text>
              <Text style={styles.infoLabel}>Distance</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoItem}>
              <Feather name="dollar-sign" size={20} color="#16c79a" />
              <Text style={styles.infoValue}>
                {APP_CONFIG.currencySymbol} {estimatedEarnings}
              </Text>
              <Text style={styles.infoLabel}>Earnings</Text>
            </View>
          </View>

          <Text style={styles.orderNumber}>#{order.order_number}</Text>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.declineButton}
              onPress={onDecline}
              activeOpacity={0.7}
            >
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={onAccept}
              activeOpacity={0.7}
            >
              <Feather name="check" size={20} color="#ffffff" />
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1a1a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(22, 199, 154, 0.15)',
    borderWidth: 3,
    borderColor: '#16c79a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    color: '#16c79a',
    fontSize: 22,
    fontWeight: '700',
  },
  timerLabel: {
    color: '#16c79a',
    fontSize: 10,
    marginTop: -2,
  },
  timerProgress: {
    height: 3,
    backgroundColor: '#16c79a',
    borderRadius: 2,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  title: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0f0f23',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoItem: {
    alignItems: 'center',
    flex: 1,
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
  },
  infoLabel: {
    color: '#8b8ba7',
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#2a2a3e',
  },
  orderNumber: {
    color: '#8b8ba7',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  declineButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#8b8ba7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: {
    color: '#8b8ba7',
    fontSize: 16,
    fontWeight: '600',
  },
  acceptButton: {
    flex: 2,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#16c79a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  acceptText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
