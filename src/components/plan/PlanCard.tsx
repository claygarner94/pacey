import { forwardRef, type CSSProperties } from 'react'
import type { PaceMethod, PlanOutput, PlanRow } from '../../lib/schema'
import { nextPracticeDate } from '../../lib/practiceDate'

type Props = { plan: PlanOutput }
type CardMethodDisplay = {
  label: string
  hint?: string
}

const CARD_STYLE: CSSProperties = {
  width: '3.375in',
  height: '2.125in',
}

const WALLET_CARD_ROW_LIMIT = 2
const CARD_PREVIEW_SCALE = 1.6

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

export const PlanCard = forwardRef<HTMLDivElement, Props>(function PlanCard(
  { plan },
  ref,
) {
  const cardRows = plan.rows.slice(0, WALLET_CARD_ROW_LIMIT)

  return (
    <div ref={ref} className="space-y-6">
      <div className="print:hidden max-w-[720px] mx-auto rounded-2xl border border-paper-edge bg-paper-card px-4 py-3 text-sm text-ink-muted">
        Compact carry card. The first {WALLET_CARD_ROW_LIMIT} rows appear here, so put
        your most critical relationships first.
      </div>
      <div>
        <div className="print:hidden text-[10px] uppercase tracking-wider text-ink-subtle mb-1.5 font-medium text-center">
          front
        </div>
        <CardPreview>
          <PlanCardFront plan={plan} rows={cardRows} />
        </CardPreview>
      </div>
      <div>
        <div className="print:hidden text-[10px] uppercase tracking-wider text-ink-subtle mb-1.5 font-medium text-center">
          back
        </div>
        <CardPreview>
          <PlanCardBack plan={plan} rows={cardRows} />
        </CardPreview>
      </div>
    </div>
  )
})

function CardPreview({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-preview="wallet-card"
      className="mx-auto w-fit"
      style={{
        marginBottom: `${(CARD_PREVIEW_SCALE - 1) * 2.35}in`,
        transform: `scale(${CARD_PREVIEW_SCALE})`,
        transformOrigin: 'top center',
      }}
    >
      {children}
    </div>
  )
}

