import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { useRiderStore } from '@/stores/riderStore';
import { createSupabaseClient } from '@cheerslk/supabase-client';
import { Order } from '@cheerslk/shared-types';
import { APP_CONFIG } from '@cheerslk/shared-constants';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

type FilterType = 'all' | 'completed' | 'cancelled';

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function DeliveriesScreen() {
  const { rider } = useRiderStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [deliveries, setDeliveries] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    loadDeliveries();
  }, [filter, rider]);

  const loadDeliveries = async () => {
    if (!rider) {
      setLoading(false);
      return;
    }
    setLoading(true);

    let query = supabase
      .from('orders')
      .select('*, address:addresses(*)')
      .eq('rider_id', rider.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (filter === 'completed') {
      query = query.eq('status', 'delivered');
    } else if (filter === 'cancelled') {
      query = query.eq('status', 'cancelled');
    } else {
      query = query.in('status', ['delivered', 'cancelled']);
    }

    const { data } = await query;
    setDeliveries(data ?? []);
    setLoading(false);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-LK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderDelivery = ({ item }: { item: Order }) => {
    const isCompleted = item.status === 'delivered';
    const earnings = Math.round(item.delivery_fee * 0.8);

    return (
      <View style={styles.deliveryCard}>
        <View style={styles.deliveryHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNumber}>#{item.order_number}</Text>
            <Text style={styles.orderDate}>{formatDate(item.created_at)}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isCompleted
                  ? 'rgba(22, 199, 154, 0.15)'
                  : 'rgba(239, 68, 68, 0.15)',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isCompleted ? '#16c79a' : '#ef4444' },
              ]}
            >
              {isCompleted ? 'Completed' : 'Cancelled'}
            </Text>
          </View>
        </View>

        {item.address && (
          <View style={styles.locationRow}>
            <Feather name="map-pin" size={14} color="#8b8ba7" />
            <Text style={styles.locationText} numberOfLines={1}>
              {item.address.city}, {item.address.district}
            </Text>
          </View>
        )}

        <View style={styles.deliveryFooter}>
          <View style={styles.itemCount}>
            <Feather name="package" size={13} color="#8b8ba7" />
            <Text style={styles.itemCountText}>
              {item.items?.length ?? 0} items
            </Text>
          </View>
          {isCompleted && (
            <Text style={styles.earningsText}>
              {APP_CONFIG.currencySymbol} {earnings}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Delivery History</Text>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterButton,
              filter === f.key && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(f.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#16c79a" size="large" />
        </View>
      ) : deliveries.length === 0 ? (
        <View style={styles.center}>
          <Feather name="inbox" size={48} color="#2a2a3e" />
          <Text style={styles.emptyText}>No deliveries yet</Text>
        </View>
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) => item.id}
          renderItem={renderDelivery}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 20,
    paddingTop: 8,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(22, 199, 154, 0.15)',
    borderColor: '#16c79a',
  },
  filterText: {
    color: '#8b8ba7',
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#16c79a',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  deliveryCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  orderDate: {
    color: '#8b8ba7',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  locationText: {
    color: '#8b8ba7',
    fontSize: 13,
    flex: 1,
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
    paddingTop: 8,
  },
  itemCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemCountText: {
    color: '#8b8ba7',
    fontSize: 12,
  },
  earningsText: {
    color: '#16c79a',
    fontSize: 15,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    color: '#8b8ba7',
    fontSize: 15,
  },
});
