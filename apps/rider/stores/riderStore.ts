import { create } from 'zustand';
import { Rider, RiderStatus, Order } from '@cheerslk/shared-types';

interface TodayStats {
  deliveryCount: number;
  earnings: number;
  rating: number;
  tips: number;
  commission: number;
}

interface RiderState {
  rider: Rider | null;
  status: RiderStatus;
  activeDelivery: Order | null;
  todayStats: TodayStats;
  incomingOrder: Order | null;
  currentStep: number;
  setRider: (rider: Rider | null) => void;
  setStatus: (status: RiderStatus) => void;
  setActiveDelivery: (delivery: Order | null) => void;
  setTodayStats: (stats: TodayStats) => void;
  setIncomingOrder: (order: Order | null) => void;
  setCurrentStep: (step: number) => void;
  reset: () => void;
}

const defaultStats: TodayStats = {
  deliveryCount: 0,
  earnings: 0,
  rating: 0,
  tips: 0,
  commission: 0,
};

export const useRiderStore = create<RiderState>((set) => ({
  rider: null,
  status: 'offline',
  activeDelivery: null,
  todayStats: defaultStats,
  incomingOrder: null,
  currentStep: 1,
  setRider: (rider) => set({ rider }),
  setStatus: (status) => set({ status }),
  setActiveDelivery: (activeDelivery) => set({ activeDelivery }),
  setTodayStats: (todayStats) => set({ todayStats }),
  setIncomingOrder: (incomingOrder) => set({ incomingOrder }),
  setCurrentStep: (currentStep) => set({ currentStep }),
  reset: () =>
    set({
      rider: null,
      status: 'offline',
      activeDelivery: null,
      todayStats: defaultStats,
      incomingOrder: null,
      currentStep: 1,
    }),
}));
