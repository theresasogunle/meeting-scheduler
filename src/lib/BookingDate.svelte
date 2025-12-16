<script lang="ts">
	import Calendar from './components/Calendar.svelte';
</script>

<div class="px-4 py-6">
	<Calendar
		onDateSelect={() => {}}
		highlightedDates={[
			new Date(2025, 11, 17),
			new Date(2025, 11, 15),
			new Date(2025, 11, 18),
			new Date(2025, 11, 19)
		]}
	/>
</div>
