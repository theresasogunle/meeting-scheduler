<script lang="ts">
	import { DAYS_OF_WEEK } from '$lib/utils/constants';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import {
		startOfMonth,
		endOfMonth,
		startOfWeek,
		endOfWeek,
		eachDayOfInterval,
		isSameDay,
		isSameMonth,
		addMonths,
		subMonths,
		format,
		isAfter,
		isBefore,
		isEqual,
		startOfDay
	} from 'date-fns';

	/**
	 * @typedef {Object} Props
	 * @property {Date} [startDate] - The earliest selectable date
	 * @property {Date} [endDate] - The latest selectable date
	 * @property {Date[]} [highlightedDates] - Array of dates to highlight
	 * @property {Date[]} [disabledDates] - Array of dates to disable
	 * @property {Date[]} [availableDates] - Array of available dates (if provided, only these dates are selectable)
	 * @property {Date | null} [selectedDate] - Currently selected date (bindable)
	 * @property {Date} [currentMonth] - Current month being viewed
	 * @property {boolean} [loading] - Loading state for calendar data
	 * @property {(date: Date) => void} [onDateSelect] - Callback when a date is selected
	 * @property {(month: Date) => void} [onMonthChange] - Callback when month navigation occurs
	 */

	/** @type {Props} */
	let {
		startDate = new Date(),
		endDate = addMonths(new Date(), 12),
		highlightedDates = [],
		disabledDates = [],
		selectedDate = $bindable(null),
		currentMonth = new Date(),
		loading = false,
		onDateSelect,
		onMonthChange
	} = $props();

	// Current month being viewed
	let currentDate = $derived(startOfMonth(currentMonth));

	// Get all days to display in the calendar grid
	const getCalendarDays = $derived.by(() => {
		const monthStart = startOfMonth(currentDate);
		const monthEnd = endOfMonth(currentDate);
		const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Start on Sunday
		const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

		const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

		return days.map((date) => ({
			date: startOfDay(date),
			isCurrentMonth: isSameMonth(date, currentDate)
		}));
	});

	// Check if a date is in a list
	const isDateInList = (date: Date, dateList: Date[]) => {
		return dateList.some((d) => isSameDay(startOfDay(d), startOfDay(date)));
	};

	// Check if a date is disabled
	const isDateDisabled = (date: Date) => {
		const normalizedDate = startOfDay(date);
		const normalizedStart = startOfDay(startDate);
		const normalizedEnd = startOfDay(endDate);

		// Check if date is outside the allowed range
		if (isBefore(normalizedDate, normalizedStart) || isAfter(normalizedDate, normalizedEnd)) {
			return true;
		}

		// Check if date is in disabled dates list
		if (isDateInList(normalizedDate, disabledDates)) return true;

		// If availableDates is provided, only those dates are enabled
		if (highlightedDates.length > 0 && !isDateInList(normalizedDate, highlightedDates)) return true;

		return false;
	};

	// Navigate to previous month
	const goToPrevMonth = () => {
		const newMonth = subMonths(currentDate, 1);
		currentDate = newMonth;
		if (onMonthChange) {
			onMonthChange(newMonth);
		}
	};

	// Navigate to next month
	const goToNextMonth = () => {
		const newMonth = addMonths(currentDate, 1);
		currentDate = newMonth;
		if (onMonthChange) {
			onMonthChange(newMonth);
		}
	};

	// Check if we can go to previous month
	const canGoPrev = $derived.by(() => {
		const prevMonth = subMonths(currentDate, 1);
		const prevMonthStart = startOfMonth(prevMonth);
		const normalizedStart = startOfMonth(startDate);
		return isAfter(prevMonthStart, normalizedStart) || isEqual(prevMonthStart, normalizedStart);
	});

	// Check if we can go to next month
	const canGoNext = $derived.by(() => {
		const nextMonth = addMonths(currentDate, 1);
		const nextMonthStart = startOfMonth(nextMonth);
		const normalizedEnd = endOfMonth(endDate);
		return isBefore(nextMonthStart, normalizedEnd) || isEqual(nextMonthStart, normalizedEnd);
	});

	// Handle date selection
	const selectDate = (day: { date: Date; isCurrentMonth: boolean }) => {
		if (isDateDisabled(day.date) || !day.isCurrentMonth) return;

		selectedDate = day.date;
		if (onDateSelect) {
			onDateSelect(day.date);
		}
	};

	// Format month and year for display
	const monthYearDisplay = $derived(format(currentDate, 'MMMM yyyy'));

	// Check if date is today
	const isToday = (date: Date) => {
		return isSameDay(startOfDay(date), startOfDay(new Date()));
	};

	// Check if date is selected
	const isSelected = (date: Date) => {
		if (!selectedDate) return false;
		return isSameDay(startOfDay(date), startOfDay(selectedDate));
	};
