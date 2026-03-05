import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import type { Category } from '@cheerslk/shared-types';

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export function CategoryCard({ category, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: category.image_url || 'https://placehold.co/80x80/1a1a2e/8b8ba7?text=' + category.name_en }}
        style={styles.image}
        contentFit="cover"
      />
      <Text style={styles.name} numberOfLines={1}>{category.name_en}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 80, alignItems: 'center', gap: 8 },
  image: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#1a1a2e' },
  name: { color: '#ffffff', fontSize: 12, textAlign: 'center' },
});
