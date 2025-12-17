import { writable, derived } from 'svelte/store';
import {
  getURLParams,
  updateURLParams,
  dateToMonthString,
  dateToTimeSlotString,
  monthStringToDate,
  timeSlotStringToDate,
  getCurrentMonthString
} from '$lib/utils/urlSync';
import type { AvailabilitySlot } from '$lib/types/calendar';
import { BookingStep, type BookingDetails, type BookingState } from '$lib/types/booking';


const initialBookingDetails: BookingDetails = {
  name: '',
  email: '',
  additionalInfo: '',
  guests: []
};

// Initialize state from URL params if available
function getInitialState(): BookingState {
  const urlParams = getURLParams();
  const currentMonth = urlParams.month ? monthStringToDate(urlParams.month) : new Date();
  const selectedTimeSlot = urlParams.timeSlot ? timeSlotStringToDate(urlParams.timeSlot) : null;

  // Set default month in URL if not present
  if (!urlParams.month) {
    updateURLParams({
      month: getCurrentMonthString()
    });
  }

  return {
    currentStep: BookingStep.DateTime,
    currentMonth: currentMonth || new Date(),
    selectedTimeSlot,
    bookingDetails: initialBookingDetails,
    availability: [],
    isLoadingAvailability: false
  };
}

const initialState: BookingState = getInitialState();

function createBookingStore() {
  const { subscribe, update } = writable<BookingState>(initialState);

  return {
    subscribe,

    // Navigate between steps
    goToDetails: () => {
      update(state => ({ ...state, currentStep: BookingStep.Details }));
    },

    goToDateTime: () => {
      update(state => ({ ...state, currentStep: BookingStep.DateTime }));
    },

    goToConfirmation: () => {
      update(state => ({
        ...state,
        currentStep: BookingStep.Confirmation,
        isComplete: true
      }));
    },

    // Month navigation
    setMonth: (month: Date) => {
      update(state => {
        updateURLParams({
          month: dateToMonthString(month)
        });
        return { ...state, currentMonth: month };
      });
    },

    // TimeSlot selection (combines date and time)
    setTimeSlot: (timeSlot: Date | null) => {
      update(state => {
        updateURLParams({
          month: dateToMonthString(state.currentMonth),
          timeSlot: timeSlot ? dateToTimeSlotString(timeSlot) : undefined
        });
        return { ...state, selectedTimeSlot: timeSlot };
      });
    },

    // Booking details
    setName: (name: string) => {
      update(state => ({
        ...state,
        bookingDetails: { ...state.bookingDetails, name }
      }));
    },

    setEmail: (email: string) => {
      update(state => ({
        ...state,
        bookingDetails: { ...state.bookingDetails, email }
      }));
    },

    setAdditionalInfo: (additionalInfo: string) => {
      update(state => ({
        ...state,
        bookingDetails: { ...state.bookingDetails, additionalInfo }
      }));
    },

    setGuests: (guests: string[]) => {
      update(state => ({
        ...state,
        bookingDetails: { ...state.bookingDetails, guests }
      }));
    },

    // Set availability
    setAvailability: (availability: AvailabilitySlot[]) => {
      update(state => ({
        ...state,
        availability,
        isLoadingAvailability: false
      }));
    },

    // Set loading state
    setLoadingAvailability: (isLoading: boolean) => {
      update(state => ({
        ...state,
        isLoadingAvailability: isLoading
      }));
    }
  };
}

export const bookingStore = createBookingStore();

// Derived stores for convenient access
export const currentStep = derived(
  bookingStore,
  $bookingStore => $bookingStore.currentStep
);

export const currentMonth = derived(
  bookingStore,
  $bookingStore => $bookingStore.currentMonth
);

export const selectedTimeSlot = derived(
  bookingStore,
  $bookingStore => $bookingStore.selectedTimeSlot
);

export const bookingDetails = derived(
  bookingStore,
  $bookingStore => $bookingStore.bookingDetails
);

// Derived store for availability
export const availability = derived(
  bookingStore,
  $bookingStore => $bookingStore.availability
);

// Derived store for loading state
export const isLoadingAvailability = derived(
  bookingStore,
  $bookingStore => $bookingStore.isLoadingAvailability
);
