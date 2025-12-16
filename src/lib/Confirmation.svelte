<script lang="ts">
	import { Calendar, Clock, Globe, Video, CircleCheck } from '@lucide/svelte';
	import { format } from 'date-fns';

	import Avatar from './components/Avatar.svelte';

	interface BookingData {
		eventTitle: string;

		scheduledDate: Date;
		duration?: number;
		timezone?: string;
		platform?: string;
		organizationName?: string;

		attendeeEmail: string;
	}

	let {
		eventTitle = 'Discovery Call',
		scheduledDate = new Date(),
		duration = 30,
		timezone = 'Europe/London',
		platform = 'Google Meet',
		organizationName = 'Acme Organization',

		attendeeEmail = 'john@example.com'
	}: BookingData = $props();

	const formattedDate = $derived(format(scheduledDate, 'EEEE, MMMM d, yyyy'));
	const formattedTime = $derived(format(scheduledDate, 'h:mm a'));
	const endTime = $derived(format(new Date(scheduledDate.getTime() + duration * 60000), 'h:mm a'));
</script>

<div class="mx-auto max-w-2xl space-y-8 px-4 py-8">
	<div class="flex flex-col items-center space-y-4 text-center">
		<div class="flex size-16 items-center justify-center rounded-full bg-green-500/10">
			<CircleCheck size={32} class="text-green-500" />
		</div>
		<div class="space-y-2">
			<h1 class="text-lg font-semibold text-neutral-100">Booking Confirmed!</h1>
			<p class="max-w-sm text-sm text-neutral-400">
				You're all set! A confirmation email has been sent to {attendeeEmail}
			</p>
		</div>
	</div>

	<div class="space-y-6 rounded-sm border border-neutral-800 bg-neutral-900 px-6 py-6 shadow-lg">
		<div class="flex items-start gap-4">
			<Avatar size={48} alt="{organizationName} Logo" name={organizationName} />
			<div class="flex-1 space-y-1">
				<p class="text-sm text-neutral-400">{organizationName}</p>
				<h2 class="text-base font-semibold text-neutral-100">{eventTitle}</h2>
			</div>
		</div>

		<div class="h-px bg-neutral-800"></div>

		<div class="space-y-4">
			<div class="flex items-start gap-3">
				<Calendar size={20} class="mt-0.5 text-neutral-400" />
				<div class="flex-1">
					<p class="text-sm font-medium text-neutral-200">{formattedDate}</p>
					<p class="text-sm text-neutral-400">
						{formattedTime} - {endTime}
					</p>
				</div>
			</div>

			<div class="flex items-start gap-3">
				<Clock size={20} class="mt-0.5 text-neutral-400" />
				<div class="flex-1">
					<p class="text-sm text-neutral-200">{duration} minutes</p>
				</div>
			</div>

			<div class="flex items-start gap-3">
				<Globe size={20} class="mt-0.5 text-neutral-400" />
				<div class="flex-1">
					<p class="text-sm text-neutral-200">{timezone}</p>
				</div>
			</div>

			<div class="flex items-start gap-3">
				<Video size={20} class="mt-0.5 text-neutral-400" />
				<div class="flex-1">
					<p class="text-sm text-neutral-200">{platform}</p>
					<p class="text-xs text-neutral-500">A meeting link will be sent via email</p>
				</div>
			</div>
		</div>
	</div>
</div>
