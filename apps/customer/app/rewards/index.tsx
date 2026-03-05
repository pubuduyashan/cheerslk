import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { formatLKR } from '@cheerslk/shared-utils';
import type { LoyaltyAccount, LoyaltyTransaction, LoyaltyTier } from '@cheerslk/shared-types';
import { TIER_THRESHOLDS } from '@cheerslk/shared-types';

const tierColors: Record<LoyaltyTier, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
};

const tierIcons: Record<LoyaltyTier, string> = {
  bronze: 'medal-outline',
  silver: 'medal-outline',
  gold: 'medal',
  platinum: 'diamond',
};

export default function RewardsScreen() {
  const { t } = useTranslation();
  const [account, setAccount] = useState<LoyaltyAccount | null>(null);
  const [transactions, setTransactions] = useState<LoyaltyTransaction[]>([]);

  useEffect(() => {
    // TODO: Fetch loyalty data from Supabase
  }, []);

  const currentTier: LoyaltyTier = account?.tier || 'bronze';
  const pointsBalance = account?.points_balance || 0;
  const lifetimePoints = account?.lifetime_points || 0;

  const nextTier = currentTier === 'bronze' ? 'silver' : currentTier === 'silver' ? 'gold' : currentTier === 'gold' ? 'platinum' : null;
  const nextTierThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : 0;
  const progress = nextTier ? Math.min(lifetimePoints / nextTierThreshold, 1) : 1;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t('rewards.title') }} />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Points Card */}
        <View style={[styles.pointsCard, { borderColor: tierColors[currentTier] }]}>
          <View style={styles.tierRow}>
            <Ionicons name={tierIcons[currentTier] as any} size={28} color={tierColors[currentTier]} />
            <Text style={[styles.tierName, { color: tierColors[currentTier] }]}>
              {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} {t('rewards.tier')}
            </Text>
          </View>

          <Text style={styles.pointsBalance}>{pointsBalance.toLocaleString()}</Text>
          <Text style={styles.pointsLabel}>{t('rewards.availablePoints')}</Text>

          <View style={styles.valueRow}>
            <Ionicons name="wallet" size={16} color="#8b8ba7" />
            <Text style={styles.valueText}>
              {t('rewards.value')}: {formatLKR(pointsBalance * 0.1)}
            </Text>
          </View>
        </View>

        {/* Progress to Next Tier */}
        {nextTier && (
          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>
              {t('rewards.progressTo')} {nextTier.charAt(0).toUpperCase() + nextTier.slice(1)}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: tierColors[nextTier] }]} />
            </View>
            <Text style={styles.progressText}>
              {lifetimePoints.toLocaleString()} / {nextTierThreshold.toLocaleString()} {t('rewards.points')}
            </Text>
          </View>
        )}

        {/* How to Earn */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('rewards.howToEarn')}</Text>
          <View style={styles.earnCard}>
            <View style={styles.earnRow}>
              <Ionicons name="cart" size={20} color="#e94560" />
              <Text style={styles.earnText}>{t('rewards.earnPerOrder')}</Text>
            </View>
            <View style={styles.earnRow}>
              <Ionicons name="star" size={20} color="#F59E0B" />
              <Text style={styles.earnText}>{t('rewards.bonusOnReview')}</Text>
            </View>
            <View style={styles.earnRow}>
              <Ionicons name="people" size={20} color="#10B981" />
              <Text style={styles.earnText}>{t('rewards.referralBonus')}</Text>
            </View>
          </View>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('rewards.history')}</Text>
          {transactions.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons name="time-outline" size={40} color="#2a2a4a" />
              <Text style={styles.emptyText}>{t('rewards.noHistory')}</Text>
            </View>
          ) : (
            transactions.map((tx) => (
              <View key={tx.id} style={styles.transactionRow}>
                <View style={styles.txIcon}>
                  <Ionicons
                    name={tx.type === 'earned' || tx.type === 'bonus' ? 'add-circle' : 'remove-circle'}
                    size={24}
                    color={tx.type === 'earned' || tx.type === 'bonus' ? '#10B981' : '#EF4444'}
                  />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txDescription}>{tx.description}</Text>
                  <Text style={styles.txDate}>
                    {new Date(tx.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.txPoints, {
                  color: tx.type === 'earned' || tx.type === 'bonus' ? '#10B981' : '#EF4444'
                }]}>
                  {tx.type === 'earned' || tx.type === 'bonus' ? '+' : '-'}{tx.points}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 16, paddingBottom: 32 },
  pointsCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 20,
    gap: 8,
  },
  tierRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  tierName: { fontSize: 18, fontWeight: 'bold' },
  pointsBalance: { color: '#ffffff', fontSize: 48, fontWeight: 'bold' },
  pointsLabel: { color: '#8b8ba7', fontSize: 14 },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  valueText: { color: '#8b8ba7', fontSize: 14 },
  progressSection: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    gap: 8,
  },
  progressTitle: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  progressBar: {
    height: 8,
    backgroundColor: '#2a2a4a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  progressText: { color: '#8b8ba7', fontSize: 12, textAlign: 'right' },
  section: { marginBottom: 24 },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  earnCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  earnRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  earnText: { color: '#8b8ba7', fontSize: 14, flex: 1 },
  emptyHistory: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyText: { color: '#8b8ba7', fontSize: 14 },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
    gap: 12,
  },
  txIcon: {},
  txInfo: { flex: 1 },
  txDescription: { color: '#ffffff', fontSize: 14 },
  txDate: { color: '#8b8ba7', fontSize: 12 },
  txPoints: { fontSize: 16, fontWeight: 'bold' },
});
