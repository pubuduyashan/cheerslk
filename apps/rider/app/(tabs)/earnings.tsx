import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRiderStore } from '@/stores/riderStore';
import { APP_CONFIG } from '@cheerslk/shared-constants';

type Period = 'today' | 'week' | 'month';

const PERIODS: { key: Period; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
];

// Mock data for demonstration
const MOCK_EARNINGS: Record<Period, { total: number; deliveries: number; commission: number; tips: number }> = {
  today: { total: 3250, deliveries: 8, commission: 2600, tips: 650 },
  week: { total: 22450, deliveries: 54, commission: 17960, tips: 4490 },
  month: { total: 87200, deliveries: 215, commission: 69760, tips: 17440 },
};

const MOCK_TRANSACTIONS = [
  { id: '1', orderNumber: 'CLK-2401', amount: 420, type: 'delivery', time: '2:30 PM' },
  { id: '2', orderNumber: 'CLK-2398', amount: 380, type: 'delivery', time: '1:15 PM' },
  { id: '3', orderNumber: 'CLK-2395', amount: 50, type: 'tip', time: '12:45 PM' },
  { id: '4', orderNumber: 'CLK-2390', amount: 450, type: 'delivery', time: '11:30 AM' },
  { id: '5', orderNumber: 'CLK-2388', amount: 100, type: 'tip', time: '11:00 AM' },
  { id: '6', orderNumber: 'CLK-2385', amount: 350, type: 'delivery', time: '10:20 AM' },
];

const CHART_BARS = [0.3, 0.5, 0.7, 0.4, 0.9, 0.6, 0.8];
const CHART_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function EarningsScreen() {
  const [period, setPeriod] = useState<Period>('today');
  const earnings = MOCK_EARNINGS[period];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Earnings</Text>

        {/* Period Tabs */}
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <TouchableOpacity
              key={p.key}
              style={[
                styles.periodTab,
                period === p.key && styles.periodTabActive,
              ]}
              onPress={() => setPeriod(p.key)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.periodText,
                  period === p.key && styles.periodTextActive,
                ]}
              >
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Total Earnings Card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Earnings</Text>
          <Text style={styles.totalAmount}>
            {APP_CONFIG.currencySymbol} {earnings.total.toLocaleString()}
          </Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Feather name="package" size={18} color="#16c79a" />
            <Text style={styles.statValue}>{earnings.deliveries}</Text>
            <Text style={styles.statLabel}>Deliveries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="trending-up" size={18} color="#16c79a" />
            <Text style={styles.statValue}>
              {APP_CONFIG.currencySymbol} {earnings.commission.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Commission</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Feather name="heart" size={18} color="#16c79a" />
            <Text style={styles.statValue}>
              {APP_CONFIG.currencySymbol} {earnings.tips.toLocaleString()}
            </Text>
            <Text style={styles.statLabel}>Tips</Text>
          </View>
        </View>

        {/* Chart */}
        {period === 'week' && (
          <View style={styles.chartSection}>
            <Text style={styles.sectionTitle}>Weekly Overview</Text>
            <View style={styles.chartContainer}>
              {CHART_BARS.map((value, index) => (
                <View key={index} style={styles.chartColumn}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        { height: `${value * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.chartLabel}>{CHART_LABELS[index]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Transactions */}
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {MOCK_TRANSACTIONS.map((tx) => (
          <View key={tx.id} style={styles.txRow}>
            <View style={styles.txIconWrapper}>
              <Feather
                name={tx.type === 'tip' ? 'heart' : 'package'}
                size={16}
                color={tx.type === 'tip' ? '#e94560' : '#16c79a'}
              />
            </View>
            <View style={styles.txInfo}>
              <Text style={styles.txOrder}>#{tx.orderNumber}</Text>
              <Text style={styles.txTime}>{tx.time}</Text>
            </View>
            <Text style={styles.txAmount}>
              +{APP_CONFIG.currencySymbol} {tx.amount}
            </Text>
          </View>
        ))}
      </ScrollView>
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
    paddingBottom: 30,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    paddingTop: 8,
    marginBottom: 16,
  },
  periodRow: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  periodTabActive: {
    backgroundColor: '#16c79a',
  },
  periodText: {
    color: '#8b8ba7',
    fontSize: 13,
    fontWeight: '600',
  },
  periodTextActive: {
    color: '#ffffff',
  },
  totalCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#16c79a',
    marginBottom: 16,
  },
  totalLabel: {
    color: '#8b8ba7',
    fontSize: 14,
    marginBottom: 4,
  },
  totalAmount: {
    color: '#16c79a',
    fontSize: 36,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#2a2a3e',
  },
  statValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  statLabel: {
    color: '#8b8ba7',
    fontSize: 11,
    marginTop: 2,
  },
  chartSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
  },
  chartContainer: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    height: 160,
    alignItems: 'flex-end',
    gap: 8,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: '#16c79a',
    borderRadius: 4,
    width: '100%',
    minHeight: 4,
  },
  chartLabel: {
    color: '#8b8ba7',
    fontSize: 10,
    marginTop: 6,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  txIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0f0f23',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txOrder: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  txTime: {
    color: '#8b8ba7',
    fontSize: 12,
    marginTop: 1,
  },
  txAmount: {
    color: '#16c79a',
    fontSize: 15,
    fontWeight: '700',
  },
});
