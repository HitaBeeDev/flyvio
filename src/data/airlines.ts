import airlineData from "@/data/airlines.json";
import type { Airline } from "@/types";

export const airlines = airlineData as Airline[];

export const airlinesByCode = new Map(
  airlines.map((airline) => [airline.code, airline]),
);
