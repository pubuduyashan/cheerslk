import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/stores/cartStore';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showCart?: boolean;
}

export function Header({ title, showBack = false, showCart = false }: HeaderProps) {
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}

      <Text style={styles.title} numberOfLines={1}>{title}</Text>

      {showCart ? (
        <TouchableOpacity onPress={() => router.push('/cart')} style={styles.iconBtn}>
          <Ionicons name="cart-outline" size={24} color="#ffffff" />
          {itemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemCount > 9 ? '9+' : itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.iconBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 52,
    paddingBottom: 12,
    backgroundColor: '#0f0f23',
  },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  title: { flex: 1, color: '#ffffff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#e94560',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: '#ffffff', fontSize: 11, fontWeight: 'bold' },
});
