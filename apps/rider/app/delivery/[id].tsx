import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { DeliverySteps } from '@/components/DeliverySteps';
import { DeliveryMap } from '@/components/DeliveryMap';
import { useDelivery } from '@/hooks/useDelivery';
import { useRiderLocation } from '@/hooks/useRiderLocation';
import { useRiderStore } from '@/stores/riderStore';
import { APP_CONFIG } from '@cheerslk/shared-constants';

export default function DeliveryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { location } = useRiderLocation();
  const {
    activeDelivery,
    currentStep,
    confirmPickup,
    confirmDelivery,
    advanceStep,
    setCurrentStep,
  } = useDelivery();
  const [deliveryPhoto, setDeliveryPhoto] = useState<string | null>(null);
  const [ageVerified, setAgeVerified] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  if (!activeDelivery) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Feather name="inbox" size={48} color="#2a2a3e" />
          <Text style={styles.emptyText}>No active delivery</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const storeLocation = {
    latitude: APP_CONFIG.storeLocation.lat,
    longitude: APP_CONFIG.storeLocation.lng,
  };

  const customerLocation = activeDelivery.address
    ? {
        latitude: activeDelivery.address.lat,
        longitude: activeDelivery.address.lng,
      }
    : undefined;

  const riderLoc = location
    ? { latitude: location.latitude, longitude: location.longitude }
    : null;

  const openMaps = (lat: number, lng: number) => {
    const url = Platform.select({
      ios: `maps://app?daddr=${lat},${lng}`,
      android: `google.navigation:q=${lat},${lng}`,
    });
    if (url) Linking.openURL(url);
  };

  const callCustomer = () => {
    if (activeDelivery.address) {
      Linking.openURL(`tel:+94771234567`);
    }
  };

  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const takeDeliveryPhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      setDeliveryPhoto(result.assets[0].uri);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!deliveryPhoto) {
      Alert.alert('Photo Required', 'Please take a delivery photo first.');
      return;
    }
    await confirmDelivery();
    Alert.alert('Delivery Complete', 'Great job! The delivery has been confirmed.', [
      { text: 'OK', onPress: () => router.replace('/(tabs)') },
    ]);
  };

  const handleConfirmPickup = async () => {
    const items = activeDelivery.items ?? [];
    if (items.length > 0 && checkedItems.size < items.length) {
      Alert.alert(
        'Check All Items',
        'Please verify all items before confirming pickup.'
      );
      return;
    }
    await confirmPickup();
  };

  const hasAgeRestricted = true; // Assume liquor orders need age check

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            #{activeDelivery.order_number}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Step Indicator */}
        <View style={styles.stepsCard}>
          <DeliverySteps currentStep={currentStep} />
        </View>

        {/* Map */}
        <View style={styles.mapWrapper}>
          <DeliveryMap
            riderLocation={riderLoc}
            pickupLocation={storeLocation}
            dropoffLocation={customerLocation}
            showRoute
          />
        </View>

        {/* Step Content */}
        {currentStep === 1 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Navigate to Store</Text>
            <View style={styles.addressBlock}>
              <Feather name="map-pin" size={16} color="#16c79a" />
              <Text style={styles.addressText}>
                CheersLK Store, Colombo
              </Text>
            </View>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                openMaps(
                  APP_CONFIG.storeLocation.lat,
                  APP_CONFIG.storeLocation.lng
                )
              }
              activeOpacity={0.8}
            >
              <Feather name="navigation" size={18} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Open in Maps</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setCurrentStep(2)}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>
                I've arrived at the store
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Confirm Pickup</Text>
            <Text style={styles.stepSubtitle}>
              Verify all items before picking up
            </Text>

            {(activeDelivery.items ?? []).map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => toggleItem(item.id)}
                activeOpacity={0.7}
              >
                <Feather
                  name={
                    checkedItems.has(item.id)
                      ? 'check-square'
                      : 'square'
                  }
                  size={20}
                  color={
                    checkedItems.has(item.id) ? '#16c79a' : '#8b8ba7'
                  }
                />
                <Text style={styles.checklistText}>
                  {item.product?.name?.en ?? `Item`} x{item.quantity}
                </Text>
              </TouchableOpacity>
            ))}

            {(activeDelivery.items ?? []).length === 0 && (
              <Text style={styles.noItemsText}>
                No items loaded. Confirm with store staff.
              </Text>
            )}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleConfirmPickup}
              activeOpacity={0.8}
            >
              <Feather name="check" size={18} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Confirm Pickup</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Navigate to Customer</Text>
            {activeDelivery.address && (
              <View style={styles.addressBlock}>
                <Feather name="map-pin" size={16} color="#16c79a" />
                <Text style={styles.addressText}>
                  {activeDelivery.address.address_line_1},{' '}
                  {activeDelivery.address.city}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => {
                if (customerLocation) {
                  openMaps(
                    customerLocation.latitude,
                    customerLocation.longitude
                  );
                }
              }}
              activeOpacity={0.8}
            >
              <Feather name="navigation" size={18} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Open in Maps</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() =>
                setCurrentStep(hasAgeRestricted ? 4 : 5)
              }
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>
                I've arrived at the customer
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 4 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Verify Customer Age</Text>
            <Text style={styles.stepSubtitle}>
              This order contains age-restricted items. Please verify the
              customer is at least {APP_CONFIG.minOrderAge} years old.
            </Text>

            <View style={styles.ageWarning}>
              <Feather name="alert-triangle" size={20} color="#f59e0b" />
              <Text style={styles.ageWarningText}>
                Ask to see a valid NIC or other government-issued ID to confirm
                the customer meets the minimum age requirement.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.ageCheckRow,
                ageVerified && styles.ageCheckRowActive,
              ]}
              onPress={() => setAgeVerified(!ageVerified)}
              activeOpacity={0.7}
            >
              <Feather
                name={ageVerified ? 'check-square' : 'square'}
                size={22}
                color={ageVerified ? '#16c79a' : '#8b8ba7'}
              />
              <Text style={styles.ageCheckText}>
                I have verified the customer's age
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                !ageVerified && styles.buttonDisabled,
              ]}
              onPress={() => {
                if (ageVerified) setCurrentStep(5);
              }}
              disabled={!ageVerified}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentStep === 5 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Confirm Delivery</Text>
            <Text style={styles.stepSubtitle}>
              Take a photo as proof of delivery
            </Text>

            <TouchableOpacity
              style={styles.photoBox}
              onPress={takeDeliveryPhoto}
              activeOpacity={0.7}
            >
              <Feather
                name={deliveryPhoto ? 'check-circle' : 'camera'}
                size={28}
                color={deliveryPhoto ? '#16c79a' : '#8b8ba7'}
              />
              <Text
                style={[
                  styles.photoLabel,
                  deliveryPhoto && { color: '#16c79a' },
                ]}
              >
                {deliveryPhoto ? 'Photo captured' : 'Take delivery photo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                !deliveryPhoto && styles.buttonDisabled,
              ]}
              onPress={handleConfirmDelivery}
              disabled={!deliveryPhoto}
              activeOpacity={0.8}
            >
              <Feather name="check-circle" size={18} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Confirm Delivery</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Customer Info */}
        <View style={styles.customerCard}>
          <Text style={styles.cardTitle}>Customer</Text>
          <View style={styles.customerRow}>
            <View style={styles.customerAvatar}>
              <Feather name="user" size={18} color="#8b8ba7" />
            </View>
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>Customer</Text>
              {activeDelivery.address && (
                <Text style={styles.customerArea}>
                  {activeDelivery.address.city}
                </Text>
              )}
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={callCustomer}
              activeOpacity={0.7}
            >
              <Feather name="phone" size={18} color="#16c79a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.orderCard}>
          <Text style={styles.cardTitle}>Order Summary</Text>
          {(activeDelivery.items ?? []).map((item) => (
            <View key={item.id} style={styles.orderItemRow}>
              <Text style={styles.orderItemQty}>{item.quantity}x</Text>
              <Text style={styles.orderItemName}>
                {item.product?.name?.en ?? 'Item'}
              </Text>
              <Text style={styles.orderItemPrice}>
                {APP_CONFIG.currencySymbol} {item.total_price}
              </Text>
            </View>
          ))}
          <View style={styles.orderTotal}>
            <Text style={styles.orderTotalLabel}>Delivery Fee</Text>
            <Text style={styles.orderTotalValue}>
              {APP_CONFIG.currencySymbol} {activeDelivery.delivery_fee}
            </Text>
          </View>
        </View>

        {/* Special Instructions */}
        {activeDelivery.special_instructions && (
          <View style={styles.instructionsCard}>
            <Text style={styles.cardTitle}>Special Instructions</Text>
            <Text style={styles.instructionsText}>
              {activeDelivery.special_instructions}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 24,
  },
  stepsCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  mapWrapper: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  stepCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  stepTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  stepSubtitle: {
    color: '#8b8ba7',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  addressBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0f0f23',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  addressText: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#16c79a',
    borderRadius: 12,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2a2a3e',
  },
  secondaryButtonText: {
    color: '#8b8ba7',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  checklistText: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  noItemsText: {
    color: '#8b8ba7',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
  ageWarning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  ageWarningText: {
    color: '#f59e0b',
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  ageCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 14,
    marginBottom: 14,
  },
  ageCheckRowActive: {},
  ageCheckText: {
    color: '#ffffff',
    fontSize: 15,
    flex: 1,
  },
  photoBox: {
    borderWidth: 2,
    borderColor: '#2a2a3e',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  photoLabel: {
    color: '#8b8ba7',
    fontSize: 14,
  },
  customerCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0f0f23',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  customerArea: {
    color: '#8b8ba7',
    fontSize: 13,
    marginTop: 1,
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(22, 199, 154, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  orderItemQty: {
    color: '#16c79a',
    fontSize: 14,
    fontWeight: '600',
    width: 30,
  },
  orderItemName: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  orderItemPrice: {
    color: '#8b8ba7',
    fontSize: 13,
  },
  orderTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
    paddingTop: 10,
    marginTop: 8,
  },
  orderTotalLabel: {
    color: '#8b8ba7',
    fontSize: 14,
  },
  orderTotalValue: {
    color: '#16c79a',
    fontSize: 14,
    fontWeight: '700',
  },
  instructionsCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  instructionsText: {
    color: '#8b8ba7',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  emptyText: {
    color: '#8b8ba7',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#16c79a',
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
