<script lang="ts">
	import Booking from '$lib/Booking.svelte';
	import { bookingStore } from '../store/booking.store';
	import type { PageData } from './$types';
	import { afterNavigate, beforeNavigate } from '$app/navigation';

	let { data }: { data: PageData } = $props();
	beforeNavigate(() => {
		bookingStore.setLoadingAvailability(true);
	});

	afterNavigate(() => {
		bookingStore.setLoadingAvailability(false);
	});

	// Update availability whenever data changes (on navigation or reload)
	$effect(() => {
		bookingStore.setAvailability(data.availability);
	});
</script>

<main class="flex min-h-screen items-center justify-center">
	<Booking />
</main>
