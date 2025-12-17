<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'secondary' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		icon?: Snippet;
		children?: Snippet;
	}

	let {
		variant = 'primary',
		size = 'md',
		icon,
		children,
		class: className = '',
		...restProps
	}: Props = $props();

	const variantClasses = {
		primary: 'bg-neutral-50 text-neutral-900',
		secondary: 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600',
		ghost: 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
	};

	const sizeClasses = {
		sm: 'p-1.5 text-xs',
		md: 'p-2 text-sm',
		lg: 'p-3 text-base'
	};

	const buttonClasses = $derived(
		`flex font-medium rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed items-center gap-2 transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
	);
</script>

<button class={buttonClasses} {...restProps}>
	{#if icon}
		{@render icon()}
	{/if}
	{@render children?.()}
</button>
