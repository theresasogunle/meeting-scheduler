import type { CreateBookingRequest } from '$lib/types/booking';

export const createBooking = async (bookingData: CreateBookingRequest) => {
	// use fetch

	const response = await fetch('https://calendar.meetchase.ai/api/meetings', {
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
