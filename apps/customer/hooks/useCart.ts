import { useCartStore } from '@/stores/cartStore';
import { formatLKR } from '@cheerslk/shared-utils';

export function useCart() {
  const store = useCartStore();

  const subtotal = store.getSubtotal();
  const itemCount = store.getItemCount();
  const deliveryFee = subtotal > 0 ? 350 : 0;
  const freeDeliveryThreshold = 5000;
  const qualifiesForFreeDelivery = subtotal >= freeDeliveryThreshold;
  const actualDeliveryFee = qualifiesForFreeDelivery ? 0 : deliveryFee;
  const total = subtotal + actualDeliveryFee;

  return {
    ...store,
    subtotal,
    itemCount,
    deliveryFee: actualDeliveryFee,
    total,
    qualifiesForFreeDelivery,
    freeDeliveryThreshold,
    amountUntilFreeDelivery: Math.max(0, freeDeliveryThreshold - subtotal),
    formattedSubtotal: formatLKR(subtotal),
    formattedTotal: formatLKR(total),
    formattedDeliveryFee: actualDeliveryFee === 0 ? 'FREE' : formatLKR(actualDeliveryFee),
  };
}
