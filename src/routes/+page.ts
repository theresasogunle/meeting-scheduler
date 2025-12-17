import type { PageLoad } from './$types';
import type { AvailabilitySlot } from '$lib/types/calendar';
import { startOfMonth, endOfMonth, format, parse } from 'date-fns';
import { getCurrentMonthString } from '$lib/utils/urlSync';

const CALENDAR_API_URL = 'https://calendar.meetchase.ai';

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
		const response = await fetch(`${apiUrl}?${params}`);
	

		if (!response.ok) {
			console.error('Failed to fetch availability');
			return { availability: [] };
		}

		const availability: AvailabilitySlot[] = await response.json();
		return { availability };
	} catch (error) {
		console.error('Error loading availability:', error);
		return { availability: [] };
	}
};
