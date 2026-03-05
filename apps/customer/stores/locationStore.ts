import { create } from 'zustand';
import type { Address } from '@cheerslk/shared-types';

interface LocationState {
  selectedAddress: Address | null;
  currentLocation: { lat: number; lng: number } | null;
  addresses: Address[];
  setSelectedAddress: (address: Address) => void;
  setCurrentLocation: (location: { lat: number; lng: number }) => void;
  setAddresses: (addresses: Address[]) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  selectedAddress: null,
  currentLocation: null,
  addresses: [],
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  setCurrentLocation: (location) => set({ currentLocation: location }),
  setAddresses: (addresses) => set({ addresses }),
}));
