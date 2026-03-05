import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { formatLKR } from '@cheerslk/shared-utils';

interface CartSummaryProps {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

export function CartSummary({ subtotal, deliveryFee, discount, total }: CartSummaryProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>{t('cart.subtotal')}</Text>
        <Text style={styles.value}>{formatLKR(subtotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>{t('cart.deliveryFee')}</Text>
        <Text style={styles.value}>{formatLKR(deliveryFee)}</Text>
      </View>
      {discount > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>{t('cart.discount')}</Text>
          <Text style={[styles.value, styles.discountValue]}>-{formatLKR(discount)}</Text>
        </View>
      )}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>{t('cart.total')}</Text>
        <Text style={styles.totalValue}>{formatLKR(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    gap: 10,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: '#8b8ba7', fontSize: 14 },
  value: { color: '#ffffff', fontSize: 14 },
  discountValue: { color: '#10B981' },
  totalRow: { borderTopWidth: 1, borderTopColor: '#2a2a4a', paddingTop: 10, marginTop: 4 },
  totalLabel: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  totalValue: { color: '#e94560', fontSize: 18, fontWeight: 'bold' },
});
