type OrderStatus =
  | 'pending' | 'paid' | 'confirmed' | 'preparing'
  | 'rider_assigned' | 'picked_up' | 'in_transit'
  | 'delivered' | 'cancelled' | 'refunded';

const STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  pending: ['paid', 'cancelled'],
  paid: ['confirmed', 'cancelled', 'refunded'],
  confirmed: ['preparing', 'cancelled', 'refunded'],
  preparing: ['rider_assigned', 'cancelled'],
  rider_assigned: ['picked_up', 'cancelled'],
  picked_up: ['in_transit'],
  in_transit: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
};

export function getNextStatuses(current: OrderStatus): OrderStatus[] {
  return STATUS_FLOW[current] || [];
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return STATUS_FLOW[from]?.includes(to) ?? false;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Pending Payment',
  paid: 'Paid',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  rider_assigned: 'Rider Assigned',
  picked_up: 'Picked Up',
  in_transit: 'On the Way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: '#F59E0B',
  paid: '#3B82F6',
  confirmed: '#8B5CF6',
  preparing: '#F97316',
  rider_assigned: '#6366F1',
  picked_up: '#14B8A6',
  in_transit: '#06B6D4',
  delivered: '#10B981',
  cancelled: '#EF4444',
  refunded: '#6B7280',
};

export function getStatusLabel(status: OrderStatus): string {
  return STATUS_LABELS[status] || status;
}

export function getStatusColor(status: OrderStatus): string {
  return STATUS_COLORS[status] || '#6B7280';
}

export function isTerminalStatus(status: OrderStatus): boolean {
  return ['delivered', 'cancelled', 'refunded'].includes(status);
}
