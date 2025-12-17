import type { CreateBookingRequest } from '$lib/types/booking';
import { PUBLIC_API_BASE_URL } from '$env/static/public';

export const createBooking = async (bookingData: CreateBookingRequest) => {
	// use fetch

	const response = await fetch(`${PUBLIC_API_BASE_URL}/meetings`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(bookingData)
	});

	if (!response.ok) {
		throw new Error('Failed to create booking');
	}

	return await response.json();
};
