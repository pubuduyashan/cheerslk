export const ORDER_STATUSES = [
  { value: 'pending', label: 'Pending Payment', color: '#F59E0B', icon: 'clock' },
  { value: 'paid', label: 'Paid', color: '#3B82F6', icon: 'credit-card' },
  { value: 'confirmed', label: 'Confirmed', color: '#8B5CF6', icon: 'check-circle' },
  { value: 'preparing', label: 'Preparing', color: '#F97316', icon: 'package' },
  { value: 'rider_assigned', label: 'Rider Assigned', color: '#6366F1', icon: 'user-check' },
  { value: 'picked_up', label: 'Picked Up', color: '#14B8A6', icon: 'shopping-bag' },
  { value: 'in_transit', label: 'On the Way', color: '#06B6D4', icon: 'truck' },
  { value: 'delivered', label: 'Delivered', color: '#10B981', icon: 'check' },
  { value: 'cancelled', label: 'Cancelled', color: '#EF4444', icon: 'x-circle' },
  { value: 'refunded', label: 'Refunded', color: '#6B7280', icon: 'rotate-ccw' },
] as const;
