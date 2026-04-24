import { z } from "zod";
import { airports } from "@/data/airports";
import {
  calculateBookingPrice,
  EXTRA_BAGGAGE_PRICE,
  formatMoney,
  formatSeatSummary,
  generateConfirmationCode,
  SEAT_SELECTION_PRICE,
} from "@/lib/booking";
import type { Flight, Passenger, SeatSelection } from "@/types";

export const BOOKING_STEPS = ["Passengers", "Extras", "Review"] as const;

export type PassengerDescriptor = {
  key: string;
  label: string;
  passengerType: "adult" | "child";
};

export const passengerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required."),
  lastName: z.string().trim().min(1, "Last name is required."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  passportNumber: z
    .string()
    .trim()
    .regex(
      /^[A-Z]{1,2}[0-9]{6,9}$/,
      "Passport must match A123456 or AB1234567.",
    ),
  nationality: z.string().trim().min(1, "Nationality is required."),
});

export const bookingPassengersSchema = z.array(passengerSchema);

export const nationalityOptions = Array.from(
  new Set(airports.map((airport) => airport.country)),
).sort((left, right) => left.localeCompare(right));

export function buildPassengerDescriptors(
  adults: number,
  children: number,
): PassengerDescriptor[] {
  return [
    ...Array.from({ length: adults }, (_, index) => ({
      key: `adult-${index + 1}`,
      label: `Adult ${index + 1}`,
      passengerType: "adult" as const,
    })),
    ...Array.from({ length: children }, (_, index) => ({
      key: `child-${index + 1}`,
      label: `Child ${index + 1}`,
      passengerType: "child" as const,
    })),
  ];
}

export function getPassengerAge(dateOfBirth: string) {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age;
}

export function validatePassengerAge(
  passenger: Passenger,
  passengerType: PassengerDescriptor["passengerType"],
) {
  const birthDate = new Date(passenger.dateOfBirth);

  if (Number.isNaN(birthDate.getTime())) {
    return "Date of birth must be valid.";
  }

  const age = getPassengerAge(passenger.dateOfBirth);

  if (passengerType === "adult" && age < 16) {
    return "Adult passengers must be at least 16 years old.";
  }

  if (passengerType === "child" && age < 2) {
    return "Children must be at least 2 years old.";
  }

  return null;
}

export function createEmptyPassengers(descriptors: PassengerDescriptor[]) {
  return descriptors.map(() => ({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    passportNumber: "",
    nationality: "",
  }));
}

export function getFlightSegmentsWithKeys(flight: Flight) {
  const outbound = flight.outbound.map((segment, index) => ({
    key: `outbound-${index + 1}`,
    label: `Outbound ${index + 1}`,
    segment,
  }));

  const inbound = (flight.inbound ?? []).map((segment, index) => ({
    key: `inbound-${index + 1}`,
    label: `Inbound ${index + 1}`,
    segment,
  }));

  return [...outbound, ...inbound];
}

export function getSeatType(seatCode: string): SeatSelection["seatType"] {
  const column = seatCode.slice(-1);

  if (["A", "F"].includes(column)) {
    return "window";
  }

  if (["C", "D"].includes(column)) {
    return "aisle";
  }

  return "middle";
}

export function isSeatUnavailable(segmentKey: string, seatCode: string) {
  const seed = `${segmentKey}:${seatCode}`
    .split("")
    .reduce(
      (sum, character, index) => sum + character.charCodeAt(0) * (index + 11),
      0,
    );

  return seed % 7 === 0;
}

export {
  calculateBookingPrice,
  EXTRA_BAGGAGE_PRICE,
  formatMoney,
  formatSeatSummary,
  generateConfirmationCode,
  SEAT_SELECTION_PRICE,
};
