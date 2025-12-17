<script lang="ts">
	import { bookingDetails, bookingStore } from '../store/booking.store';
	import { createBooking } from './api/booking';
	import Button from './components/Button.svelte';
	import Guests from './components/Guests.svelte';
	import Input from './components/Input.svelte';
	import Textarea from './components/Textarea.svelte';
	import { validateField, validateBookingDetails } from './utils/validation';

	// Local state for form fields
	let name = $state($bookingStore.bookingDetails.name);
	let email = $state($bookingStore.bookingDetails.email);
	let additionalInfo = $state($bookingStore.bookingDetails.additionalInfo);
	let isLoading = $state(false);

	// Validation errors state
	let errors = $state<{
		name?: string;
		email?: string;
		additionalInfo?: string;
	}>({});

	// Track which fields have been touched
	let touched = $state<{
		name: boolean;
		email: boolean;
		additionalInfo: boolean;
	}>({
		name: false,
		email: false,
		additionalInfo: false
	});

	// Sync form values with store
	$effect(() => {
		bookingStore.setName(name);
	});

	$effect(() => {
		bookingStore.setEmail(email);
	});

	$effect(() => {
		bookingStore.setAdditionalInfo(additionalInfo);
	});

	// Validate individual field on blur
	async function handleBlur(fieldName: 'name' | 'email' | 'additionalInfo', value: string) {
		touched[fieldName] = true;
		const error = await validateField(fieldName, value);
		errors[fieldName] = error;
	}

	// Handle form submission
	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		// Mark all fields as touched
		touched.name = true;
		touched.email = true;
		touched.additionalInfo = true;

		// Validate all fields
		const validation = await validateBookingDetails({
			name,
			email,
			additionalInfo
		});

		if (!validation.isValid) {
			errors = validation.errors;
			return;
		}

		// Clear errors and proceed
		errors = {};
		handleCreateBooking();
	}

	const handleCreateBooking = async () => {
		isLoading = true;
		const attendees = $bookingDetails.guests.map((guest) => ({
			name: guest,
			email: guest
		}));

		// then push the current user
		attendees.push({
			name: $bookingDetails.name,
			email: $bookingDetails.email
		});
		// get selected time slot and fetch its start and end dates from availability
		let startTime = $bookingStore.selectedTimeSlot?.toISOString();
		if(!startTime) {
			// handle error
			isLoading = false;
			return;
		}
		// end time will be startTime + 30 minutes
		let endTime = new Date(new Date(startTime).getTime() + 30 * 60000).toISOString();
		if( !endTime) {
			// handle error
			isLoading = false;
			return;
		}
		await createBooking({
			attendees,
			start:startTime,
			end:endTime
		});
		isLoading = false;
		bookingStore.goToConfirmation();
		// clear in url parameters
		history.replaceState(null, '', window.location.pathname);
	};
</script>

<form class="space-y-6 px-4 py-6" onsubmit={handleSubmit}>
	<Input
		label="Name"
		required
		placeholder="Enter your name"
		bind:value={name}
		onblur={() => handleBlur('name', name)}
		error={touched.name ? errors.name : undefined}
	/>
	<Input
		label="Email address"
		required
		placeholder="Enter your email"
		type="email"
		bind:value={email}
		onblur={() => handleBlur('email', email)}
		error={touched.email ? errors.email : undefined}
	/>
	<Textarea
		label="Additional information"
		placeholder="Please share anything that may help prepare for our meeting."
		bind:value={additionalInfo}
		onblur={() => handleBlur('additionalInfo', additionalInfo)}
		error={touched.additionalInfo ? errors.additionalInfo : undefined}
	/>
	<Guests />

	<p class="text-sm text-neutral-400">
		By proceeding, you agree to our <span class="text-neutral-300">Terms of Service</span> and
		<span class="text-neutral-300">Privacy Policy</span>.
	</p>
	<div class="flex justify-end gap-6">
		<Button
			variant="ghost"
			onclick={() => {
				// clear time
				bookingStore.setTimeSlot(null);
				bookingStore.goToDateTime();
			}}>Go back</Button
		>
		<Button disabled={isLoading} type="submit" variant="primary">Confirm</Button>
	</div>
</form>
