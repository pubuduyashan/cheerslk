export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  RIDER_ASSIGNED = 'rider_assigned',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum RiderStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
  ON_DELIVERY = 'on_delivery',
}

export enum UserRole {
  CUSTOMER = 'customer',
  RIDER = 'rider',
  ADMIN = 'admin',
}

export enum PromoType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  FREE_DELIVERY = 'free_delivery',
}

export enum LoyaltyTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum DeliveryType {
  IMMEDIATE = 'immediate',
  SCHEDULED = 'scheduled',
}

export enum NotificationType {
  ORDER_UPDATE = 'order_update',
  NEW_ORDER = 'new_order',
  RIDER_ASSIGNED = 'rider_assigned',
  DELIVERY_UPDATE = 'delivery_update',
  PROMO = 'promo',
  SYSTEM = 'system',
}

export enum VehicleType {
  MOTORCYCLE = 'motorcycle',
  BICYCLE = 'bicycle',
  THREE_WHEELER = 'three_wheeler',
  CAR = 'car',
}

export enum AgeVerificationStatus {
  NOT_SUBMITTED = 'not_submitted',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}