</script>

<!-- Header with month/year and navigation -->
<div class="flex items-center justify-between pb-4">
	<h2 class="text-base font-semibold text-neutral-400">
		{monthYearDisplay}
	</h2>
	<div>
		<button
			type="button"
			onclick={goToPrevMonth}
			disabled={!canGoPrev}
			class="cursor-pointer rounded-lg p-2 transition-colors hover:bg-neutral-800 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
			aria-label="Previous month"
		>
			<ChevronLeft size={16} />
		</button>

		<button
			type="button"
			onclick={goToNextMonth}
			disabled={!canGoNext}
			class="cursor-pointer rounded-lg p-2 transition-colors hover:bg-neutral-800 hover:text-gray-200 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
			aria-label="Next month"
		>
			<ChevronRight size={16} />
		</button>
	</div>
</div>

<!-- Calendar grid -->
<div class="grid grid-cols-7 gap-1">
	<!-- Day headers -->
	{#each DAYS_OF_WEEK as day (day)}
		<div class="p-2 text-center text-xs font-medium text-neutral-300 uppercase">
			{day}
		</div>
	{/each}

	<!-- Calendar days -->
	{#each getCalendarDays as day (day.date.getTime())}
		{@const disabled = isDateDisabled(day.date)}
		{@const highlighted = isDateInList(day.date, highlightedDates)}
		{@const selected = isSelected(day.date)}
		{@const today = isToday(day.date)}

		{#if loading}
			<!-- Skeleton loader for dates -->
			<div class="relative aspect-square animate-pulse rounded-lg p-1">
				<div class="h-full w-full rounded-lg bg-neutral-800/50"></div>
			</div>
		{:else}
			<button
				type="button"
				onclick={() => selectDate(day)}
				disabled={disabled || !day.isCurrentMonth}
				class={[
					'relative aspect-square rounded-lg p-1 text-sm font-medium transition-all',
					// Cursor styles - default for disabled in current month, not-allowed for out of month
					disabled && day.isCurrentMonth ? 'cursor-default' : '',
					!disabled && day.isCurrentMonth ? 'cursor-pointer' : '',
					!day.isCurrentMonth ? 'cursor-not-allowed' : '',
					// Base styles
					day.isCurrentMonth ? 'text-neutral-300' : 'text-neutral-500',
					// Disabled styles
					disabled && day.isCurrentMonth ? 'text-neutral-300' : '',

					// Selected state
					selected && !disabled ? 'bg-neutral-200 text-neutral-900' : '',

					// Hover styles (only for non-disabled, current month dates)
					!disabled && day.isCurrentMonth ? 'hover:bg-neutral-50 hover:text-neutral-900' : '',

					// Highlighted state (only if not selected)
					highlighted && !selected && !disabled ? 'bg-neutral-800 text-neutral-200' : ''
				]}
				aria-label={format(day.date, 'MMMM d, yyyy')}
				aria-pressed={selected}
			>
				{format(day.date, 'd')}

				<!-- Indicator dot for today -->
				{#if today && day.isCurrentMonth}
					<span class="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
					></span>
				{/if}
			</button>
		{/if}
	{/each}
</div>
