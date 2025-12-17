<script lang="ts">
	import { Calendar, Clock, Globe, Video } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	import Avatar from './components/Avatar.svelte';
	import { format } from 'date-fns';
	import { bookingStore, currentStep } from '../store/booking.store';
	import { BookingStep } from './types/booking';

	onMount(() => {
		gsap.fromTo(
			'.animate-item',
			{
				opacity: 0,
				y: 50
			},
			{
				opacity: 1,
				y: 0,
				duration: 0.75,
				ease: 'elastic.out(0.2, 1)'
			}
		);
	});

	let scheduledDate = $derived($bookingStore.selectedTimeSlot || new Date());

	const formattedDate = $derived(format(scheduledDate, 'EEEE, MMMM d, yyyy'));
	const formattedTime = $derived(format(scheduledDate, 'h:mm a'));
</script>

<div class="space-y-6.5 px-4 py-6 md:space-y-6.5">
	<div class="animate-item flex flex-col gap-4 md:flex-col">
		<Avatar size={32} alt="Acme Org Logo" name="Acme Organization" />
		<span class="text-sm font-semibold tracking-tight text-neutral-400">Acme Organization</span>
	</div>

	<div class="animate-item space-y-1">
		<h2 class="text-neutral-350 text-lg">Discovery Call</h2>
		<p class="text-sm text-neutral-400">
			Learn how Acme can support your goals and drive your success. We'll discuss your needs and
			explore tailored solutions.
		</p>
	</div>

	<div class="animate-item space-y-4 text-neutral-300 md:space-y-4">
		{#if $currentStep === BookingStep.Details}
			<div class="flex items-start gap-2">
				<div>
					<Calendar size={16} />
				</div>
				<span class="text-sm">{formattedDate} at {formattedTime}</span>
			</div>
		{/if}
		<div class="flex items-center gap-2">
			<Video size={16} />
			<span class="text-sm">Google Meet</span>
		</div>
		<div class="flex items-center gap-2">
			<Clock size={16} />
			<span class="text-sm">30 minutes</span>
		</div>
		<div class="flex items-center gap-2">
			<Globe size={16} />
			<span class="text-sm">Europe/London</span>
		</div>
	</div>
</div>
