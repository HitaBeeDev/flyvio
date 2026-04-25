# Flyvio

A frontend flight search and booking application.
**Live demo:** _coming soon_

---

## What It Does

Flyvio lets users search for flights between any two of 5,518 real-world airports, browse dynamically generated results, view full flight details and fare breakdowns, and complete a 3-step booking flow through to a confirmation screen.

All airport and airline data comes from the [OpenFlights public dataset](https://openflights.org/data.html). Flights are generated on-demand for any airport pair using real carrier and route data — there is no hardcoded route list and no backend.

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | React 19 + TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| UI primitives | shadcn/ui — New York style, zinc base |
| Routing | React Router v6 |
| UI state | Zustand v5 |
| Server state | TanStack Query v5 |
| Forms | React Hook Form + Zod v4 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Notifications | Sonner |
| E2E testing | Playwright + axe-playwright |

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Landing | Hero, search widget, and popular destinations |
| `/search` | Search Results | Filtered and sorted flight list with skeleton loading |
| `/flights/:id` | Flight Detail | Full timeline, airline info, and fare breakdown |
| `/booking/:flightId` | Booking | 3-step form: passengers → extras → review |
| `/booking/confirmation/:bookingId` | Confirmation | Booking summary and next-action links |
| `/explore` | Explore | Destination inspiration grid |
| `*` | 404 | Not found page |

---

## Architecture

```
src/
├── types/           # Shared TypeScript interfaces (flight, booking, destination, search)
├── stores/          # Zustand stores: searchStore, bookingStore, uiStore
├── api/             # Typed fetch functions consumed by React Query hooks
├── hooks/           # Custom hooks: useFlights, useFlight, useBooking, useDestinations, …
├── data/
│   ├── airports.json        # 5,518 real airports (OpenFlights)
│   ├── airlines.json        # 80 major carriers (OpenFlights)
│   ├── flights.ts           # generateFlightsForRoute() — dynamic flight engine
│   └── destinations.ts      # 12 curated Explore page cards
├── components/
│   ├── ui/          # shadcn/ui primitives + custom atoms
│   ├── layout/      # AppShell, Navbar, Footer, PageTransition, ErrorBoundary
│   └── features/    # search/, results/, flight-detail/, booking/, explore/
├── pages/           # One file per route
└── lib/             # cn(), formatters, constants, motion variants
```

### State strategy

- **Zustand** owns UI state. `searchStore` persists search params and sort preference to `sessionStorage`; `uiStore` persists theme and saved flight IDs to `localStorage`; `bookingStore` is ephemeral.
- **TanStack Query v5** owns all async data — loading, error, success, and cache invalidation.
- **React Hook Form + Zod** owns all forms. Zod schemas are the single source of truth for types; no duplicate interface definitions.

### Dynamic flight generation

`generateFlightsForRoute(origin, destination, date, cabin, isRoundTrip)` produces 20 realistic flights for any airport pair. It derives route category (intra-regional → ultra-long-haul) from real timezone data, selects appropriate aircraft types, samples from the real airline dataset, and assigns realistic durations, layover cities, and fares. No flight data is hardcoded.

---

## Design

Dark-first, minimal, 2026 aesthetic.

- **Canvas:** `#0A0A0F` background, `zinc-900` surfaces, `zinc-800` borders
- **Accent:** Indigo `#6366F1` — CTAs and active states only
- **Typography:** Geist Sans for UI copy; `font-mono` for times, codes, and IDs
- **Cards:** 12px radius with dashed center dividers on flight tickets; glass panels (`backdrop-blur-md + bg-white/5`) only over the hero background
- **No gradients on text. No neon glows. No heavy shadows.**

All styling lives as Tailwind utility classes directly in component `className` props. There is no `@apply`, no CSS Modules, and no custom class definitions — just `@import "tailwindcss"` and the design token block in `index.css`.

### Animations

Framer Motion variants are centralized in `src/lib/motion.ts`. Every animation respects `useReducedMotion()` — when true, all durations collapse to zero. Page transitions use `AnimatePresence` with a 200ms `fadeIn`; results lists stagger in at 60ms intervals; booking steps slide left/right based on direction.

---

## Accessibility

- All form inputs have visible labels (no placeholder-only labeling)
- Error messages use `aria-describedby` to associate with their input
- Icon-only buttons have `aria-label`
- Modals and drawers trap focus and close on Escape
- Color contrast ≥ 4.5:1 throughout
- `prefers-reduced-motion` respected in all animations
- Automated a11y coverage via `axe-playwright`

---

## Getting Started

```bash
git clone https://github.com/HitaBeeDev/skyQuest.git
cd skyQuest
npm install
npm run dev
```

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run lint` | ESLint |
| `npm run preview` | Serve the production build locally |

TypeScript is configured with `"strict": true` and `"noUncheckedIndexedAccess": true`. Run `npx tsc --noEmit` to verify zero type errors.

---

## What This Project Is Not

- No real backend or database
- No real authentication or payment processing
- No server-side rendering (Vite SPA only)
- No i18n

This is a portfolio project. The booking flow simulates the UX of a real system without connecting to any live services.
