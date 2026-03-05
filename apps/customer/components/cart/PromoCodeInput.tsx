import { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export function PromoCodeInput() {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError('');

    try {
      // TODO: Validate promo code via Supabase
      setApplied(true);
    } catch (err) {
      setError(t('promo.invalid'));
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setCode('');
    setApplied(false);
    setError('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Ionicons name="pricetag" size={20} color="#8b8ba7" />
        <TextInput
          style={styles.input}
          placeholder={t('promo.enterCode')}
          placeholderTextColor="#4a4a6a"
          value={code}
          onChangeText={setCode}
          autoCapitalize="characters"
          editable={!applied}
        />
        {applied ? (
          <TouchableOpacity onPress={handleRemove} style={styles.removeBtn}>
            <Ionicons name="close-circle" size={22} color="#EF4444" />
          </TouchableOpacity>
        ) : loading ? (
          <ActivityIndicator size="small" color="#e94560" />
        ) : (
          <TouchableOpacity onPress={handleApply} disabled={!code.trim()}>
            <Text style={[styles.applyText, !code.trim() && styles.applyDisabled]}>
              {t('promo.apply')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {applied && (
        <View style={styles.successRow}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
          <Text style={styles.successText}>{t('promo.applied')}</Text>
        </View>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  input: { flex: 1, color: '#ffffff', fontSize: 15 },
  applyText: { color: '#e94560', fontSize: 14, fontWeight: '700' },
  applyDisabled: { opacity: 0.4 },
  removeBtn: { padding: 2 },
  successRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 4 },
  successText: { color: '#10B981', fontSize: 13 },
  errorText: { color: '#EF4444', fontSize: 13, paddingLeft: 4 },
});
