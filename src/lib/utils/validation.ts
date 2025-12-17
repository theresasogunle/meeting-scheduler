import * as yup from 'yup';

// Booking details validation schema
export const bookingDetailsSchema = yup.object({
	name: yup
		.string()
		.required('Name is required')
		.min(2, 'Name must be at least 2 characters')
		.max(100, 'Name must not exceed 100 characters')
		.trim(),
	email: yup
		.string()
		.required('Email is required')
		.email('Please enter a valid email address')
		.trim(),
	additionalInfo: yup
		.string()
		.max(500, 'Additional information must not exceed 500 characters')
		.trim()
		.optional()
});

// Type inference from schema
export type BookingDetailsFormData = yup.InferType<typeof bookingDetailsSchema>;

// Validation helper function
export async function validateBookingDetails(data: unknown): Promise<{
	isValid: boolean;
	errors: Record<string, string>;
	values?: BookingDetailsFormData;
}> {
	try {
		const values = await bookingDetailsSchema.validate(data, { abortEarly: false });
		return {
			isValid: true,
			errors: {},
			values
		};
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			const errors: Record<string, string> = {};
			error.inner.forEach((err) => {
				if (err.path) {
					errors[err.path] = err.message;
				}
			});
			return {
				isValid: false,
				errors
			};
		}
		throw error;
	}
}

// Validate a single field
export async function validateField(
	fieldName: keyof BookingDetailsFormData,
	value: unknown
): Promise<string | undefined> {
	try {
		await bookingDetailsSchema.validateAt(fieldName, { [fieldName]: value });
		return undefined;
	} catch (error) {
		if (error instanceof yup.ValidationError) {
			return error.message;
		}
		return 'Validation error';
	}
}
