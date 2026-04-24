import { generateFlightsForRoute } from "@/data/flights";
import type { Booking, Flight, Passenger } from "@/types";

function getPassengers(passengers: Passenger[]) {
  return passengers;
}

function getSeedFlight(
  origin: string,
  destination: string,
  departureDate: string,
  cabinClass: Booking["flight"]["cabinClass"],
  index: number,
  isRoundTrip = true,
): Flight {
  const flight = generateFlightsForRoute(
    origin,
    destination,
    departureDate,
    cabinClass,
    isRoundTrip,
  )[index];

  if (!flight) {
    throw new Error(
      `Missing seed flight at index ${index} for ${origin}-${destination}`,
    );
  }

  return flight;
}

export const bookings: Booking[] = [
  {
    id: "bk-1001",
    confirmationCode: "SQ7K2M",
    flight: getSeedFlight("JFK", "LHR", "2026-06-18", "Business", 0),
    passengers: getPassengers([
      {
        firstName: "Anahita",
        lastName: "Karimi",
        dateOfBirth: "1990-03-15",
        passportNumber: "XK3029184",
        nationality: "United States",
      },
      {
        firstName: "Noah",
        lastName: "Karimi",
        dateOfBirth: "1988-10-02",
        passportNumber: "XR1192055",
        nationality: "United States",
      },
    ]),
    extras: {
      extraBaggage: ["adult-1", "adult-2"],
      selectedSeats: [
        {
          passengerKey: "adult-1",
          flightSegmentId: "outbound-1",
          seatCode: "4A",
          seatType: "window",
        },
        {
          passengerKey: "adult-2",
          flightSegmentId: "outbound-1",
          seatCode: "4B",
          seatType: "middle",
        },
      ],
    },
    totalPrice: 4860,
    status: "confirmed",
    createdAt: "2026-03-02T10:15:00Z",
  },
  {
    id: "bk-1002",
    confirmationCode: "QP4D8R",
    flight: getSeedFlight("BER", "IST", "2026-05-09", "Economy", 6),
    passengers: getPassengers([
      {
        firstName: "Mila",
        lastName: "Fischer",
        dateOfBirth: "1994-09-23",
        passportNumber: "C01D22199",
        nationality: "Germany",
      },
    ]),
    extras: {
      extraBaggage: [],
      selectedSeats: [
        {
          passengerKey: "adult-1",
          flightSegmentId: "outbound-1",
          seatCode: "18A",
          seatType: "window",
        },
      ],
    },
    totalPrice: 612,
    status: "ticketed",
    createdAt: "2026-02-14T17:40:00Z",
  },
  {
    id: "bk-1003",
    confirmationCode: "LW9N3C",
    flight: getSeedFlight("SFO", "HND", "2026-04-27", "Premium Economy", 10),
    passengers: getPassengers([
      {
        firstName: "Daniel",
        lastName: "Park",
        dateOfBirth: "1987-12-07",
        passportNumber: "M9925110",
        nationality: "United States",
      },
    ]),
    extras: {
      extraBaggage: ["adult-1"],
      selectedSeats: [
        {
          passengerKey: "adult-1",
          flightSegmentId: "outbound-1",
          seatCode: "12K",
          seatType: "window",
        },
      ],
    },
    totalPrice: 1844,
    status: "check-in-open",
    createdAt: "2026-01-29T08:05:00Z",
  },
  {
    id: "bk-1004",
    confirmationCode: "TY6H1B",
    flight: getSeedFlight("DXB", "SIN", "2026-07-03", "Business", 3),
    passengers: getPassengers([
      {
        firstName: "Layla",
        lastName: "Haddad",
        dateOfBirth: "1991-06-11",
        passportNumber: "N8102843",
        nationality: "United Arab Emirates",
      },
      {
        firstName: "Yousef",
        lastName: "Haddad",
        dateOfBirth: "1989-11-28",
        passportNumber: "N8102844",
        nationality: "United Arab Emirates",
      },
    ]),
    extras: {
      extraBaggage: ["adult-1", "adult-2"],
      selectedSeats: [
        {
          passengerKey: "adult-1",
          flightSegmentId: "outbound-1",
          seatCode: "6D",
          seatType: "aisle",
        },
        {
          passengerKey: "adult-2",
          flightSegmentId: "outbound-1",
          seatCode: "6F",
          seatType: "window",
        },
      ],
    },
    totalPrice: 3238,
    status: "confirmed",
    createdAt: "2026-03-11T13:30:00Z",
  },
  {
    id: "bk-1005",
    confirmationCode: "VC2X5P",
    flight: getSeedFlight("SYD", "LAX", "2026-08-21", "Economy", 15, false),
    passengers: getPassengers([
      {
        firstName: "Sophie",
        lastName: "Nguyen",
        dateOfBirth: "1996-04-04",
        passportNumber: "PA2201941",
        nationality: "Australia",
      },
    ]),
    extras: {
      extraBaggage: [],
      selectedSeats: [
        {
          passengerKey: "adult-1",
          flightSegmentId: "outbound-1",
          seatCode: "28A",
          seatType: "window",
        },
      ],
    },
    totalPrice: 914,
    status: "ticketed",
    createdAt: "2026-02-03T21:12:00Z",
  },
];
