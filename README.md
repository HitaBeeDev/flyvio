# Flyvio

A flight search and booking app where users can search any route, browse results, view flight details, and complete a full booking flow from start to confirmation.


---

## What It Does

Flyvio lets users search for flights between airports, browse dynamically generated results, view full flight details, and complete a 3-step booking flow through to a confirmation screen.

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
