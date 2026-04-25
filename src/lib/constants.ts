import type { CabinClass, SortOption } from "@/types";

export const CABIN_CLASSES: ReadonlyArray<{
  value: CabinClass;
  label: string;
}> = [
  { value: "Economy", label: "Economy" },
  { value: "Premium Economy", label: "Premium Economy" },
  { value: "Business", label: "Business" },
  { value: "First", label: "First" },
];

export const STOP_LABELS: Record<number, string> = {
  0: "Nonstop",
  1: "1 Stop",
  2: "2+ Stops",
};

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> =
  [
    { value: "best", label: "Best" },
    { value: "cheapest", label: "Cheapest" },
    { value: "fastest", label: "Fastest" },
    { value: "earliest", label: "Earliest" },
  ];

export const PASSENGER_LIMITS = {
  adults: { min: 1, max: 9 },
  children: { min: 0, max: 8 },
  infants: { min: 0, max: 4 },
  total: 9,
} as const;

export const SEARCH_WIDGET_COPY = {
  compactTitle: "Search Summary",
  compactPlaceholder: "Choose route, dates, and passengers",
  edit: "Edit",
  hide: "Hide",
  searchButton: "Search",
  swapAriaLabel: "Swap origin and destination",
  tripOptions: [
    { label: "Round-trip", value: true },
    { label: "One-way", value: false },
  ],
  labels: {
    origin: "Origin",
    destination: "Destination",
    dates: "Dates",
    travelers: "Travelers",
  },
  placeholders: {
    origin: "Where from?",
    destination: "Where to?",
  },
} as const;

export const SEARCH_PAGE_COPY = {
  titleFallback: "Search Flights - Flyvio",
  invalidSearchTitle: "Finish your search",
  invalidSearchDescription:
    "Choose an origin and departure date to see live route options for this destination.",
  loadingLabel: "Loading booking flow",
  loadErrorTitle: "Could not load flights",
  loadErrorDescription:
    "There was a problem fetching flights for this route. Check your connection and try again.",
  retryLabel: "Try again",
  emptyTitle: "No flights match these filters",
  emptyDescription:
    "Try widening the price range, clearing airline constraints, or resetting filters to see more options.",
  resetFiltersLabel: "Reset filters",
  loadMoreLabel: "Load more",
  filtersTitle: "Filters",
  filtersDescription:
    "Refine results by price, stops, departure windows, airline, and duration.",
} as const;

export const BOOKING_COPY = {
  pageEyebrow: "Booking Flow",
  pageTitle: "Complete your booking",
  pageTitleDocument: "Complete Your Booking - Flyvio",
  passengers: {
    adultTraveler: "Adult traveler",
    childTraveler: "Child traveler",
    firstName: "First Name",
    lastName: "Last Name",
    dateOfBirth: "Date of Birth",
    passportNumber: "Passport Number",
    nationality: "Nationality",
    nationalityPlaceholder: "Choose a nationality",
    continueLabel: "Continue to extras",
  },
  extras: {
    baggageTitle: "Extra baggage",
    baggageDescription: "Add 23kg bag for $35 per traveler.",
    baggageLineItem: "Add 23kg bag - $35",
    seatSelectionSuffix: "seat selection",
    backLabel: "Back",
    reviewLabel: "Review booking",
  },
  review: {
    flightSummaryTitle: "Flight summary",
    passengerListTitle: "Passenger list",
    extrasTitle: "Extras and total",
    departurePrefix: "Departure",
    airlinePrefix: "Airline",
    passportPrefix: "Passport",
    seatsPrefix: "Seats",
    flightSubtotal: "Flight subtotal",
    baggageSubtotal: "Extra baggage",
    seatSubtotal: "Seat selection",
    baggageSelections: "Extra baggage selections",
    seatSelections: "Seat selections",
    totalDue: "Total due",
    confirmLabel: "Confirm & Book",
  },
  summary: {
    title: "Price summary",
    total: "Total",
    flightPrefix: "Flight x",
    baggagePrefix: "Extra baggage x",
    seatsPrefix: "Seat selection x",
  },
} as const;

export const FILTER_PANEL_COPY = {
  eyebrow: "Filters",
  description: "Refine by price, timing, airline, and duration.",
  resetLabel: "Reset filters",
  sections: {
    priceRange: "Price Range",
    stops: "Stops",
    departureTime: "Departure Time",
    airlines: "Airlines",
    maxFlightDuration: "Max Flight Duration",
  },
  maxDurationPrefix: "Up to",
} as const;

export const AIRPORT_INPUT_COPY = {
  empty: "No airports match that search.",
  focusKeys: ["ArrowDown", "ArrowUp", "Enter"],
} as const;

export const BOOKING_CONFIRMATION_COPY = {
  documentTitle: "Booking Confirmed - Flyvio",
  missingTitle: "Booking not found",
  missingDescription:
    "We could not locate that booking reference. Start a new search to create a fresh itinerary.",
  missingCta: "Go home",
  confirmedLabel: "Booking Confirmed",
  confirmedTitle: "Your flight is locked in",
  flightSummary: "Flight Summary",
  passengers: "Passengers",
  nextActions: "Next Actions",
  nextActionsTitle: "Everything you need is ready",
  routePrefix: "Route:",
  departurePrefix: "Departure:",
  airlinePrefix: "Airline:",
  cabinClassPrefix: "Cabin class:",
  totalPaidPrefix: "Total paid:",
  passportPrefix: "Passport",
  downloadBoardingPass: "Download boarding pass",
  searchAnotherFlight: "Search another flight",
  travelerLabel: "traveler",
} as const;

export const FLIGHT_DETAIL_COPY = {
  notFoundTitle: "Flight not found",
  notFoundDescription:
    "This flight is no longer available or the link may be outdated.",
  backToSearch: "Back to search",
  breadcrumb: "Breadcrumb",
  searchResults: "Search Results",
  backToResults: "Back to results",
  outbound: "Outbound",
  inbound: "Inbound",
  bookTitle: "Book this flight",
  bookDescription:
    "Passenger details, extras, and booking review are now available in the next step.",
  chosenTravelers: "Chosen travelers:",
  totalItineraryPrice: "Total itinerary price:",
  bookButton: "Book this flight",
  perTraveler: "per traveler",
} as const;
