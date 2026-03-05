import { View, ActivityIndicator, StyleSheet } from 'react-native';

export function LoadingSpinner() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#e94560" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f0f23' },
});
