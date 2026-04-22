import { z } from 'zod'
import { PASSENGER_LIMITS } from '@/lib/constants'

export const SearchSchema = z
  .object({
    origin: z.string().trim().length(3, 'Choose an origin airport.'),
    destination: z.string().trim().length(3, 'Choose a destination airport.'),
    departureDate: z.string().min(1, 'Choose a departure date.'),
    returnDate: z.string().optional(),
    passengers: z.object({
      adults: z
        .number()
        .int()
        .min(PASSENGER_LIMITS.adults.min)
        .max(PASSENGER_LIMITS.adults.max),
      children: z
        .number()
        .int()
        .min(PASSENGER_LIMITS.children.min)
        .max(PASSENGER_LIMITS.children.max),
      infants: z.number().int().min(PASSENGER_LIMITS.infants.min),
    }),
    cabinClass: z.enum(['Economy', 'Premium Economy', 'Business', 'First']),
    isRoundTrip: z.boolean(),
  })
  .superRefine((value, context) => {
    if (value.origin === value.destination) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['destination'],
        message: 'Origin and destination must be different.',
      })
    }

    const totalPassengers =
      value.passengers.adults + value.passengers.children + value.passengers.infants

    if (totalPassengers > PASSENGER_LIMITS.total) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passengers'],
        message: `Maximum ${PASSENGER_LIMITS.total} passengers per booking.`,
      })
    }

    if (value.passengers.infants > value.passengers.adults) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['passengers', 'infants'],
        message: 'Infants cannot exceed the number of adults.',
      })
    }

    if (value.isRoundTrip && !value.returnDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['returnDate'],
        message: 'Choose a return date for round-trip travel.',
      })
    }

    if (
      value.isRoundTrip &&
      value.returnDate &&
      value.returnDate <= value.departureDate
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['returnDate'],
        message: 'Return date must be after departure.',
      })
    }
  })

export type SearchFormValues = z.infer<typeof SearchSchema>
