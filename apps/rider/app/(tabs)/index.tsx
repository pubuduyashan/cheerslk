import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { OnlineToggle } from '@/components/OnlineToggle';
import { OrderRequest } from '@/components/OrderRequest';
import { useRiderStore } from '@/stores/riderStore';
import { useRiderLocation } from '@/hooks/useRiderLocation';
import { useOrderStream } from '@/hooks/useOrderStream';
import { APP_CONFIG } from '@cheerslk/shared-constants';

export default function DashboardScreen() {
  const {
    status,
    setStatus,
    todayStats,
    activeDelivery,
    incomingOrder,
  } = useRiderStore();
  const { startTracking, stopTracking } = useRiderLocation();
  const { acceptOrder, declineOrder } = useOrderStream();

  const isOnline = status === 'online' || status === 'on_delivery';

  const handleToggle = useCallback(async () => {
    if (isOnline) {
      setStatus('offline');
      await stopTracking();
    } else {
      const success = await startTracking();
      if (success) {
        setStatus('online');
      }
    }
  }, [isOnline]);

  const handleAcceptOrder = useCallback(async () => {
    if (incomingOrder) {
      const accepted = await acceptOrder(incomingOrder);
      if (accepted) {
        router.push(`/delivery/${incomingOrder.id}`);
      }
    }
  }, [incomingOrder]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>CheersLK Rider</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isOnline
                  ? 'rgba(22, 199, 154, 0.15)'
                  : 'rgba(139, 139, 167, 0.15)',
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isOnline ? '#16c79a' : '#8b8ba7' },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: isOnline ? '#16c79a' : '#8b8ba7' },
              ]}
            >
              {status === 'on_delivery'
                ? 'On Delivery'
                : isOnline
                ? 'Online'
                : 'Offline'}
            </Text>
          </View>
        </View>

        <OnlineToggle
          isOnline={isOnline}
          onToggle={handleToggle}
          disabled={status === 'on_delivery'}
        />

        {!isOnline && (
          <Text style={styles.offlineHint}>
            Go online to start receiving delivery orders
          </Text>
        )}

        {isOnline && (
          <>
            {/* Today's Stats */}
            <Text style={styles.sectionTitle}>Today's Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Feather name="package" size={20} color="#16c79a" />
                <Text style={styles.statValue}>
                  {todayStats.deliveryCount}
                </Text>
                <Text style={styles.statLabel}>Deliveries</Text>
              </View>
              <View style={styles.statCard}>
                <Feather name="dollar-sign" size={20} color="#16c79a" />
                <Text style={styles.statValue}>
                  {APP_CONFIG.currencySymbol} {todayStats.earnings.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Earnings</Text>
              </View>
              <View style={styles.statCard}>
                <Feather name="star" size={20} color="#16c79a" />
                <Text style={styles.statValue}>
                  {todayStats.rating > 0 ? todayStats.rating.toFixed(1) : '--'}
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>

            {/* Active Delivery */}
            {activeDelivery && (
              <>
                <Text style={styles.sectionTitle}>Active Delivery</Text>
                <TouchableOpacity
                  style={styles.activeCard}
                  onPress={() =>
                    router.push(`/delivery/${activeDelivery.id}`)
                  }
                  activeOpacity={0.7}
                >
                  <View style={styles.activeCardHeader}>
                    <View style={styles.orderBadge}>
                      <Text style={styles.orderBadgeText}>
                        #{activeDelivery.order_number}
                      </Text>
                    </View>
                    <View style={styles.activeStatusBadge}>
                      <Text style={styles.activeStatusText}>
                        {activeDelivery.status.replace(/_/g, ' ')}
                      </Text>
                    </View>
                  </View>
                  {activeDelivery.address && (
                    <View style={styles.addressRow}>
                      <Feather name="map-pin" size={14} color="#8b8ba7" />
                      <Text style={styles.addressText} numberOfLines={1}>
                        {activeDelivery.address.address_line_1},{' '}
                        {activeDelivery.address.city}
                      </Text>
                    </View>
                  )}
                  <View style={styles.goRow}>
                    <Text style={styles.goText}>View Details</Text>
                    <Feather name="chevron-right" size={18} color="#16c79a" />
                  </View>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </ScrollView>

      {/* Incoming Order Modal */}
      {incomingOrder && (
        <OrderRequest
          order={incomingOrder}
          onAccept={handleAcceptOrder}
          onDecline={declineOrder}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  offlineHint: {
    color: '#8b8ba7',
    fontSize: 15,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  statLabel: {
    color: '#8b8ba7',
    fontSize: 12,
    marginTop: 2,
  },
  activeCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#16c79a',
  },
  activeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  orderBadge: {
    backgroundColor: 'rgba(22, 199, 154, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  orderBadgeText: {
    color: '#16c79a',
    fontSize: 13,
    fontWeight: '600',
  },
  activeStatusBadge: {
    backgroundColor: 'rgba(22, 199, 154, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  activeStatusText: {
    color: '#16c79a',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  addressText: {
    color: '#8b8ba7',
    fontSize: 13,
    flex: 1,
  },
  goRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  goText: {
    color: '#16c79a',
    fontSize: 14,
    fontWeight: '600',
  },
});
