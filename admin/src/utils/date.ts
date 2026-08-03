// <input type="datetime-local"> has no timezone: the browser (and Node,
// under the same ECMA-262 Date Time String rule) parses a string in that
// shape as local wall-clock time. Converting explicitly to a UTC ISO string
// with an offset before it leaves the client is what lets the backend's
// z.string().datetime({ offset: true }) (packages/contracts/src/post.ts) and
// postScheduler's plain string comparison against `new Date().toISOString()`
// both work correctly, regardless of the admin's own timezone.
export function localDateTimeToUtcIso(localDateTime: string): string {
  if (!localDateTime) return ''
  const date = new Date(localDateTime)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString()
}

// Inverse of localDateTimeToUtcIso() — used when loading a post for edit, so
// <input type="datetime-local"> shows the scheduled time in the admin's own
// local timezone instead of raw UTC.
export function utcIsoToLocalDateTimeInput(utcIso: string): string {
  if (!utcIso) return ''
  const date = new Date(utcIso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}
