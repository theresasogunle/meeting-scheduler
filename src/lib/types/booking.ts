import type { AvailabilitySlot } from '$lib/types/calendar';

export enum BookingStep {
  DateTime = 'dateTime',
  Details = 'details',
  Confirmation = 'confirmation'
}

;

export interface BookingDetails {
  name: string;
  email: string;
  additionalInfo: string;
  guests: string[];
}

export interface BookingState {
  currentStep: BookingStep;
  currentMonth: Date; // Tracks the current month being viewed
  selectedTimeSlot: Date | null; // Combined date + time
  bookingDetails: BookingDetails;
  isComplete: boolean;
  availability: AvailabilitySlot[];
  isLoadingAvailability: boolean;
}

type Attendee = {
  name: string;
  email: string;
};

export interface CreateBookingRequest {
  attendees: Attendee[];
  start: string; 
  end: string;   

}