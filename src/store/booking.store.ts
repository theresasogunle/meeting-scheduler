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
    isComplete: false,
    availability: [],
    isLoadingAvailability: false
  };
}

const initialState: BookingState = getInitialState();

function createBookingStore() {
  const { subscribe, set, update } = writable<BookingState>(initialState);

  return {
    subscribe,

    // Navigate between steps
    setStep: (step: BookingStep) => {
      update(state => ({ ...state, currentStep: step }));
    },

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

    addGuest: (guest: string) => {
      update(state => ({
        ...state,
        bookingDetails: {
          ...state.bookingDetails,
          guests: [...state.bookingDetails.guests, guest]
        }
      }));
    },

    removeGuest: (index: number) => {
      update(state => ({
        ...state,
        bookingDetails: {
          ...state.bookingDetails,
          guests: state.bookingDetails.guests.filter((_, i) => i !== index)
        }
      }));
    },

    setBookingDetails: (details: Partial<BookingDetails>) => {
      update(state => ({
        ...state,
        bookingDetails: { ...state.bookingDetails, ...details }
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
    },

    // Reset store
    reset: () => {
      set(initialState);
      updateURLParams({ month: getCurrentMonthString(), timeSlot: undefined });
    },

    // Complete booking
    completeBooking: () => {
      update(state => ({
        ...state,
        currentStep: BookingStep.Confirmation,
        isComplete: true
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

// Derived stores for date and time from timeSlot
export const selectedDate = derived(
  bookingStore,
  $bookingStore => $bookingStore.selectedTimeSlot
);

export const selectedTime = derived(
  bookingStore,
  $bookingStore => $bookingStore.selectedTimeSlot
);

export const bookingDetails = derived(
  bookingStore,
  $bookingStore => $bookingStore.bookingDetails
);

export const isBookingComplete = derived(
  bookingStore,
  $bookingStore => $bookingStore.isComplete
);

// Derived store to check if timeSlot selection is complete
export const isDateTimeSelected = derived(
  bookingStore,
  $bookingStore => $bookingStore.selectedTimeSlot !== null
);

// Derived store to check if booking details are valid
export const isDetailsValid = derived(
  bookingStore,
  $bookingStore => {
    const { name, email } = $bookingStore.bookingDetails;
    return name.trim() !== '' && email.trim() !== '' && email.includes('@');
  }
);

// Derived store for full scheduled datetime (just returns the timeSlot)
export const scheduledDateTime = derived(
  bookingStore,
  $bookingStore => $bookingStore.selectedTimeSlot
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
