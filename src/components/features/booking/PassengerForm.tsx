import { useState } from 'react'
import { UserRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Passenger } from '@/types'
import {
  bookingPassengersSchema,
  nationalityOptions,
  type PassengerDescriptor,
  validatePassengerAge,
} from './booking-utils'

type PassengerFormProps = {
  descriptors: PassengerDescriptor[]
  initialPassengers: Passenger[]
  onSubmit: (passengers: Passenger[]) => void
}

type PassengerErrors = Partial<Record<keyof Passenger, string>>

export function PassengerForm({
  descriptors,
  initialPassengers,
  onSubmit,
}: PassengerFormProps) {
  const [passengers, setPassengers] = useState(initialPassengers)
  const [errors, setErrors] = useState<PassengerErrors[]>(
    descriptors.map(() => ({})),
  )

  const setField = (
    passengerIndex: number,
    field: keyof Passenger,
    value: string,
  ) => {
    setPassengers((currentPassengers) =>
      currentPassengers.map((passenger, index) =>
        index === passengerIndex
          ? { ...passenger, [field]: value }
          : passenger,
      ),
    )
    setErrors((currentErrors) =>
      currentErrors.map((passengerErrors, index) =>
        index === passengerIndex
          ? { ...passengerErrors, [field]: undefined }
          : passengerErrors,
      ),
    )
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const parsed = bookingPassengersSchema.safeParse(passengers)
    const nextErrors: PassengerErrors[] = descriptors.map(() => ({}))

    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const [index, field] = issue.path

        if (typeof index === 'number' && typeof field === 'string') {
          nextErrors[index] = {
            ...nextErrors[index],
            [field as keyof Passenger]: issue.message,
          }
        }
      }
    }

    descriptors.forEach((descriptor, index) => {
      const ageError = validatePassengerAge(passengers[index]!, descriptor.passengerType)

      if (ageError) {
        nextErrors[index] = {
          ...nextErrors[index],
          dateOfBirth: ageError,
        }
      }
    })

    const hasErrors = nextErrors.some((passengerErrors) =>
      Object.values(passengerErrors).some(Boolean),
    )

    if (hasErrors) {
      setErrors(nextErrors)
      return
    }

    onSubmit(passengers)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {descriptors.map((descriptor, index) => {
        const passenger = passengers[index]!
        const passengerErrors = errors[index] ?? {}

        return (
          <section
            key={descriptor.key}
            className="rounded-[1.8rem] border border-slate-200/80 bg-white/85 p-5 dark:border-slate-800/80 dark:bg-slate-950/75"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                <UserRound className="size-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-950 dark:text-stone-100">
                  {descriptor.label}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {descriptor.passengerType === 'adult' ? 'Adult traveler' : 'Child traveler'}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="First Name"
                value={passenger.firstName}
                onChange={(event) => setField(index, 'firstName', event.target.value)}
                error={passengerErrors.firstName}
              />
              <Input
                label="Last Name"
                value={passenger.lastName}
                onChange={(event) => setField(index, 'lastName', event.target.value)}
                error={passengerErrors.lastName}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={passenger.dateOfBirth}
                onChange={(event) => setField(index, 'dateOfBirth', event.target.value)}
                error={passengerErrors.dateOfBirth}
              />
              <Input
                label="Passport Number"
                value={passenger.passportNumber}
                onChange={(event) =>
                  setField(index, 'passportNumber', event.target.value.toUpperCase())
                }
                error={passengerErrors.passportNumber}
              />
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Nationality
                </label>
                <Select
                  value={passenger.nationality}
                  onValueChange={(value) => setField(index, 'nationality', value)}
                >
                  <SelectTrigger className="h-12 w-full rounded-2xl border-slate-200 bg-white px-4 text-left dark:border-slate-800 dark:bg-slate-950">
                    <SelectValue placeholder="Choose a nationality" />
                  </SelectTrigger>
                  <SelectContent className="max-h-80">
                    {nationalityOptions.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {passengerErrors.nationality ? (
                  <p className="text-sm text-rose-600 dark:text-rose-400">
                    {passengerErrors.nationality}
                  </p>
                ) : null}
              </div>
            </div>
          </section>
        )
      })}

      <div className="flex justify-end">
        <Button type="submit" className="rounded-2xl">
          Continue to extras
        </Button>
      </div>
    </form>
  )
}
