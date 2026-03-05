import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '@/stores/authStore';
import { createSupabaseClient } from '@cheerslk/supabase-client';
import { VehicleType } from '@cheerslk/shared-types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

const VEHICLE_OPTIONS: { type: VehicleType; label: string; icon: string }[] = [
  { type: 'motorcycle', label: 'Motorcycle', icon: 'zap' },
  { type: 'bicycle', label: 'Bicycle', icon: 'activity' },
  { type: 'three_wheeler', label: 'Three Wheeler', icon: 'triangle' },
  { type: 'car', label: 'Car', icon: 'truck' },
];

export default function RegisterScreen() {
  const { session, setProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('motorcycle');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseImage, setLicenseImage] = useState<string | null>(null);
  const [nicFront, setNicFront] = useState<string | null>(null);
  const [nicBack, setNicBack] = useState<string | null>(null);

  const phone = session?.user?.phone ?? '';

  const pickImage = async (
    setter: (uri: string | null) => void
  ) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
    });
    if (!result.canceled && result.assets[0]) {
      setter(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    if (!vehicleNumber.trim()) {
      Alert.alert('Error', 'Please enter your vehicle number');
      return;
    }
    if (!licenseNumber.trim()) {
      Alert.alert('Error', 'Please enter your license number');
      return;
    }

    setLoading(true);

    const userId = session?.user?.id;
    if (!userId) {
      setLoading(false);
      Alert.alert('Error', 'Session expired. Please log in again.');
      return;
    }

    // Create profile
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      full_name: fullName,
      phone,
      role: 'rider',
      preferred_language: 'en',
      age_verified: false,
      age_verification_status: 'not_submitted',
    });

    if (profileError) {
      setLoading(false);
      Alert.alert('Error', profileError.message);
      return;
    }

    // Create rider record
    const { error: riderError } = await supabase.from('riders').insert({
      profile_id: userId,
      vehicle_type: vehicleType,
      vehicle_number: vehicleNumber,
      license_number: licenseNumber,
      status: 'offline',
      verification_status: 'pending',
      rating: 0,
      total_deliveries: 0,
      commission_rate: 0.2,
      is_active: false,
    });

    if (riderError) {
      setLoading(false);
      Alert.alert('Error', riderError.message);
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    setLoading(false);
    setProfile(profile);
    Alert.alert(
      'Application Submitted',
      'Your rider application has been submitted for review. You will be notified once approved.',
      [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => router.back()}
        >
          <Feather name="arrow-left" size={24} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.title}>Rider Registration</Text>
        <Text style={styles.subtitle}>
          Fill in your details to apply as a CheersLK rider
        </Text>

        {/* Full Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#8b8ba7"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Phone (pre-filled) */}
        <View style={styles.field}>
          <Text style={styles.label}>Phone Number</Text>
          <View style={[styles.input, styles.disabledInput]}>
            <Text style={styles.disabledText}>{phone || 'Not available'}</Text>
          </View>
        </View>

        {/* Vehicle Type */}
        <View style={styles.field}>
          <Text style={styles.label}>Vehicle Type</Text>
          <View style={styles.vehicleGrid}>
            {VEHICLE_OPTIONS.map((v) => (
              <TouchableOpacity
                key={v.type}
                style={[
                  styles.vehicleOption,
                  vehicleType === v.type && styles.vehicleOptionActive,
                ]}
                onPress={() => setVehicleType(v.type)}
                activeOpacity={0.7}
              >
                <Feather
                  name={v.icon as any}
                  size={22}
                  color={vehicleType === v.type ? '#16c79a' : '#8b8ba7'}
                />
                <Text
                  style={[
                    styles.vehicleLabel,
                    vehicleType === v.type && styles.vehicleLabelActive,
                  ]}
                >
                  {v.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Vehicle Number */}
        <View style={styles.field}>
          <Text style={styles.label}>Vehicle Number Plate</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. WP AB-1234"
            placeholderTextColor="#8b8ba7"
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
            autoCapitalize="characters"
          />
        </View>

        {/* License Number */}
        <View style={styles.field}>
          <Text style={styles.label}>Driving License Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter license number"
            placeholderTextColor="#8b8ba7"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            autoCapitalize="characters"
          />
        </View>

        {/* Document Uploads */}
        <View style={styles.field}>
          <Text style={styles.label}>Documents</Text>
          <View style={styles.uploadGrid}>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => pickImage(setLicenseImage)}
              activeOpacity={0.7}
            >
              <Feather
                name={licenseImage ? 'check-circle' : 'camera'}
                size={24}
                color={licenseImage ? '#16c79a' : '#8b8ba7'}
              />
              <Text style={styles.uploadLabel}>License Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => pickImage(setNicFront)}
              activeOpacity={0.7}
            >
              <Feather
                name={nicFront ? 'check-circle' : 'camera'}
                size={24}
                color={nicFront ? '#16c79a' : '#8b8ba7'}
              />
              <Text style={styles.uploadLabel}>NIC Front</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => pickImage(setNicBack)}
              activeOpacity={0.7}
            >
              <Feather
                name={nicBack ? 'check-circle' : 'camera'}
                size={24}
                color={nicBack ? '#16c79a' : '#8b8ba7'}
              />
              <Text style={styles.uploadLabel}>NIC Back</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <Feather name="send" size={18} color="#ffffff" />
              <Text style={styles.submitText}>Submit Application</Text>
            </>
          )}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backArrow: {
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#8b8ba7',
    fontSize: 14,
    marginBottom: 28,
    lineHeight: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    justifyContent: 'center',
  },
  disabledInput: {
    opacity: 0.6,
  },
  disabledText: {
    color: '#8b8ba7',
    fontSize: 15,
  },
  vehicleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  vehicleOption: {
    width: '48%',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2a2a3e',
    flexGrow: 1,
    flexBasis: '45%',
  },
  vehicleOptionActive: {
    borderColor: '#16c79a',
    backgroundColor: 'rgba(22, 199, 154, 0.08)',
  },
  vehicleLabel: {
    color: '#8b8ba7',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 6,
  },
  vehicleLabelActive: {
    color: '#16c79a',
  },
  uploadGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  uploadBox: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
    borderStyle: 'dashed',
  },
  uploadLabel: {
    color: '#8b8ba7',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#16c79a',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
