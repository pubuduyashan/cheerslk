import { useCallback } from 'react';
import { useRiderStore } from '@/stores/riderStore';
import { createSupabaseClient } from '@cheerslk/supabase-client';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export function useDelivery() {
  const {
    activeDelivery,
    currentStep,
    setActiveDelivery,
    setCurrentStep,
    setStatus,
  } = useRiderStore();

  const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

  const confirmPickup = useCallback(async () => {
    if (!activeDelivery) return;
    const { error } = await supabase
      .from('orders')
      .update({ status: 'picked_up', picked_up_at: new Date().toISOString() })
      .eq('id', activeDelivery.id);
    if (!error) {
      setActiveDelivery({ ...activeDelivery, status: 'picked_up' });
      setCurrentStep(3);
    }
  }, [activeDelivery]);

  const startTransit = useCallback(async () => {
    if (!activeDelivery) return;
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'in_transit',
        in_transit_at: new Date().toISOString(),
      })
      .eq('id', activeDelivery.id);
    if (!error) {
      setActiveDelivery({ ...activeDelivery, status: 'in_transit' });
    }
  }, [activeDelivery]);

  const confirmDelivery = useCallback(async () => {
    if (!activeDelivery) return;
    const { error } = await supabase
      .from('orders')
      .update({ status: 'delivered', delivered_at: new Date().toISOString() })
      .eq('id', activeDelivery.id);
    if (!error) {
      setActiveDelivery(null);
      setCurrentStep(1);
      setStatus('online');
    }
  }, [activeDelivery]);

  const advanceStep = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  return {
    activeDelivery,
    currentStep,
    confirmPickup,
    startTransit,
    confirmDelivery,
    advanceStep,
    setCurrentStep,
  };
}
