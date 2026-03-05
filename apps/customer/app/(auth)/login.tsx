import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { validateSLPhone, formatSLPhone } from '@cheerslk/shared-utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async () => {
    setError('');
    if (!validateSLPhone(phone)) {
      setError(t('auth.invalidPhone'));
      return;
    }

    setLoading(true);
    try {
      const formatted = formatSLPhone(phone);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/send-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: formatted }),
        }
      );

      if (!response.ok) throw new Error('Failed to send OTP');

      router.push({ pathname: '/(auth)/verify-otp', params: { phone: formatted } });
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>CheersLK</Text>
        <Text style={styles.tagline}>Liquor & Essentials, Delivered</Text>

        <View style={styles.form}>
          <Text style={styles.label}>{t('auth.phone')}</Text>
          <View style={styles.phoneRow}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+94</Text>
            </View>
            <Input
              placeholder={t('auth.phonePlaceholder')}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.phoneInput}
            />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Button
            title={t('auth.sendOTP')}
            onPress={handleSendOTP}
            loading={loading}
            disabled={!phone}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#e94560',
    textAlign: 'center',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#8b8ba7',
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
  label: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 8,
  },
  countryCode: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  countryCodeText: {
    color: '#ffffff',
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
  },
  error: {
    color: '#e94560',
    fontSize: 14,
  },
});
