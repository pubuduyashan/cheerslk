import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';

export default function VerifyAgeScreen() {
  const { t } = useTranslation();
  const { profile } = useAuthStore();

  const status = profile?.age_verification_status || 'pending';

  const statusConfig = {
    pending: { icon: 'time' as const, color: '#F59E0B', message: t('auth.ageVerificationPending') },
    approved: { icon: 'checkmark-circle' as const, color: '#10B981', message: t('auth.ageVerificationApproved') },
    rejected: { icon: 'close-circle' as const, color: '#EF4444', message: t('auth.ageVerificationRejected') },
    not_submitted: { icon: 'alert-circle' as const, color: '#8b8ba7', message: 'Please submit your NIC for verification' },
  };

  const config = statusConfig[status];

  return (
    <View style={styles.container}>
      <Ionicons name={config.icon} size={80} color={config.color} />
      <Text style={styles.title}>{t('auth.ageVerification')}</Text>
      <Text style={[styles.message, { color: config.color }]}>{config.message}</Text>

      {status === 'approved' && (
        <Button
          title={t('common.next')}
          onPress={() => router.replace('/(tabs)')}
          style={styles.button}
        />
      )}

      {status === 'rejected' && (
        <Button
          title="Resubmit"
          onPress={() => router.replace('/(auth)/register')}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  message: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  button: { marginTop: 24, width: '100%' },
});
