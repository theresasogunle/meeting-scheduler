import type { PageLoad } from './$types';
import type { AvailabilitySlot } from '$lib/types/calendar';
import { startOfMonth, endOfMonth, format, parse } from 'date-fns';
import { getCurrentMonthString } from '$lib/utils/urlSync';

const CALENDAR_API_URL = 'https://calendar.meetchase.ai';

// Disable SSR to prevent issues in serverless environment
// export const ssr = false;

export const load: PageLoad = async ({ fetch, url }) => {
	// Get month from URL params, default to current month
	const monthParam = url.searchParams.get('month') || getCurrentMonthString();

	// Parse the month string (YYYY-MM) to get the month date range
	let monthDate: Date;
	try {
		monthDate = parse(monthParam, 'yyyy-MM', new Date());
	} catch {
		monthDate = new Date(); // Fallback to current month
	}

	const startDate = startOfMonth(monthDate);
	const endDate = endOfMonth(monthDate);

	const params = new URLSearchParams();
	params.append('start', format(startDate, 'yyyy-MM-dd'));
	params.append('end', format(endDate, 'yyyy-MM-dd'));

	const apiUrl = new URL('/api/availability', CALENDAR_API_URL);
	try {
		// Add timeout to prevent hanging in serverless environment
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

		const response = await fetch(`${apiUrl}?${params}`, {
			signal: controller.signal,
			headers: {
				'Accept': 'application/json'
			}
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			console.error('Failed to fetch availability:', response.status, response.statusText);
			return { availability: [] };
		}

		const availability: AvailabilitySlot[] = await response.json();
		return { availability };
	} catch (error) {
		if (error instanceof Error) {
			console.error('Error loading availability:', error.message);
		} else {
			console.error('Error loading availability:', error);
		}
		// Return empty array instead of throwing to prevent 500 errors
		return { availability: [] };
	}
};
