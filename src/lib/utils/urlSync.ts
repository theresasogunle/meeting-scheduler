import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import { format, parse } from 'date-fns';

export interface URLSyncParams {
	month?: string;
	timeSlot?: string;
}

export function updateURLParams(params: URLSyncParams) {
	if (!browser) return;

	const url = new URL(window.location.href);

	Object.entries(params).forEach(([key, value]) => {
		if (value) {
			url.searchParams.set(key, value);
		} else {
			url.searchParams.delete(key);
		}
	});

	goto(url.toString(), { replaceState: true, noScroll: true, keepFocus: true });
}

export function getURLParams(): URLSyncParams {
	if (!browser) return {};

	const url = new URL(window.location.href);
	return {
		month: url.searchParams.get('month') || undefined,
		timeSlot: url.searchParams.get('timeSlot') || undefined
	};
}

// Convert Date to month string (YYYY-MM)
export function dateToMonthString(date: Date): string {
	return format(date, 'yyyy-MM');
}

// Convert month string (YYYY-MM) to Date (first day of month)
export function monthStringToDate(monthStr: string): Date | null {
	try {
		const date = parse(monthStr, 'yyyy-MM', new Date());
		if (isNaN(date.getTime())) return null;
		return date;
	} catch {
		return null;
	}
}

// Convert Date to ISO string for timeSlot (YYYY-MM-DDTHH:mm)
export function dateToTimeSlotString(date: Date): string {
	return format(date, "yyyy-MM-dd'T'HH:mm");
}

// Convert timeSlot string to Date
export function timeSlotStringToDate(timeSlotStr: string): Date | null {
	try {
		const date = new Date(timeSlotStr);
		if (isNaN(date.getTime())) return null;
		return date;
	} catch {
		return null;
	}
}

// Get current month string
export function getCurrentMonthString(): string {
	return dateToMonthString(new Date());
}
