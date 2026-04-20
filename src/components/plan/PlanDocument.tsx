import { forwardRef } from 'react'
import type { PlanOutput, PaceMethod } from '../../lib/schema'
import { nextPracticeDate } from '../../lib/practiceDate'

type Props = {
  plan: PlanOutput
}

export const PlanDocument = forwardRef<HTMLDivElement, Props>(function PlanDocument(
  { plan },
  ref,
) {
  const practice = nextPracticeDate(plan.planDate, plan.drillCadence)

  return (
    <article
      ref={ref}
      data-print="document"
      className="bg-paper-card text-ink max-w-[980px] mx-auto p-8 md:p-12 shadow-soft border border-paper-edge rounded-2xl space-y-10"
    >
      <header className="border-b border-paper-edge pb-6 space-y-3">
        <p className="text-[11px] tracking-[0.25em] uppercase text-ink-subtle">
          PACE Matrix Worksheet
        </p>
        <h1 className="text-3xl font-semibold text-ink">{plan.displayName}</h1>
        <p className="text-ink-muted max-w-3xl">{plan.ownerContext}</p>
        <div className="flex flex-wrap gap-6 text-sm text-ink-subtle">
          <span>Prepared {formatDate(plan.planDate)}</span>
          <span>Drill cadence: {plan.drillCadence}</span>
          <span>Next practice: {practice}</span>
        </div>
      </header>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-ink">PACE rows</h2>
          <p className="text-sm text-ink-muted">
            This is the plan. Each row is a real relationship or audience, and each
            column is the fallback ladder you actually intend to use.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-paper-edge">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead>
              <tr className="bg-paper">
                {[
                  'Audience',
                  'Contact',
                  'Primary',
                  'Alternate',
                  'Contingency',
                  'Emergency',
                  'Escalate',
                ].map((label) => (
                  <th
                    key={label}
                    className="border-b border-paper-edge px-3 py-3 text-left font-semibold text-ink"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {plan.rows.map((row) => (
                <tr key={`${row.audienceLabel}-${row.contactLabel}`} className="align-top">
                  <td className="border-t border-paper-edge px-3 py-3 font-medium text-ink">
                    {row.audienceLabel}
                  </td>
                  <td className="border-t border-paper-edge px-3 py-3 text-ink-muted">
                    {row.contactLabel}
                  </td>
                  <td className="border-t border-paper-edge px-3 py-3">
                    <MethodCell entry={row.primary} />
                  </td>
                  <td className="border-t border-paper-edge px-3 py-3">
                    <MethodCell entry={row.alternate} />
                  </td>
                  <td className="border-t border-paper-edge px-3 py-3">
                    <MethodCell entry={row.contingency} />
                  </td>
                  <td className="border-t border-paper-edge px-3 py-3">
                    <MethodCell entry={row.emergency} />
                  </td>
                  <td className="border-t border-paper-edge px-3 py-3 text-ink-muted">
                    {row.escalateAfter}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-ink">Row details</h2>
          <p className="text-sm text-ink-muted">
            Keep short notes, dependencies, and reminders here so the card stays compact.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {plan.rows.map((row) => (
            <article
              key={`${row.audienceLabel}-${row.contactLabel}-details`}
              className="rounded-xl border border-paper-edge bg-paper p-4 space-y-3"
            >
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-subtle">
                  {row.audienceLabel}
                </p>
                <h3 className="text-lg font-semibold text-ink">{row.contactLabel}</h3>
              </div>
              <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-1 text-sm">
                <dt className="text-ink-subtle">Escalate</dt>
                <dd className="text-ink">{row.escalateAfter}</dd>
                <dt className="text-ink-subtle">Notes</dt>
                <dd className="text-ink-muted">
                  {row.notes || 'No extra notes recorded for this row.'}
                </dd>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-ink">Practice checklist</h2>
          <p className="text-sm text-ink-muted">
            Treat this like a live worksheet. Print it, confirm it, and rehearse it.
          </p>
        </div>
        <ul className="list-disc pl-6 text-ink-muted marker:text-ink-subtle space-y-1">
          <li>Confirm every contact label is still right and privacy-safe.</li>
          <li>Test one Alternate or Contingency method for each row on your next practice date.</li>
          <li>Keep the wallet card where the right people can reach it when the primary method fails.</li>
        </ul>
      </section>

      <footer className="pt-5 border-t border-paper-edge text-xs text-ink-subtle text-center">
        Built from your own PACE rows · {plan.planDate}
      </footer>
    </article>
  )
})

function MethodCell({ entry }: { entry: PaceMethod }) {
  return (
    <div className="space-y-1">
      <div className="font-medium text-ink">{entry.method}</div>
      {entry.detail && <div className="text-ink-muted">{entry.detail}</div>}
    </div>
  )
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}
