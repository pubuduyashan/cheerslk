import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { validateNIC, isOver21 } from '@cheerslk/shared-utils';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuthStore();
  const [fullName, setFullName] = useState('');
  const [nicNumber, setNicNumber] = useState('');
  const [nicFrontImage, setNicFrontImage] = useState<string | null>(null);
  const [nicBackImage, setNicBackImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pickImage = async (side: 'front' | 'back') => {
    const result = await ImagePicker.launchImagePickerAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 10],
      quality: 0.8,
    });

    if (!result.canceled) {
      if (side === 'front') setNicFrontImage(result.assets[0].uri);
      else setNicBackImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    const nicInfo = validateNIC(nicNumber);
    if (!nicInfo.valid) {
      setError(t('auth.invalidNIC'));
      return;
    }

    if (!isOver21(nicNumber)) {
      setError(t('auth.mustBe21'));
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        full_name: fullName.trim(),
        nic_number: nicNumber.trim(),
        date_of_birth: nicInfo.dateOfBirth?.toISOString(),
        age_verification_status: 'pending',
      });

      // TODO: Upload NIC images to Supabase Storage

      router.replace('/(auth)/verify-age');
    } catch (err) {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('auth.createAccount')}</Text>

      <View style={styles.form}>
        <Input
          label={t('auth.fullName')}
          placeholder={t('auth.fullNamePlaceholder')}
          value={fullName}
          onChangeText={setFullName}
        />

        <Input
          label={t('auth.nicNumber')}
          placeholder={t('auth.nicPlaceholder')}
          value={nicNumber}
          onChangeText={setNicNumber}
          autoCapitalize="characters"
        />

        <View style={styles.imageSection}>
          <Text style={styles.label}>{t('auth.nicFrontPhoto')}</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('front')}>
            {nicFrontImage ? (
              <Image source={{ uri: nicFrontImage }} style={styles.pickedImage} />
            ) : (
              <Text style={styles.imagePickerText}>{t('auth.uploadPhoto')}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.imageSection}>
          <Text style={styles.label}>{t('auth.nicBackPhoto')}</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('back')}>
            {nicBackImage ? (
              <Image source={{ uri: nicBackImage }} style={styles.pickedImage} />
            ) : (
              <Text style={styles.imagePickerText}>{t('auth.uploadPhoto')}</Text>
            )}
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          title={t('common.submit')}
          onPress={handleRegister}
          loading={loading}
          disabled={!fullName || !nicNumber}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 24, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 32 },
  form: { gap: 20 },
  label: { color: '#ffffff', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  imageSection: { gap: 8 },
  imagePicker: {
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2a2a4a',
    borderStyle: 'dashed',
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePickerText: { color: '#8b8ba7', fontSize: 16 },
  pickedImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  error: { color: '#e94560', fontSize: 14 },
});
