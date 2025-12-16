<script lang="ts">
	import Button from './components/Button.svelte';
	import Guests from './components/Guests.svelte';
	import Input from './components/Input.svelte';
	import Textarea from './components/Textarea.svelte';
</script>

<div class="space-y-6 px-4 py-6">
	<Input label="Name" required placeholder="Enter your name" />
	<Input label="Email address" required placeholder="Enter your email" type="email" />
	<Textarea
		label="Additional information"
		placeholder="Please share anything that may help prepare for our meeting."
	/>
	<Guests />

  <p class="text-sm text-neutral-400">
    By proceeding, you agree to our <span class="text-neutral-300">Terms of Service</span> and <span class="text-neutral-300">Privacy Policy</span>.
  </p>
<div class="flex justify-end gap-6">
  	<Button variant="ghost">Go back</Button>
	<Button variant="primary" >Confirm</Button>
</div>
</div>
