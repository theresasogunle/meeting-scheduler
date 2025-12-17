<script lang="ts">
	import {
		bookingStore,
		selectedTimeSlot,
		availability,
		currentMonth,
		isLoadingAvailability
	} from '../store/booking.store';
	import BookingTime from './BookingTime.svelte';
	import Calendar from './components/Calendar.svelte';
	import { startOfDay } from 'date-fns';

	let highlightedDates = $derived($availability.map((slot) => slot.start));
	let selectedDateForTimeSlots = $state<Date | null>($selectedTimeSlot);

	// When availability changes (new month loaded), auto-select the first available date
	$effect(() => {
		if ($availability.length > 0) {
			const today = startOfDay(new Date());

			// Get all unique dates from availability
			const dates = $availability.map((slot) => startOfDay(new Date(slot.start)));

			// Filter out dates that are before today
			const validDates = dates.filter((date) => date >= today);

			// Get the earliest valid date
			const earliestDate =
				validDates.length > 0
					? validDates.reduce((earliest, current) => (current < earliest ? current : earliest))
					: null;

			// Only auto-select if:
			// 1. We found a valid date
			// 2. No date is currently selected OR selected date is not in current valid dates
			if (
				earliestDate &&
				(!selectedDateForTimeSlots ||
					!validDates.some((d) => d.getTime() === startOfDay(selectedDateForTimeSlots!).getTime()))
			) {
				selectedDateForTimeSlots = earliestDate;
			}
		}
	});
</script>

<div class="flex w-full flex-col md:flex-row">
	<div class="w-full md:w-120">
		<div class="px-4 py-6">
			<Calendar
				selectedDate={selectedDateForTimeSlots}
				currentMonth={$currentMonth}
				loading={$isLoadingAvailability}
				onDateSelect={(date: Date) => {
					selectedDateForTimeSlots = date;
				}}
				onMonthChange={(month: Date) => {
					bookingStore.setMonth(month);
				}}
				{highlightedDates}
			/>
		</div>
	</div>

	<div class="w-full border-t border-neutral-800 md:w-60 md:border-t-0 md:border-l">
		<BookingTime
			selectedDate={selectedDateForTimeSlots}
			onTimeSelect={(timeSlot: Date) => {
				bookingStore.setTimeSlot(timeSlot);
				bookingStore.goToDetails();
			}}
		/>
	</div>
</div>
