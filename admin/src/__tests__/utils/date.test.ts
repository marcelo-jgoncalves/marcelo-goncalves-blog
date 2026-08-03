import { describe, it, expect } from 'vitest'
import { localDateTimeToUtcIso, utcIsoToLocalDateTimeInput } from '../../utils/date'

describe('localDateTimeToUtcIso', () => {
  it('returns an empty string for an empty input', () => {
    expect(localDateTimeToUtcIso('')).toBe('')
  })

  it('returns an empty string for an unparseable input', () => {
    expect(localDateTimeToUtcIso('not-a-date')).toBe('')
  })

  it('converts a datetime-local value to a full UTC ISO string with offset (Z)', () => {
    const result = localDateTimeToUtcIso('2026-08-02T14:30')
    expect(result).toBe(new Date('2026-08-02T14:30').toISOString())
    expect(result.endsWith('Z')).toBe(true)
  })

  it('round-trips through utcIsoToLocalDateTimeInput back to the same local value', () => {
    const local = '2026-12-31T23:45'
    const utc = localDateTimeToUtcIso(local)
    expect(utcIsoToLocalDateTimeInput(utc)).toBe(local)
  })
})

describe('utcIsoToLocalDateTimeInput', () => {
  it('returns an empty string for an empty input', () => {
    expect(utcIsoToLocalDateTimeInput('')).toBe('')
  })

  it('returns an empty string for an unparseable input', () => {
    expect(utcIsoToLocalDateTimeInput('not-a-date')).toBe('')
  })

  it('formats a UTC ISO string as YYYY-MM-DDTHH:mm in local time', () => {
    const utc = new Date('2026-01-01T00:00:00.000Z').toISOString()
    const local = utcIsoToLocalDateTimeInput(utc)
    expect(local).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })

  it('round-trips through localDateTimeToUtcIso back to the same UTC instant', () => {
    const utc = '2026-06-15T10:00:00.000Z'
    const local = utcIsoToLocalDateTimeInput(utc)
    expect(localDateTimeToUtcIso(local)).toBe(new Date(utc).toISOString())
  })
})
