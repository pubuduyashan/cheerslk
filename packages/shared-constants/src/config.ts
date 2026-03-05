export const APP_CONFIG = {
  appName: 'CheersLK',
  currency: 'LKR',
  currencySymbol: 'Rs.',
  countryCode: '+94',
  country: 'Sri Lanka',
  minOrderAge: 21,
  defaultLanguage: 'en' as const,
  supportedLanguages: ['en', 'si', 'ta'] as const,
  maxOTPAttempts: 3,
  otpExpiryMinutes: 5,
  otpLength: 6,
  riderAssignmentTimeoutSeconds: 30,
  maxRiderAssignmentAttempts: 5,
  loyaltyPointsPerLKR: 0.1, // 1 point per 10 LKR
  loyaltyRedemptionRate: 100, // 100 points = 1 LKR
  defaultDeliveryFee: 250,
  freeDeliveryThreshold: 5000,
  maxDeliveryDistanceKm: 15,
  storeLocation: {
    lat: 6.9271,
    lng: 79.8612, // Colombo center
  },
  payhere: {
    sandboxUrl: 'https://sandbox.payhere.lk/pay/checkout',
    productionUrl: 'https://www.payhere.lk/pay/checkout',
  },
} as const;
