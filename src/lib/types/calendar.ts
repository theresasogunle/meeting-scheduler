/**
 * Simple types for MeetChase Calendar API
 */

export interface AvailabilitySlot {
	start: string; // ISO 8601 datetime
	end: string; // ISO 8601 datetime
}

export interface MeetingAttendee {
	email: string;
	name?: string | null;
}

export interface MeetingRequest {
	start: string; // ISO 8601 datetime
	end: string; // ISO 8601 datetime
	attendees: MeetingAttendee[];
}
