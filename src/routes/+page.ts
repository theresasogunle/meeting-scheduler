import type { PageLoad } from './$types';
import type { AvailabilitySlot } from '$lib/types/calendar';
import { startOfMonth, endOfMonth, format, parse } from 'date-fns';
import { getCurrentMonthString } from '$lib/utils/urlSync';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

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

	const fullUrl = `${PUBLIC_API_BASE_URL}/availability?${params}`;

	try {
		const response = await fetch(fullUrl, {
			headers: {
				Accept: 'application/json'
			}
		});

		if (!response.ok) {
			return { availability: [] };
		}

		const data = await response.json();

		const availability: AvailabilitySlot[] = data;
		return { availability };
	} catch (error) {
		console.error('Error loading availability:', error);
		// Return empty array instead of throwing to prevent 500 errors
		return { availability: [] };
	}
};
