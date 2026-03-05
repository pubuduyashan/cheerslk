import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import type { Order } from '@cheerslk/shared-types';
import { formatLKR } from '@cheerslk/shared-utils';

export default function OrdersScreen() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');
  const [orders, setOrders] = useState<Order[]>([]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('order.title')}</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            {t('order.active')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
            {t('order.past')}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => router.push(`/order/${item.id}`)}
          >
            <View style={styles.orderHeader}>
              <Text style={styles.orderNumber}>{t('order.orderNumber', { number: item.order_number })}</Text>
              <Text style={styles.orderStatus}>{t(`order.status.${item.status}`)}</Text>
            </View>
            <Text style={styles.orderTotal}>{formatLKR(item.total_amount)}</Text>
            <Text style={styles.orderDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={64} color="#2a2a4a" />
            <Text style={styles.emptyTitle}>{t('order.noOrders')}</Text>
            <Text style={styles.emptyMessage}>{t('order.noOrdersMessage')}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff', paddingHorizontal: 20, marginBottom: 16 },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 16 },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#1a1a2e' },
  activeTab: { backgroundColor: '#e94560' },
  tabText: { color: '#8b8ba7', fontWeight: '600' },
  activeTabText: { color: '#ffffff' },
  list: { paddingHorizontal: 20 },
  orderCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderNumber: { color: '#ffffff', fontWeight: '600' },
  orderStatus: { color: '#e94560', fontSize: 12, fontWeight: '600' },
  orderTotal: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  orderDate: { color: '#8b8ba7', fontSize: 12 },
  empty: { alignItems: 'center', paddingTop: 100, gap: 12 },
  emptyTitle: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
  emptyMessage: { color: '#8b8ba7', fontSize: 14 },
});
