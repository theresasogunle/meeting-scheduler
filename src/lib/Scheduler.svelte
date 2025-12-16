<script lang="ts">
	import BookingDate from './BookingDate.svelte';
	import BookingDetails from './BookingDetails.svelte';
	import BookingMeta from './BookingMeta.svelte';
	import BookingTime from './BookingTime.svelte';
	import Confirmation from './Confirmation.svelte';
</script>

<div
	class="flex h-auto min-h-122.5 divide-x divide-neutral-800 overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900"
>
<Confirmation
  eventTitle="Discovery Call"
  scheduledDate={new Date(2024, 11, 20, 14, 30)}
  attendeeEmail="john@example.com"
/>
	<!-- <div class="w-60">
		<BookingMeta />
	</div>
   <div class="w-120">
  <BookingDetails />
   </div>

	<div class="w-120">
		<BookingDate />
	</div>
	<div class="w-60">
		<BookingTime />
	</div> -->
</div>
