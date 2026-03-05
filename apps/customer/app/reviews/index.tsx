import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';

function StarRating({ rating, onRate, label }: { rating: number; onRate: (n: number) => void; label: string }) {
  return (
    <View style={styles.ratingSection}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onRate(star)}>
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={36}
              color={star <= rating ? '#F59E0B' : '#2a2a4a'}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function ReviewScreen() {
  const { t } = useTranslation();
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [riderRating, setRiderRating] = useState(0);
  const [productRating, setProductRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // TODO: Submit review to Supabase
      router.back();
    } catch (err) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = deliveryRating > 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: t('review.title') }} />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>{t('review.howWasYourExperience')}</Text>
        <Text style={styles.subtitle}>{t('review.yourFeedbackHelps')}</Text>

        <StarRating
          rating={deliveryRating}
          onRate={setDeliveryRating}
          label={t('review.deliveryExperience')}
        />
        <StarRating
          rating={riderRating}
          onRate={setRiderRating}
          label={t('review.riderService')}
        />
        <StarRating
          rating={productRating}
          onRate={setProductRating}
          label={t('review.productQuality')}
        />

        <View style={styles.commentSection}>
          <Text style={styles.ratingLabel}>{t('review.additionalComments')}</Text>
          <TextInput
            style={styles.commentInput}
            placeholder={t('review.commentPlaceholder')}
            placeholderTextColor="#4a4a6a"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title={t('review.submit')}
          onPress={handleSubmit}
          loading={loading}
          disabled={!canSubmit}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f0f23' },
  content: { padding: 24, gap: 24 },
  heading: { color: '#ffffff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#8b8ba7', fontSize: 14, marginTop: -12 },
  ratingSection: { gap: 8 },
  ratingLabel: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  starsRow: { flexDirection: 'row', gap: 8 },
  commentSection: { gap: 8 },
  commentInput: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    minHeight: 120,
  },
  bottomBar: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#1a1a2e',
    borderTopWidth: 1,
    borderTopColor: '#2a2a4a',
  },
});
