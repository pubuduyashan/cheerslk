import { useState } from 'react';
import { supabase } from './useSupabase';
import type { PayHereParams } from '@cheerslk/shared-types';

interface UsePayHereResult {
  initiatePayment: (orderId: string) => Promise<string | null>;
  loading: boolean;
  error: string | null;
}

export function usePayHere(): UsePayHereResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (orderId: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-payment', {
        body: { order_id: orderId },
      });

      if (fnError) throw fnError;

      const params = data as PayHereParams;
      const paymentUrl = buildPayHereUrl(params);
      return paymentUrl;
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { initiatePayment, loading, error };
}

function buildPayHereUrl(params: PayHereParams): string {
  const baseUrl = 'https://sandbox.payhere.lk/pay/checkout';
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });

  return `${baseUrl}?${searchParams.toString()}`;
}
