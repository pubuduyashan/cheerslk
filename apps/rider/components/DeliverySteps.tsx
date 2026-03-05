import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const STEPS = [
  { label: 'Navigate to Store', icon: 'navigation' as const },
  { label: 'Confirm Pickup', icon: 'package' as const },
  { label: 'Navigate to Customer', icon: 'map-pin' as const },
  { label: 'Verify Age', icon: 'user-check' as const },
  { label: 'Confirm Delivery', icon: 'check-circle' as const },
];

interface DeliveryStepsProps {
  currentStep: number;
}

export function DeliverySteps({ currentStep }: DeliveryStepsProps) {
  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isUpcoming = stepNumber > currentStep;

        return (
          <View key={index} style={styles.stepRow}>
            <View style={styles.stepIndicator}>
              <View
                style={[
                  styles.circle,
                  isCompleted && styles.completedCircle,
                  isCurrent && styles.currentCircle,
                  isUpcoming && styles.upcomingCircle,
                ]}
              >
                {isCompleted ? (
                  <Feather name="check" size={14} color="#ffffff" />
                ) : (
                  <Feather
                    name={step.icon}
                    size={14}
                    color={isCurrent ? '#ffffff' : '#8b8ba7'}
                  />
                )}
              </View>
              {index < STEPS.length - 1 && (
                <View
                  style={[
                    styles.line,
                    isCompleted && styles.completedLine,
                  ]}
                />
              )}
            </View>
            <Text
              style={[
                styles.label,
                isCurrent && styles.currentLabel,
                isUpcoming && styles.upcomingLabel,
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIndicator: {
    alignItems: 'center',
    marginRight: 12,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedCircle: {
    backgroundColor: '#16c79a',
  },
  currentCircle: {
    backgroundColor: '#16c79a',
    borderWidth: 2,
    borderColor: 'rgba(22, 199, 154, 0.4)',
  },
  upcomingCircle: {
    backgroundColor: '#2a2a3e',
  },
  line: {
    width: 2,
    height: 24,
    backgroundColor: '#2a2a3e',
  },
  completedLine: {
    backgroundColor: '#16c79a',
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 6,
  },
  currentLabel: {
    color: '#16c79a',
    fontWeight: '700',
  },
  upcomingLabel: {
    color: '#8b8ba7',
  },
});
