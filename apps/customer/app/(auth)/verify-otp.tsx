import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';

export default function VerifyOTPScreen() {
  const { t } = useTranslation();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { login } = useAuthStore();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    if (newOtp.every((d) => d !== '')) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/verify-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, code }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Verification failed');

      await login(data.session);

      if (data.isNewUser) {
        router.replace('/(auth)/register');
      } else if (!data.ageVerified) {
        router.replace('/(auth)/verify-age');
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      setError(err.message || t('auth.invalidOTP'));
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    try {
      await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/send-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        }
      );
    } catch {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('auth.verifyOTP')}</Text>
      <Text style={styles.subtitle}>
        {t('auth.enterOTP')} {phone}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputs.current[index] = ref; }}
            style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
          />
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading && <Text style={styles.verifying}>Verifying...</Text>}

      <Button
        title={resendTimer > 0 ? t('auth.resendIn', { seconds: resendTimer }) : t('auth.resendOTP')}
        onPress={handleResend}
        variant="ghost"
        disabled={resendTimer > 0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8b8ba7',
    textAlign: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2a2a4a',
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  otpInputFilled: {
    borderColor: '#e94560',
  },
  error: {
    color: '#e94560',
    textAlign: 'center',
    marginBottom: 16,
  },
  verifying: {
    color: '#8b8ba7',
    textAlign: 'center',
    marginBottom: 16,
  },
});
