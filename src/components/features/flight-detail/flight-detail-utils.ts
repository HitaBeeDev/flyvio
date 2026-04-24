import { formatDuration } from "@/lib/formatters";
import type { CabinClass, Flight, FlightSegment } from "@/types";

export function getJourneyDuration(segments: FlightSegment[]) {
  if (segments.length === 0) {
    return 0;
  }

  const departure = new Date(segments[0]!.departureTime).getTime();
  const arrival = new Date(
    segments[segments.length - 1]!.arrivalTime,
  ).getTime();
  return Math.round((arrival - departure) / 60_000);
}

export function getLayoverMinutes(left: FlightSegment, right: FlightSegment) {
  return Math.round(
    (new Date(right.departureTime).getTime() -
      new Date(left.arrivalTime).getTime()) /
      60_000,
  );
}

export function getArrivalDayOffset(segments: FlightSegment[]) {
  if (segments.length === 0) {
    return 0;
  }

  const departure = new Date(segments[0]!.departureTime);
  const arrival = new Date(segments[segments.length - 1]!.arrivalTime);
  const startDay = Date.UTC(
    departure.getFullYear(),
    departure.getMonth(),
    departure.getDate(),
  );
  const endDay = Date.UTC(
    arrival.getFullYear(),
    arrival.getMonth(),
    arrival.getDate(),
  );

  return Math.round((endDay - startDay) / 86_400_000);
}

export function getDeterministicPerformance(code: string) {
  const seed = code
    .split("")
    .reduce(
      (sum, character, index) => sum + character.charCodeAt(0) * (index + 3),
      0,
    );

  return 78 + (seed % 19);
}

export function getMealLabel(cabinClass: CabinClass) {
  if (cabinClass === "First") {
    return "Curated dining service";
  }

  if (cabinClass === "Business") {
    return "Chef-designed meal included";
  }

  if (cabinClass === "Premium Economy") {
    return "Hot meal included";
  }

  return "Light meal and drinks included";
}

export function getFleetType(flight: Flight) {
  return (
    flight.outbound[0]?.aircraft ??
    flight.inbound?.[0]?.aircraft ??
    "Fleet information unavailable"
  );
}

export function getFareBreakdown(
  pricePerTraveler: number,
  adults: number,
  children: number,
) {
  const adultBaseFare = Math.round(pricePerTraveler * 0.72);
  const adultFareTotal = adultBaseFare * adults;
  const childBaseFare = Math.round(adultBaseFare * 0.75);
  const childFareTotal = childBaseFare * children;
  const childrenDiscount =
    adults === 0 && children > 0
      ? Math.round(pricePerTraveler * children * 0.14)
      : Math.round(adultBaseFare * children * 0.25);
  const taxes = Math.max(
    45,
    pricePerTraveler * Math.max(adults + children, 1) -
      adultFareTotal -
      childFareTotal +
      childrenDiscount,
  );
  const total = adultFareTotal + childFareTotal - childrenDiscount + taxes;

  return {
    adultBaseFare,
    adultFareTotal,
    childBaseFare,
    childFareTotal,
    childrenDiscount,
    taxes,
    total,
  };
}

export function formatLayoverLabel(left: FlightSegment, right: FlightSegment) {
  return `${formatDuration(getLayoverMinutes(left, right))} layover at ${left.arrivalAirport.iata}`;
}
