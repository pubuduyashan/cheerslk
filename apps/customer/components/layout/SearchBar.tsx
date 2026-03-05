import { View, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps extends TextInputProps {
  onPress?: () => void;
}

export function SearchBar({ onPress, ...props }: SearchBarProps) {
  if (onPress) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <Ionicons name="search" size={20} color="#8b8ba7" />
        <TextInput
          style={styles.input}
          pointerEvents="none"
          placeholderTextColor="#4a4a6a"
          {...props}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#8b8ba7" />
      <TextInput
        style={styles.input}
        placeholderTextColor="#4a4a6a"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  input: { flex: 1, color: '#ffffff', fontSize: 16 },
});
