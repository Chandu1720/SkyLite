import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Occasion, Theatre, Slot, Package, Addon } from '@skylite/shared'; // Assuming shared types exist

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  numberOfPeople: number;
}

interface BookingState {
  currentStep: number;
  selectedOccasion: string | null;
  selectedTheatre: string | null;
  selectedDate: string | null; // YYYY-MM-DD
  selectedSlot: string | null;
  selectedPackage: string | null;
  selectedAddons: string[];
  customerDetails: CustomerDetails | null;
  paymentType: 'FULL' | 'ADVANCE';
  discountCode: string;
  bookingData: any | null;
  paymentData: any | null;
}

interface BookingContextType extends BookingState {
  setStep: (step: number) => void;
  selectOccasion: (id: string) => void;
  selectTheatre: (id: string) => void;
  selectDate: (date: string) => void;
  selectSlot: (id: string) => void;
  selectPackage: (id: string) => void;
  toggleAddon: (id: string) => void;
  setCustomerDetails: (details: CustomerDetails) => void;
  setPaymentType: (type: 'FULL' | 'ADVANCE') => void;
  setDiscountCode: (code: string) => void;
  setBookingData: (data: any) => void;
  setPaymentData: (data: any) => void;
  reset: () => void;
  canGoNext: () => boolean;
  goBack: () => void;
  goNext: () => void;
}

const initialState: BookingState = {
  currentStep: 1,
  selectedOccasion: null,
  selectedTheatre: null,
  selectedDate: null,
  selectedSlot: null,
  selectedPackage: null,
  selectedAddons: [],
  customerDetails: null,
  paymentType: 'ADVANCE',
  discountCode: '',
  bookingData: null,
  paymentData: null,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = 'skylite_booking_state_v1';

const getStoredState = (): BookingState => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...initialState,
        ...parsed,
      };
    }
  } catch (e) {
    // ignore parsing failure
  }
  return initialState;
};

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BookingState>(getStoredState);

  // Sync state to sessionStorage
  React.useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore storage error
    }
  }, [state]);

  const setStep = (step: number) => setState(s => ({ ...s, currentStep: Math.max(1, Math.min(8, step)) }));
  
  const selectOccasion = (id: string) => setState(s => ({ ...s, selectedOccasion: id, selectedPackage: null }));
  const selectTheatre = (id: string) => setState(s => ({ ...s, selectedTheatre: id }));
  const selectDate = (date: string) => setState(s => ({ ...s, selectedDate: date, selectedSlot: null })); // Reset slot when date changes
  const selectSlot = (id: string) => setState(s => ({ ...s, selectedSlot: id }));
  const selectPackage = (id: string) => setState(s => ({ ...s, selectedPackage: id }));
  
  const toggleAddon = (id: string) => setState(s => {
    const currentAddons = s.selectedAddons || [];
    const isSelected = currentAddons.includes(id);
    return {
      ...s,
      selectedAddons: isSelected 
        ? currentAddons.filter(aId => aId !== id)
        : [...currentAddons, id]
    };
  });

  const setCustomerDetails = (details: CustomerDetails) => setState(s => ({ ...s, customerDetails: details }));
  const setPaymentType = (type: 'FULL' | 'ADVANCE') => setState(s => ({ ...s, paymentType: type }));
  const setDiscountCode = (code: string) => setState(s => ({ ...s, discountCode: code }));
  const setBookingData = (data: any) => setState(s => ({ ...s, bookingData: data }));
  const setPaymentData = (data: any) => setState(s => ({ ...s, paymentData: data }));
  
  const reset = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    setState(initialState);
  };

  const canGoNext = () => {
    switch (state.currentStep) {
      case 1: return !!state.selectedOccasion;
      case 2: return !!state.selectedTheatre;
      case 3: return !!state.selectedDate;
      case 4: return !!state.selectedSlot;
      case 5: return !!state.selectedPackage;
      case 6: return true; // Addons are optional
      case 7: return !!state.customerDetails && !!state.customerDetails.name && !!state.customerDetails.email && !!state.customerDetails.phone;
      case 8: return !!state.paymentData;
      default: return false;
    }
  };

  const goBack = () => {
    if (state.currentStep > 1) {
      setState(s => ({ ...s, currentStep: s.currentStep - 1 }));
    }
  };

  const goNext = () => {
    if (canGoNext() && state.currentStep < 8) {
      setState(s => ({ ...s, currentStep: s.currentStep + 1 }));
    }
  };

  return (
    <BookingContext.Provider value={{
      ...state,
      setStep,
      selectOccasion,
      selectTheatre,
      selectDate,
      selectSlot,
      selectPackage,
      toggleAddon,
      setCustomerDetails,
      setPaymentType,
      setDiscountCode,
      setBookingData,
      setPaymentData,
      reset,
      canGoNext,
      goBack,
      goNext
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
