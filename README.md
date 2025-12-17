# Meeting Booking Platform

A modern, intuitive meeting booking interface built for SDR platforms to help prospects easily schedule meetings with sales teams. This application provides a smooth, frictionless booking experience with calendar availability visualization, time slot selection, and multi-guest support.

## Live Demo

[View Demo](#)

## Features

- **Calendar-based availability** - Visual calendar showing available dates fetched from API
- **Time slot selection** - Easy selection of 30-minute meeting slots
- **Guest management** - Add multiple guests to a meeting
- **Form validation** - Real-time validation for contact details
- **Smooth animations** - Polished transitions using GSAP Flip
- **URL state management** - Month navigation persisted in URL for easy sharing
- **Loading states** - Skeleton loaders for better UX during data fetching
- **Responsive design** - Works seamlessly across devices

## Tech Stack

- **Svelte 5** - Latest version with new runes API
- **TypeScript** - Full type safety throughout
- **Tailwind CSS v4** - Modern utility-first styling
- **SvelteKit** - Framework for routing and SSR
- **date-fns** - Date manipulation and formatting
- **Yup** - Schema validation
- **GSAP** - Animation library for smooth transitions
- **Lucide Svelte** - Icon library

## Initial Ideas in tldraw.
![Finding a time](<shapes at 25-12-17 12.16.39.png>)
![Booking a time](<shapes at 25-12-17 12.19.35.png>)
![Confirmation](<shapes at 25-12-17 12.20.27.png>)


## Assumptions

- I have assumed everyone is on Europe/London timezone
- I have assumed that users prefer the 12hr time format
- I have assumed that the booking will always be successful, meaning there wouldn't be an error from the API when calling the POST meeting endpoint.

## Design Decisions & UX Thinking

### 1. Custom-Built Calendar Component

**Decision**: Built the calendar component from scratch rather than using a third-party library.

**Reasoning**: Building a custom calendar gives complete control over styling, behavior, and integration with the API. This allows for pixel-perfect design matching the application's aesthetic I had in mind, seamless integration with our availability data structure, and the ability to add custom features like skeleton loading states, smart auto-selection, and precise disabled date logic. Third-party libraries often come with unnecessary features, larger bundle sizes, and styling constraints that would require workarounds.

### 2. GSAP Flip Animations for Step Transitions

**Decision**: Used GSAP Flip plugin to animate layout changes between booking steps (Date/Time → Details → Confirmation).

**Reasoning**: Step transitions provide visual context and continuity, helping users understand their progress through the meeting booking flow. GSAP Flip creates smooth, physics-based animations that feel natural and polished. The elastic easing gives the interface personality while the morphing container dimensions (as the sidebar appears/disappears) create spatial awareness - users see where they came from and where they're going, rather than experiencing jarring content swaps. This reduces cognitive load and makes the multi-step process feel cohesive.

### 3. Compact Calendar Navigation

**Decision**: Month navigation arrows (← →) are placed close together, directly adjacent to each other.

**Reasoning**: This creates a "navigation cluster" that minimizes mouse movement. When users want to browse multiple months, they don't need to move their cursor across the screen, both controls are within a small area. This follows Fitts's Law: reducing target distance increases interaction speed and reduces cognitive load. The close proximity signals these controls work together as a cohesive navigation unit.

### 4. 'Back Button' at the Bottom of the Form

**Decision**: "Back" button is positioned at the bottom of the Booking Details step.

**Reasoning**: I considered placing it at the top, but when filling out the form with name, email, and additional guests, users naturally scroll down to add more guests. Requiring them to scroll back to the top (if they decide to change the time slot) to navigate back breaks flow and creates unnecessary friction. By placing the "Back" button at the bottom (where users finish their interaction), we maintain continuous engagement and reduce mouse/scroll distance.

### 5. Auto-Selection of First Available Date

**Decision**: When the calendar loads or changes months, the first available date is automatically selected.

**Reasoning**: Reduces decision fatigue and clicks. Most users want the soonest available time, so we optimize for this common case while still allowing easy selection of other dates. This accelerates the booking flow for the majority use case.

### 7. Loading Skeletons

**Decision**: Calendar days show animated skeleton loaders during API fetches (as we fetch the API per month), not spinners or blank states.

**Reasoning**: Skeleton screens reduce perceived wait time by showing structure immediately. Users understand content is loading without feeling "stuck." The calendar grid remains stable, preventing layout shift when data arrives.

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── Avatar.svelte        # User avatar component
│   │   ├── Button.svelte        # Reusable button component
│   │   ├── Calendar.svelte      # Calendar date picker
│   │   ├── Guests.svelte        # Guest email management
│   │   ├── Input.svelte         # Form input with validation
│   │   └── Textarea.svelte      # Textarea with validation
│   ├── types/
│   │   ├── booking.ts           # Booking-related types
│   │   └── calendar.ts          # Calendar and availability types
│   ├── utils/
│   │   ├── constants.ts         # App-wide constants
│   │   ├── validation.ts        # Yup schemas and validation logic
│   │   ├── urlSync.ts           # URL parameter synchronization
│   │   └── index.ts             # Utility exports
│   ├── api/
│   │   └── booking.ts           # API client for booking endpoints
│   ├── Booking.svelte           # Main booking container
│   ├── BookingDateTime.svelte   # Date and time selection step
│   ├── BookingDetails.svelte    # Details form step
│   ├── BookingMeta.svelte       # Company info sidebar
│   ├── BookingTime.svelte       # Time slot list
│   └── Confirmation.svelte      # Success confirmation step
├── store/
│   └── booking.store.ts         # Svelte store for booking state
└── routes/
    ├── +page.svelte             # Main page component
    ├── +page.ts                 # Page load function
    └── +layout.svelte           # Root layout
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

```bash
# Type checking
npm run check

# Watch mode for type checking
npm run check:watch

# Linting
npm run lint

# Format code
npm run format
```

## What I'd Improve With More Time

1. **Timezone handling** - I have assumed everyone is in the same timezone, so this will be the highest priority to add a dropdown to select timezone.
2. **Email validation & Name support for guests** - Currently guests accept any string; should validate email format, and also think of a way to add support for guest name without making the UI feel clustered.
3. **Animations polishing** - Fine-tune hover state/button animations and some transitions in the calendar view.
4. **Mobile optimization** - While responsive, the calendar could use mobile-specific gestures (swipe to change months)
5. **Accessibility improvements**:
   - Keyboard navigation for calendar (arrow keys to navigate dates)
   - ARIA live regions for loading states
   - Focus management between steps
   - Screen reader announcements for state changes
6. **Calendar integration** - Add to Calendar buttons (Google, Outlook, iCal)
7. **Dark/light mode toggle** - Currently only dark mode
8. **Unit tests** - Component and utility function tests
9. **E2E tests** - Playwright tests for critical user flows

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

**Built with attention to detail and user experience** ✨
