<script lang="ts">
	import { format, getDay, isSameDay, addMinutes } from 'date-fns';
	import { bookingStore } from '../store/booking.store';
	import { DAYS_OF_WEEK } from './utils/constants';
	import type { AvailabilitySlot } from './types/calendar';

	type Props = {
		selectedDate: Date | null;
		onTimeSelect: (time: Date) => void;
		slotDuration?: number; // Duration in minutes (default: 30)
	};

	let { selectedDate, onTimeSelect, slotDuration = 30 }: Props = $props();

	// Generate time slots from availability windows
	function generateTimeSlotsFromAvailability(
		selectedDate: Date,
		availability: AvailabilitySlot[]
	): Date[] {
		const slots: Date[] = [];
		const now = new Date();
		const isToday = isSameDay(selectedDate, now);

		// Filter availability for the selected date
		const dayAvailability = availability.filter((slot) => {
			const slotStart = new Date(slot.start);
			return isSameDay(slotStart, selectedDate);
		});

		// Generate time slots for each availability window
		dayAvailability.forEach((availSlot) => {
			const startTime = new Date(availSlot.start);
			const endTime = new Date(availSlot.end);

			let currentTime = startTime;

			// Generate slots within this availability window
			while (currentTime < endTime) {
				const slotEnd = addMinutes(currentTime, slotDuration);

				// Only add slot if it fits completely within the availability window
				if (slotEnd <= endTime) {
					// If today, only add slots that haven't passed yet
					if (isToday) {
						if (currentTime > now) {
							slots.push(new Date(currentTime));
						}
					} else {
						slots.push(new Date(currentTime));
					}
				}

				currentTime = addMinutes(currentTime, slotDuration);
			}
		});

		return slots;
	}

	function formatTime(date: Date, is24Hour: boolean): string {
		if (is24Hour) {
			return format(date, 'HH:mm');
		} else {
			return format(date, 'h:mm a');
		}
	}

	let is24Hour = $state(false);
	let selectedTime = $derived.by<Date | null>(() => {
		return $bookingStore.selectedTimeSlot || null;
	});

	let timeSlots = $derived.by(() => {
		const availability = $bookingStore.availability;

		if (!availability || availability.length === 0 || !selectedDate) {
			return [];
		}

		// Filter availability for the selected date and generate time slots
		return generateTimeSlotsFromAvailability(selectedDate, availability);
	});
</script>

<div class="space-y-4 px-4 py-6">
	<div class="flex">
		<div class="flex gap-2 font-semibold">
			{#if selectedDate}
				<span class="text-neutral-400">{DAYS_OF_WEEK[getDay(selectedDate)]}</span>
				<span>{format(selectedDate, 'MMM d')}</span>
			{:else}
				<span class="text-neutral-400">Select a date</span>
			{/if}
		</div>
	</div>

	<div
		class="grid max-h-60 grid-cols-2 gap-3 overflow-y-auto p-2 sm:max-h-100 sm:grid-cols-[repeat(auto-fill,minmax(120px,1fr))]"
	>
		{#if !selectedDate}
			<div class="col-span-full py-8 text-center text-neutral-500">
				Please select a date from the calendar
			</div>
		{:else if timeSlots.length === 0}
			<div class="col-span-full py-8 text-center text-neutral-500">
				No available time slots for this date
			</div>
		{:else}
			{#each timeSlots as slot (slot.getTime())}
				<button
					class={[
						'cursor-pointer rounded-sm border px-4 py-3 text-sm font-medium transition-all',
						selectedTime?.getTime() === slot.getTime()
							? 'border-primary/50 bg-primary text-white shadow-lg shadow-primary/10'
							: 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:-translate-y-0.5 hover:border-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 hover:shadow-md hover:shadow-neutral-600/10'
					]}
					onclick={() => {
						selectedTime = slot;
						onTimeSelect(slot);
					}}
				>
					<span>{formatTime(slot, is24Hour)}</span>
				</button>
			{/each}
		{/if}
	</div>
</div>
