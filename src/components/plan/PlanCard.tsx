import { forwardRef } from 'react'
import type { PlanOutput, PlanTier } from '../../lib/schema'
import { nextPracticeDate } from '../../lib/practiceDate'

type Props = { plan: PlanOutput }

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return iso
  }
}

const CARD_STYLE: React.CSSProperties = {
  width: '3.375in',
  height: '2.125in',
}

export const PlanCard = forwardRef<HTMLDivElement, Props>(function PlanCard(
  { plan },
  ref,
) {
  return (
    <div ref={ref} className="space-y-6">
      <div>
        <div className="print:hidden text-[10px] uppercase tracking-wider text-ink-subtle mb-1.5 font-medium text-center">
          front
        </div>
        <PlanCardFront plan={plan} />
      </div>
      <div>
        <div className="print:hidden text-[10px] uppercase tracking-wider text-ink-subtle mb-1.5 font-medium text-center">
          back
        </div>
        <PlanCardBack plan={plan} />
      </div>
    </div>
  )
})

function PlanCardFront({ plan }: Props) {
  return (
    <div
      data-print="card-front"
      className="mx-auto bg-white text-ink font-serif relative border border-dashed border-ink-subtle/50 shadow-soft flex flex-col"
      style={{
        ...CARD_STYLE,
        padding: '0.12in 0.14in',
      }}
    >
      <header className="flex items-baseline justify-between">
        <div className="text-[9px] uppercase tracking-[0.18em] font-semibold text-ink truncate">
          PACE PLAN · {plan.displayName}
        </div>
        <span
          className="text-ink-subtle/70 shrink-0 ml-2"
          style={{ fontSize: '8px' }}
          aria-hidden
        >
          ✂
        </span>
      </header>
      <div className="text-[8px] text-ink-subtle mt-0.5">
        Prepared {formatDate(plan.planDate)}
      </div>
      <div className="border-t border-ink-subtle/25 mt-1.5" />

      <div className="flex-1 flex flex-col justify-between mt-1">
        {plan.tiers.map((tier, i) => (
          <CardTierRow key={tier.label} index={i + 1} tier={tier} />
        ))}
      </div>

      <div
        className="text-ink-subtle italic truncate"
        style={{ fontSize: '7.5px', marginTop: '2px' }}
      >
        {plan.responseWindow}
      </div>

      <footer className="text-[7.5px] text-ink-subtle italic mt-0.5 flex items-center gap-1">
        flip for contacts
        <span aria-hidden>↩</span>
      </footer>
    </div>
  )
}

function CardTierRow({ index, tier }: { index: number; tier: PlanTier }) {
  const primary = tier.channels[0]
  return (
    <div className="leading-tight">
      <div className="flex items-baseline gap-1.5">
        <span
          className="text-[9.5px] font-bold text-ink shrink-0"
          style={{ minWidth: '0.8em' }}
        >
          {index}
        </span>
        <span className="text-[10px] font-semibold text-ink flex-1 truncate">
          {primary.name}
        </span>
        <span className="text-[8px] text-ink-subtle shrink-0 truncate max-w-[40%]">
          {tier.ownerRole}
        </span>
      </div>
      <div
        className="text-[8px] text-ink-subtle italic truncate"
        style={{ marginLeft: '1.2em' }}
      >
        {tier.escalationTrigger}
      </div>
    </div>
  )
}

function PlanCardBack({ plan }: Props) {
  const columns = plan.contactRoster.columns.slice(0, 3)
  const practice = nextPracticeDate(plan.planDate, plan.drillSchedule.cadence)

  return (
    <div
      data-print="card-back"
      className="mx-auto bg-white text-ink font-serif relative border border-dashed border-ink-subtle/50 shadow-soft flex flex-col"
      style={{
        ...CARD_STYLE,
        padding: '0.12in 0.14in',
      }}
    >
      <header>
        <div className="text-[9px] uppercase tracking-[0.18em] font-semibold text-ink">
          Emergency contacts
        </div>
        <div className="text-[9px] text-ink truncate">{plan.displayName}</div>
      </header>
      <div className="border-t border-ink-subtle/25 mt-1" />

      <table className="flex-1 w-full text-[9px] mt-1.5 border-collapse">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                className="text-left font-medium text-ink-subtle pb-0.5 border-b border-ink-subtle/30"
                style={{ fontSize: '7.5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td
                  key={c}
                  className="border-b border-ink-subtle/20"
                  style={{ height: '0.22in' }}
                >
                  &nbsp;
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <footer className="text-[7.5px] text-ink-subtle mt-1 flex items-center justify-between">
        <span>Prepared {formatDate(plan.planDate)}</span>
        <span>
          Next practice: <span className="text-ink font-medium">{practice}</span>
        </span>
      </footer>
    </div>
  )
}
