import { formatPrice } from "@/lib/formatters";
import type { BookingExtras, Flight, SeatSelection } from "@/types";

export const EXTRA_BAGGAGE_PRICE = 35;
export const SEAT_SELECTION_PRICE = 12;

export function calculateBookingPrice(
  flight: Flight,
  extras: BookingExtras,
  travelerCount: number,
) {
  const flightSubtotal = flight.price * travelerCount;
  const baggageSubtotal = extras.extraBaggage.length * EXTRA_BAGGAGE_PRICE;
  const seatSubtotal = extras.selectedSeats.length * SEAT_SELECTION_PRICE;
  const total = flightSubtotal + baggageSubtotal + seatSubtotal;

  return {
    flightSubtotal,
    baggageSubtotal,
    seatSubtotal,
    total,
  };
}

export function formatSeatSummary(
  selections: SeatSelection[],
  passengerKey: string,
) {
  const passengerSeats = selections.filter(
    (selection) => selection.passengerKey === passengerKey,
  );

  if (passengerSeats.length === 0) {
    return "No seats selected";
  }

  return passengerSeats.map((selection) => selection.seatCode).join(", ");
}

export function generateConfirmationCode() {
  const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let value = "";

  for (let index = 0; index < 6; index += 1) {
    value += characters[Math.floor(Math.random() * characters.length)];
  }

  return value;
}

export function formatMoney(amount: number) {
  return formatPrice(amount, "USD");
}
