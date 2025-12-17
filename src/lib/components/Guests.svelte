<script lang="ts">
	import { UserRoundPlus, X } from '@lucide/svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import { bookingStore } from '../../store/booking.store';

	// Initialize from store
	let guests = $state<string[]>($bookingStore.bookingDetails.guests || []);
	let showInitialButton = $state(guests.length === 0);

	// Sync with store whenever guests change
	$effect(() => {
		bookingStore.setGuests(guests);
	});

	function addGuest() {
		guests.push('');
		showInitialButton = false;
	}

	function removeGuest(index: number) {
		guests.splice(index, 1);
		if (guests.length === 0) {
			showInitialButton = true;
		}
	}
</script>

<div class="space-y-1">
	{#if showInitialButton}
		<Button variant="ghost" onclick={addGuest}>
			{#snippet icon()}
				<UserRoundPlus size={16} />
			{/snippet}
			Add guests
		</Button>
	{:else}
		<span class="inline-block text-sm font-medium text-neutral-200">Guests</span>
	{/if}

	{#each guests as _, index (index)}
		<div class="flex flex-col gap-2">
			<div class="flex gap-1.5">
				<Input type="email" bind:value={guests[index]} placeholder="Guest email" />

				<Button onclick={() => removeGuest(index)} variant="ghost" aria-label="Remove guest">
					{#snippet icon()}
						<X size={16} />
					{/snippet}
				</Button>
			</div>
			{#if index === guests.length - 1}
				<div>
					<Button variant="ghost" onclick={addGuest}>
						{#snippet icon()}
							<UserRoundPlus size={16} />
						{/snippet}
						Add another
					</Button>
				</div>
			{/if}
		</div>
	{/each}
</div>
