import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { useRiderStore } from '@/stores/riderStore';
import { createSupabaseClient, signOut } from '@cheerslk/supabase-client';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export default function ProfileScreen() {
  const { profile, reset: resetAuth } = useAuthStore();
  const { rider, reset: resetRider } = useRiderStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          const supabase = createSupabaseClient(supabaseUrl, supabaseKey);
          await signOut(supabase);
          resetAuth();
          resetRider();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Feather
          key={i}
          name="star"
          size={16}
          color={i <= Math.round(rating) ? '#16c79a' : '#2a2a3e'}
        />
      );
    }
    return stars;
  };

  const vehicleLabels: Record<string, string> = {
    motorcycle: 'Motorcycle',
    bicycle: 'Bicycle',
    three_wheeler: 'Three Wheeler',
    car: 'Car',
  };

  const verificationColors: Record<string, { bg: string; text: string }> = {
    pending: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' },
    approved: { bg: 'rgba(22, 199, 154, 0.15)', text: '#16c79a' },
    rejected: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' },
    suspended: { bg: 'rgba(139, 139, 167, 0.15)', text: '#8b8ba7' },
  };

  const verificationStatus = rider?.verification_status ?? 'pending';
  const vColors = verificationColors[verificationStatus] ?? verificationColors.pending;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        {/* Avatar & Info */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Feather name="user" size={32} color="#16c79a" />
          </View>
          <Text style={styles.name}>{profile?.full_name ?? 'Rider'}</Text>
          <Text style={styles.phone}>{profile?.phone ?? ''}</Text>
          <View style={styles.ratingRow}>
            {renderStars(rider?.rating ?? 0)}
            <Text style={styles.ratingText}>
              {rider?.rating ? rider.rating.toFixed(1) : '0.0'}
            </Text>
          </View>
          <Text style={styles.deliveryCount}>
            {rider?.total_deliveries ?? 0} deliveries completed
          </Text>
        </View>

        {/* Vehicle Info */}
        <Text style={styles.sectionTitle}>Vehicle Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Feather name="truck" size={16} color="#8b8ba7" />
            <Text style={styles.infoLabel}>Vehicle Type</Text>
            <Text style={styles.infoValue}>
              {rider ? vehicleLabels[rider.vehicle_type] : '--'}
            </Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Feather name="hash" size={16} color="#8b8ba7" />
            <Text style={styles.infoLabel}>Number Plate</Text>
            <Text style={styles.infoValue}>
              {rider?.vehicle_number ?? '--'}
            </Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <Feather name="credit-card" size={16} color="#8b8ba7" />
            <Text style={styles.infoLabel}>License</Text>
            <Text style={styles.infoValue}>
              {rider?.license_number ?? '--'}
            </Text>
          </View>
        </View>

        {/* Documents */}
        <Text style={styles.sectionTitle}>Documents</Text>
        <View style={styles.infoCard}>
          <View style={styles.docRow}>
            <View style={styles.docInfo}>
              <Feather name="file-text" size={16} color="#8b8ba7" />
              <Text style={styles.docLabel}>Verification Status</Text>
            </View>
            <View
              style={[styles.verBadge, { backgroundColor: vColors.bg }]}
            >
              <Text style={[styles.verText, { color: vColors.text }]}>
                {verificationStatus.charAt(0).toUpperCase() +
                  verificationStatus.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.docRow}>
            <View style={styles.docInfo}>
              <Feather name="image" size={16} color="#8b8ba7" />
              <Text style={styles.docLabel}>License Photo</Text>
            </View>
            <Feather
              name={rider?.license_image ? 'check-circle' : 'x-circle'}
              size={16}
              color={rider?.license_image ? '#16c79a' : '#8b8ba7'}
            />
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.docRow}>
            <View style={styles.docInfo}>
              <Feather name="image" size={16} color="#8b8ba7" />
              <Text style={styles.docLabel}>NIC Photos</Text>
            </View>
            <Feather
              name={
                rider?.nic_front_image && rider?.nic_back_image
                  ? 'check-circle'
                  : 'x-circle'
              }
              size={16}
              color={
                rider?.nic_front_image && rider?.nic_back_image
                  ? '#16c79a'
                  : '#8b8ba7'
              }
            />
          </View>
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.infoCard}>
          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
            <View style={styles.settingsLeft}>
              <Feather name="globe" size={16} color="#8b8ba7" />
              <Text style={styles.settingsLabel}>Language</Text>
            </View>
            <View style={styles.settingsRight}>
              <Text style={styles.settingsValue}>English</Text>
              <Feather name="chevron-right" size={16} color="#8b8ba7" />
            </View>
          </TouchableOpacity>
          <View style={styles.infoDivider} />
          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
            <View style={styles.settingsLeft}>
              <Feather name="bell" size={16} color="#8b8ba7" />
              <Text style={styles.settingsLabel}>Notifications</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#8b8ba7" />
          </TouchableOpacity>
          <View style={styles.infoDivider} />
          <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
            <View style={styles.settingsLeft}>
              <Feather name="help-circle" size={16} color="#8b8ba7" />
              <Text style={styles.settingsLabel}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#8b8ba7" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={18} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    paddingTop: 8,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
    marginBottom: 24,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(22, 199, 154, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  phone: {
    color: '#8b8ba7',
    fontSize: 14,
    marginBottom: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  ratingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  deliveryCount: {
    color: '#8b8ba7',
    fontSize: 13,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  infoLabel: {
    color: '#8b8ba7',
    fontSize: 14,
    flex: 1,
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#2a2a3e',
    marginHorizontal: 14,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  docInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  docLabel: {
    color: '#8b8ba7',
    fontSize: 14,
  },
  verBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  verText: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  settingsLabel: {
    color: '#ffffff',
    fontSize: 14,
  },
  settingsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingsValue: {
    color: '#8b8ba7',
    fontSize: 13,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginTop: 4,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 15,
    fontWeight: '600',
  },
});
