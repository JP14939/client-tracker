export function formatHours(n) {
  if (n == null || isNaN(Number(n))) return '0h'
  return `${n}h`
}

export function formatDate(str) {
  if (!str) return ''
  const date = new Date(str)
  if (isNaN(date)) return ''
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatCurrency(n) {
  if (n == null || isNaN(Number(n))) return '$0.00'
  return `$${Number(n).toFixed(2)}`
}