function PlanCardFront({ plan, rows }: Props & { rows: PlanRow[] }) {
  return (
    <div
      data-print="card-front"
      className="mx-auto bg-white text-ink relative border border-dashed border-ink-subtle/50 shadow-soft flex flex-col"
      style={{
        ...CARD_STYLE,
        padding: '0.12in 0.12in',
      }}
    >
      <header className="space-y-0.5">
        <div className="flex items-baseline justify-between">
          <div className="text-[8.6px] uppercase tracking-[0.14em] font-semibold truncate">
            PACE Card · {plan.displayName}
          </div>
          <span className="text-[7px] text-ink-subtle">✂</span>
        </div>
        <div className="text-[7.1px] text-ink-subtle">
          First 2 rows only · see worksheet for full details
        </div>
      </header>

      <table className="w-full mt-1.5 border-collapse table-fixed text-[7px]">
        <thead>
          <tr className="border-b border-ink-subtle/30">
            {[
              { label: 'Who', className: 'w-[24%]' },
              { label: 'Contact', className: 'w-[19%]' },
              { label: 'P', className: 'w-[14.25%]' },
              { label: 'A', className: 'w-[14.25%]' },
              { label: 'C', className: 'w-[14.25%]' },
              { label: 'E', className: 'w-[14.25%]' },
            ].map((column) => (
              <th
                key={column.label}
                className={`text-left font-semibold py-0.5 ${column.className}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.audienceLabel}-${row.contactLabel}`}
              className="align-top border-b border-ink-subtle/15"
            >
              <td className="py-1 pr-1">
                <div className="font-semibold leading-tight break-words">
                  {compactText(row.audienceLabel, 18)}
                </div>
              </td>
              <td className="py-1 pr-1">
                <div className="text-ink-muted leading-tight break-words">
                  {compactText(row.contactLabel, 14)}
                </div>
              </td>
              <td className="py-1 pr-1">
                <MethodBadge entry={row.primary} />
              </td>
              <td className="py-1 pr-1">
                <MethodBadge entry={row.alternate} />
              </td>
              <td className="py-1 pr-1">
                <MethodBadge entry={row.contingency} />
              </td>
              <td className="py-1">
                <MethodBadge entry={row.emergency} />
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="py-3 text-center text-[7px] text-ink-subtle">
                Add rows in the wizard to build this card.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <footer className="mt-auto pt-1 text-[6.8px] text-ink-subtle flex items-center justify-between">
        <span>Prepared {formatDate(plan.planDate)}</span>
        <span>flip for escalation ↩</span>
      </footer>
    </div>
  )
}

function MethodBadge({ entry }: { entry: PaceMethod }) {
  const display = formatCardMethod(entry)

  return (
    <div className="leading-tight">
      <div className="font-medium break-words">{display.label}</div>
      {display.hint && (
        <div className="text-[6.4px] text-ink-subtle break-words">{display.hint}</div>
      )}
    </div>
  )
}

function PlanCardBack({ plan, rows }: Props & { rows: PlanRow[] }) {
  const practice = nextPracticeDate(plan.planDate, plan.drillCadence)

  return (
    <div
      data-print="card-back"
      className="mx-auto bg-white text-ink relative border border-dashed border-ink-subtle/50 shadow-soft flex flex-col"
      style={{
        ...CARD_STYLE,
        padding: '0.12in 0.12in',
      }}
    >
      <header className="space-y-0.5">
        <div className="text-[8.5px] uppercase tracking-[0.14em] font-semibold">
          Escalation
        </div>
        <div className="text-[7px] text-ink-subtle">
          Carry card only · worksheet keeps full notes
        </div>
      </header>

      <div className="flex-1 mt-1.5 space-y-2">
        {rows.map((row) => (
          <div key={`${row.audienceLabel}-${row.contactLabel}-back`} className="space-y-0.5">
            <div className="text-[7px] font-semibold break-words">
              {compactText(row.audienceLabel, 20)} · {compactText(row.contactLabel, 14)}
            </div>
            <div className="text-[6.9px] text-ink-subtle break-words">
              Escalate: {compactText(row.escalateAfter, 28)}
            </div>
            <div className="text-[6.9px] text-ink-subtle break-words">
              Reminder: {cardReminder(row)}
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <div className="text-[7px] text-ink-subtle">Add rows in the wizard to build this card.</div>
        )}
      </div>

      <footer className="pt-1 text-[6.8px] text-ink-subtle flex items-center justify-between">
        <span>Next practice: {practice}</span>
        <span>PACEY</span>
      </footer>
    </div>
  )
}

function formatCardMethod(entry: PaceMethod): CardMethodDisplay {
  const method = entry.method.trim()
  const normalized = method.toLowerCase()
  const label = resolveMethodLabel(normalized, method)
  const hint = pickOperationalHint(entry)

  return hint ? { label, hint } : { label }
}

function resolveMethodLabel(normalized: string, original: string) {
  if (/(^|[\s/])(text|sms|message)([\s/]|$)/.test(normalized)) return 'SMS'
  if (/\b(phone|call|voice|landline|desk line|hotline)\b/.test(normalized)) return 'Call'
  if (/\b(email|e-mail)\b/.test(normalized)) return 'Email'
  if (/\b(teams)\b/.test(normalized)) return 'Teams'
  if (/\b(zoom)\b/.test(normalized)) return 'Zoom'
  if (/\b(slack|chat)\b/.test(normalized)) return 'Chat'
  if (/\b(app|portal)\b/.test(normalized)) return 'App'
  if (/\b(rally|meetup|pickup|assembly)\b/.test(normalized)) return 'Rally'
  if (/\b(in-person|in person|on-site|onsite|physical|home)\b/.test(normalized)) return 'In person'
  return compactText(toTitleCase(original), 10)
}

function pickOperationalHint(entry: PaceMethod) {
  return extractOperationalHint(entry.detail) ?? extractOperationalHint(entry.method)
}

function extractOperationalHint(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null

  const phoneMatch = trimmed.match(/(?:\+?1[\s.-]*)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]*\d{4}/)
  if (phoneMatch) return compactText(phoneMatch[0], 14)

  const taggedMatch = trimmed.match(/[#@][A-Za-z0-9._-]+/)
  if (taggedMatch) return compactText(taggedMatch[0], 14)

  const roomMatch = trimmed.match(/\b(room|rm|desk|suite|office)\s+[A-Za-z0-9-]+\b/i)
  if (roomMatch) return compactText(roomMatch[0], 14)

  if (trimmed.length <= 14 && !looksInstructional(trimmed)) {
    return trimmed
  }

  return null
}

function cardReminder(row: PlanRow) {
  const shortNote = row.notes.trim()
  if (shortNote && shortNote.length <= 34 && !looksInstructional(shortNote, 8)) {
    return compactText(shortNote, 34)
  }

  const fallbackDetail =
    pickOperationalHint(row.primary) ??
    pickOperationalHint(row.alternate) ??
    pickOperationalHint(row.contingency) ??
    pickOperationalHint(row.emergency)

  if (fallbackDetail) return fallbackDetail

  return 'See worksheet'
}

function looksInstructional(value: string, maxWords = 6) {
  const lower = value.toLowerCase()
  if (lower.split(/\s+/).filter(Boolean).length > maxWords) return true
  return /\b(use|when|during|include|only|fallback|urgent|reply|answer|check|confirm|report)\b/.test(
    lower,
  )
}

function compactText(value: string, length: number) {
  const trimmed = value.trim()
  if (trimmed.length <= length) return trimmed
  return `${trimmed.slice(0, Math.max(0, length - 1)).trim()}…`
}

function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (token) => token[0].toUpperCase() + token.slice(1).toLowerCase())
}
