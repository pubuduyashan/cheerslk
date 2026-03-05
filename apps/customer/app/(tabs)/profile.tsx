import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';

const menuItems = [
  { icon: 'location' as const, labelKey: 'profile.myAddresses', route: '/address' },
  { icon: 'star' as const, labelKey: 'rewards.title', route: '/rewards' },
  { icon: 'language' as const, labelKey: 'profile.language', route: '/settings/language' },
  { icon: 'notifications' as const, labelKey: 'profile.notifications', route: '/notifications' },
  { icon: 'help-circle' as const, labelKey: 'profile.helpSupport', route: '/support' },
  { icon: 'document-text' as const, labelKey: 'profile.termsConditions', route: '/terms' },
  { icon: 'shield' as const, labelKey: 'profile.privacyPolicy', route: '/privacy' },
  { icon: 'information-circle' as const, labelKey: 'profile.about', route: '/about' },
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { profile, logout } = useAuthStore();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {profile?.full_name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{profile?.full_name || 'Guest'}</Text>
        <Text style={styles.phone}>{profile?.phone}</Text>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.labelKey} style={styles.menuItem}>
            <Ionicons name={item.icon} size={22} color="#8b8ba7" />
            <Text style={styles.menuLabel}>{t(item.labelKey)}</Text>
            <Ionicons name="chevron-forward" size={20} color="#2a2a4a" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out" size={22} color="#e94560" />
        <Text style={styles.logoutText}>{t('auth.logout')}</Text>
      </TouchableOpacity>

      <Text style={styles.version}>{t('profile.version', { version: '1.0.0' })}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  header: { alignItems: 'center', paddingTop: 60, paddingBottom: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e94560',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#ffffff', fontSize: 32, fontWeight: 'bold' },
  name: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  phone: { color: '#8b8ba7', fontSize: 14 },
  menu: { paddingHorizontal: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
    gap: 12,
  },
  menuLabel: { flex: 1, color: '#ffffff', fontSize: 16 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#1a1a2e',
  },
  logoutText: { color: '#e94560', fontSize: 16, fontWeight: '600' },
  version: { color: '#8b8ba7', fontSize: 12, textAlign: 'center', marginTop: 24, marginBottom: 40 },
});
