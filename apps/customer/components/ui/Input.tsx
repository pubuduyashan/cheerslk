import { View, TextInput, Text, StyleSheet, TextInputProps, ViewStyle } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  style?: ViewStyle;
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor="#4a4a6a"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { color: '#ffffff', fontSize: 14, fontWeight: '600' },
  input: {
    height: 52,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 16,
    color: '#ffffff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  inputError: { borderColor: '#e94560' },
  error: { color: '#e94560', fontSize: 12 },
});
