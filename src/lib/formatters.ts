const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
})

export function formatPrice(value: number) {
  return currencyFormatter.format(value)
}

export function formatDuration(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) {
    return `${minutes}m`
  }

  if (minutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${minutes}m`
}

export function formatDate(value: Date | string | number) {
  return dateFormatter.format(new Date(value))
}

export function formatTime(value: Date | string | number) {
  return timeFormatter.format(new Date(value))
}

export function formatAirportCode(value: string) {
  return value.trim().slice(0, 3).toUpperCase()
}
