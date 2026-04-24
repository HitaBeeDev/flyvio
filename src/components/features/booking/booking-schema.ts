import { z } from "zod";
import { bookingPassengersSchema } from "./booking-utils";

export const bookingExtrasSchema = z.object({
  extraBaggage: z.array(z.string()),
  selectedSeats: z.array(
    z.object({
      passengerKey: z.string(),
      flightSegmentId: z.string(),
      seatCode: z.string(),
      seatType: z.enum(["window", "middle", "aisle"]),
    }),
  ),
});

export const passengerFormSchema = z.object({
  passengers: bookingPassengersSchema,
});

export type PassengerFormValues = z.infer<typeof passengerFormSchema>;
export type BookingExtrasFormValues = z.infer<typeof bookingExtrasSchema>;
