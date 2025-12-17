<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { EVENT_METADATA } from '$lib/utils/constants';

	let { children } = $props();
</script>

<svelte:head>
	<title>{EVENT_METADATA.title}</title>
	<meta name="description" content={EVENT_METADATA.description} />

	<!-- Open Graph / Social Media -->
	<meta property="og:title" content={EVENT_METADATA.title} />
	<meta property="og:description" content={EVENT_METADATA.description} />
	<meta property="og:type" content="website" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={EVENT_METADATA.title} />
	<meta name="twitter:description" content={EVENT_METADATA.description} />

	<link rel="icon" href={favicon} />
</svelte:head>
{@render children()}
