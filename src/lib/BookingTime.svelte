<script lang="ts">
	import { setHours, format, startOfDay } from 'date-fns';

	// Generate time slots from 12am to 1pm
	function generateTimeSlots(): Date[] {
		const slots: Date[] = [];
		const today = startOfDay(new Date());

		// Generate slots from 12am to 1pm (13 hours)
		for (let i = 0; i <= 13; i++) {
			const slot = setHours(today, i);
			slots.push(slot);
		}

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
	let selectedTime = $state<Date | null>(null);
	let timeSlots = $derived(generateTimeSlots());
</script>

<div class="px-4 py-6 space-y-4" >
	<!-- 12hr/24hr Toggle Switch -->
<div class="flex">
<div class="flex gap-2 font-semibold">
    <span class="text-neutral-400">Thu </span>
  <span>01</span>
</div>
  	<!-- <div class="mb-8 flex justify-center  pb-4">
		<label class="flex items-center gap-3">
			<span class={['text-sm font-medium transition-colors', { 'text-blue-600': !is24Hour, 'text-gray-500': is24Hour }]}>
				12hr
			</span>
			<button
				class={[
					'relative h-6 w-12 rounded-full border-none transition-colors',
					is24Hour ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 hover:bg-gray-400'
				]}
				role="switch"
				aria-checked={is24Hour}
				aria-label="Toggle between 12-hour and 24-hour time format"
				onclick={() => is24Hour = !is24Hour}
			>
				<span
					class={[
						'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform',
						is24Hour ? 'left-6.5' : 'left-0.5'
					]}
				></span>
			</button>
			<span class={['text-sm font-medium transition-colors', { 'text-blue-600': is24Hour, 'text-gray-500': !is24Hour }]}>
				24hr
			</span>
		</label>
	</div> -->

</div>

	<div class="grid max-h-122.5 grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 overflow-y-auto p-2">
		{#each timeSlots as slot (slot.getTime())}
			<button
				class={[
					'rounded-sm border px-4 py-3 text-sm font-medium transition-all cursor-pointer',
					selectedTime?.getTime() === slot.getTime()
						? 'border-primary/50 bg-primary text-white shadow-lg shadow-primary/10'
						: 'border-neutral-700 bg-neutral-900 text-neutral-400 hover:text-neutral-900 hover:-translate-y-0.5 hover:border-neutral-600 hover:bg-neutral-50 hover:shadow-md hover:shadow-neutral-600/10'
				]}
				onclick={() => selectedTime = slot}
			>
				{formatTime(slot, is24Hour)}
			</button>
		{/each}
	</div>


</div>
