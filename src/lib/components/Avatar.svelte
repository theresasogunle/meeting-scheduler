<script lang="ts">
	interface AvatarProps {
		/** Image source URL */
		src?: string;
		/** Alternative text for the image */
		alt?: string;
		/** Name to display initials if the image is not available */
		name?: string;
		/** Size of the avatar in pixels */
		size?: number;
	}
	let { src = undefined, alt = 'Avatar', name = '', size = 40 }: AvatarProps = $props();

	let imageError = $state(false);
	let showInitials = $derived(!src || imageError);

	function handleImageError() {
		imageError = true;
	}
</script>

<div
	class="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary bg-linear-to-br font-semibold text-neutral-100"
	style="width: {size}px; height: {size}px"
	role="img"
	aria-label={alt}
>
	{#if showInitials}
		<span class="select-none" style="font-size: {size / 2.5}px">
			{name.slice(0, 2).toUpperCase()}
		</span>
	{:else}
		<img {src} {alt} class="h-full w-full object-cover" onerror={handleImageError} />
	{/if}
</div>
