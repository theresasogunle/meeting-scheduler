<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props extends HTMLTextareaAttributes {
		label?: string;
		error?: string;
		required?: boolean;
		value?: string;
	}

	let {
		label,
		error,
		required = false,
		class: className = '',
		value = $bindable<string>(''),
		id,
		...restProps
	}: Props = $props();

	const textareaId = $derived(id || `textarea-${Math.random().toString(36).slice(2, 11)}`);
	const hasError = $derived(!!error);
</script>

<div class="flex w-full flex-col gap-1.5">
	{#if label}
		<label for={textareaId} class="text-sm leading-none font-medium text-neutral-200">
			{label}
			{#if required}
				<span aria-label="required">*</span>
			{/if}
		</label>
	{/if}

	<textarea
		{...restProps}
		id={textareaId}
		bind:value={value}
		aria-required={required}
		aria-invalid={hasError}
		aria-describedby={error ? `${textareaId}-error` : undefined}
		class="flex min-h-20 w-full rounded-sm border bg-neutral-950/50 px-3 py-2 text-sm shadow-sm transition-all placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 {hasError
			? 'border-red-800 focus-visible:ring-red-800'
			: 'border-neutral-800 focus-visible:ring-neutral-400'} {className}"
	></textarea>

	{#if error}
		<p id="{textareaId}-error" class="text-sm text-red-800" role="alert">
			{error}
		</p>
	{/if}
</div>
