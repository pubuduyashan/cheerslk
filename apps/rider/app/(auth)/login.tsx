import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { createSupabaseClient, signInWithOTP, verifyOTP } from '@cheerslk/supabase-client';
import { APP_CONFIG } from '@cheerslk/shared-constants';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const { setSession, setProfile } = useAuthStore();

  const fullPhone = `${APP_CONFIG.countryCode}${phone.replace(/^0/, '')}`;

  const handleSendOTP = async () => {
    if (phone.length < 9) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    setLoading(true);
    const { error } = await signInWithOTP(supabase, fullPhone);
    setLoading(false);
    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setStep('otp');
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== APP_CONFIG.otpLength) {
      Alert.alert('Error', `Please enter the ${APP_CONFIG.otpLength}-digit code`);
      return;
    }
    setLoading(true);
    const { data, error } = await verifyOTP(supabase, fullPhone, otp);
    if (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
      return;
    }
    if (data.session) {
      setSession(data.session);
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();

      setLoading(false);
      if (profile && profile.role === 'rider') {
        setProfile(profile);
        router.replace('/(tabs)');
      } else if (!profile) {
        router.replace('/(auth)/register');
      } else {
        Alert.alert('Error', 'This account is not registered as a rider.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather name="truck" size={40} color="#16c79a" />
          </View>
          <Text style={styles.title}>CheersLK Rider</Text>
          <Text style={styles.subtitle}>
            {step === 'phone'
              ? 'Enter your phone number to get started'
              : 'Enter the verification code sent to your phone'}
          </Text>
        </View>

        {step === 'phone' ? (
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.countryCode}>{APP_CONFIG.countryCode}</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="#8b8ba7"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={10}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <TouchableOpacity
              onPress={() => setStep('phone')}
              style={styles.backButton}
            >
              <Feather name="arrow-left" size={16} color="#16c79a" />
              <Text style={styles.backText}>{fullPhone}</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              placeholderTextColor="#8b8ba7"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={APP_CONFIG.otpLength}
              textAlign="center"
            />
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerifyOTP}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Verify</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(22, 199, 154, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8b8ba7',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  countryCode: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
    borderRightWidth: 1,
    borderRightColor: '#2a2a3e',
    paddingRight: 12,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  otpInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    height: 56,
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 8,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  button: {
    backgroundColor: '#16c79a',
    borderRadius: 12,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backText: {
    color: '#16c79a',
    fontSize: 14,
  },
});
