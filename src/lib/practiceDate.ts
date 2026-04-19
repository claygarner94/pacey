export function nextPracticeDate(planDateIso: string, cadence: string): string {
  const base = new Date(planDateIso)
  if (Number.isNaN(base.getTime())) return cadence

  const lower = cadence.toLowerCase()
  let monthsToAdd: number | null = null

  if (/quarter/.test(lower)) monthsToAdd = 3
  else if (/semi.?annual|half.?year|twice.?a.?year|every.?six/.test(lower)) monthsToAdd = 6
  else if (/year|annual/.test(lower)) monthsToAdd = 12
  else if (/month/.test(lower)) monthsToAdd = 1

  if (monthsToAdd == null) return cadence

  const next = new Date(base)
  next.setMonth(next.getMonth() + monthsToAdd)
  return next.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
}
