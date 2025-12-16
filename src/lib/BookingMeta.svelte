<script lang="ts">
	import { Clock, Globe, Video } from '@lucide/svelte';

	import Avatar from './components/Avatar.svelte';
</script>

<div class="space-y-6.5 px-4 py-6">
	<div class="flex flex-col gap-4">
		<Avatar size={32} alt="Acme Org Logo" name="Acme Organization" />
		<span class="text-sm font-semibold tracking-tight text-neutral-400">Acme Organization</span>
	</div>

	<div class="space-y-1">
		<h2 class="text-neutral-350 text-lg">Discovery Call</h2>
		<p class="text-sm text-neutral-400">
			Learn how Acme can support your goals and drive your success. We'll discuss your needs and
			explore tailored solutions.
		</p>
	</div>

	<div class="space-y-4 text-neutral-300">
		<div class="flex items-center gap-2">
			<Clock size={16} />
			<span class="text-sm">30 minutes</span>
		</div>
		<div class="flex items-center gap-2">
			<Globe size={16} />
			<span class="text-sm">Europe/London</span>
		</div>
		<div class="flex items-center gap-2">
			<Video size={16} />
			<span class="text-sm">Google Meet</span>
		</div>
	</div>
</div>
