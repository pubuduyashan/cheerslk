import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

interface OnlineToggleProps {
  isOnline: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function OnlineToggle({
  isOnline,
  onToggle,
  disabled,
}: OnlineToggleProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isOnline) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isOnline]);

  return (
    <View style={styles.container}>
      {isOnline && (
        <Animated.View
          style={[
            styles.pulseRing,
            { transform: [{ scale: pulseAnim }] },
          ]}
        />
      )}
      <TouchableOpacity
        style={[
          styles.button,
          isOnline ? styles.onlineButton : styles.offlineButton,
        ]}
        onPress={onToggle}
        disabled={disabled}
        activeOpacity={0.8}
      >
        <View
          style={[
            styles.dot,
            { backgroundColor: isOnline ? '#16c79a' : '#8b8ba7' },
          ]}
        />
        <Text
          style={[
            styles.label,
            { color: isOnline ? '#16c79a' : '#8b8ba7' },
          ]}
        >
          {isOnline ? 'ONLINE' : 'GO ONLINE'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
  pulseRing: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(22, 199, 154, 0.15)',
  },
  button: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  onlineButton: {
    backgroundColor: 'rgba(22, 199, 154, 0.1)',
    borderColor: '#16c79a',
  },
  offlineButton: {
    backgroundColor: 'rgba(139, 139, 167, 0.1)',
    borderColor: '#8b8ba7',
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 2,
  },
});
