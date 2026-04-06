/**
 * Formats various date types into a human-readable string.
 * Specifically handles the @internationalized/date objects used by Nuxt UI calendars.
 * Example output: "March 30, 2026"
 */
export const formatPrettyDate = (date: any): string => {
  if (!date) return 'Not specified'
  
  // Handle CalendarDate objects { year, month, day }
  if (typeof date === 'object' && 'year' in date && 'month' in date && 'day' in date) {
    const d = new Date(date.year, date.month - 1, date.day)
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Handle standard Date objects or ISO strings
  const d = new Date(date)
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  return String(date)
}

/**
 * Formats a date with time for detailed logs/history.
 * Example output: "March 30, 2026, 2:30 PM"
 */
export const formatDateTime = (date: any): string => {
  if (!date) return 'N/A'
  const d = new Date(date)
  if (isNaN(d.getTime())) return String(date)
  
  return d.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}
