<script lang="ts">
	import type { Component } from 'svelte';
	import BookingDateTime from './BookingDateTime.svelte';
	import BookingDetails from './BookingDetails.svelte';
	import BookingMeta from './BookingMeta.svelte';
	import Confirmation from './Confirmation.svelte';
	import { currentStep } from '../store/booking.store';
	import { BookingStep } from './types/booking';
	import { gsap } from 'gsap/dist/gsap';

	import { Flip } from 'gsap/dist/Flip';

	gsap.registerPlugin(Flip);

	const viewMap: Record<string, Component> = {
		dateTime: BookingDateTime,
		details: BookingDetails,
		confirmation: Confirmation
	};

	let CurrentComponent = $derived(viewMap[$currentStep]);
	let containerRef: HTMLDivElement;
	let flipState: any = null;

	// Capture state BEFORE DOM updates
	$effect.pre(() => {
		$currentStep;

		if (containerRef) {
			flipState = Flip.getState(containerRef);
		}
	});

	// Animate AFTER DOM updates
	$effect(() => {
		$currentStep;

		if (containerRef && flipState) {
			Flip.from(flipState, {
				duration: 0.6,
				ease: 'elastic.out(0.5, 0.5)',
				scale: false,
				absolute: false,
				simple: true,
				props: 'width,height'
			});
		}
	});
</script>

<div
	bind:this={containerRef}
	class="flex h-auto min-h-128 divide-x divide-neutral-800 overflow-hidden rounded-sm border border-neutral-800 bg-neutral-900"
>
	{#if $currentStep !== BookingStep.Confirmation}
		<div class="w-60">
			<BookingMeta />
		</div>
	{/if}
	<CurrentComponent />
</div>
