import { forwardRef, useState } from 'react'
import type { PlanOutput, PlanTier } from '../../lib/schema'
import { Button } from '../ui/Button'
import { inputClass } from '../ui/Field'
import { EditableHeading } from './EditableHeading'

type Props = {
  plan: PlanOutput
  onUpdate?: (patch: Partial<PlanOutput>) => void
}

export const PlanDocument = forwardRef<HTMLDivElement, Props>(function PlanDocument(
  { plan, onUpdate },
  ref,
) {
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [draft, setDraft] = useState<PlanTier | null>(null)

  const canEdit = !!onUpdate

  const startEdit = (idx: number) => {
    if (!canEdit) return
    if (editingIdx !== null && editingIdx !== idx && draft) {
      const ok = window.confirm('Discard your unsaved edits on the other tier?')
      if (!ok) return
    }
    setEditingIdx(idx)
    setDraft({ ...plan.tiers[idx] })
  }

  const cancelEdit = () => {
    setEditingIdx(null)
    setDraft(null)
  }

  const saveEdit = () => {
    if (editingIdx === null || !draft || !onUpdate) return
    const nextTiers = plan.tiers.map((t, i) => (i === editingIdx ? draft : t))
    onUpdate({ tiers: nextTiers })
    setEditingIdx(null)
    setDraft(null)
  }

  const updateDraft = (patch: Partial<PlanTier>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d))
  }

  const updateDraftPrimaryChannel = (patch: { name?: string; rationale?: string }) => {
    setDraft((d) => {
      if (!d) return d
      const [first, ...rest] = d.channels
      return {
        ...d,
        channels: [{ ...first, ...patch }, ...rest],
      }
    })
  }

  return (
    <article
      ref={ref}
      data-print="document"
      className="font-serif bg-paper-card text-ink max-w-[780px] mx-auto p-10 md:p-14 shadow-soft border border-paper-edge rounded-md leading-relaxed"
    >
      <header className="border-b border-paper-edge pb-6 mb-8">
        <p className="text-[11px] tracking-[0.25em] uppercase text-ink-subtle mb-2">
          PACE Communications Plan
        </p>
        {canEdit ? (
          <EditableHeading
            value={plan.displayName}
            onSave={(next) => onUpdate?.({ displayName: next })}
            as="h1"
            className="text-3xl font-semibold text-ink"
            ariaLabel="Edit plan name"
          />
        ) : (
          <h1 className="text-3xl font-semibold text-ink">{plan.displayName}</h1>
        )}
        <p className="mt-3 text-ink-muted italic">{plan.missionEcho}</p>
        <p className="mt-4 text-sm text-ink-subtle">
          Prepared {formatDate(plan.planDate)}
        </p>
      </header>

      <section className="mb-10 space-y-8">
        <h2 className="text-xl font-semibold text-ink border-b border-paper-edge pb-2">
          The four tiers
        </h2>

        <div className="bg-paper border border-paper-edge rounded-md px-4 py-3 text-[15px]">
          <span className="text-ink-subtle italic">If you don't hear back:</span>{' '}
          <span className="text-ink">{plan.responseWindow}</span>
        </div>

        {plan.tiers.map((tier, i) => {
          const isEditing = editingIdx === i && draft !== null
          const view = isEditing && draft ? draft : tier
          const primary = view.channels[0]

          return (
            <div key={tier.label} className="space-y-3">
              <div className="flex items-baseline gap-3 justify-between">
                <div className="flex items-baseline gap-3">
                  <span className="text-[11px] tracking-[0.25em] uppercase text-ink-subtle">
                    Tier {i + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-ink">{tier.label}</h3>
                </div>
                {canEdit && !isEditing && (
                  <button
                    type="button"
                    data-print="hide"
                    onClick={() => startEdit(i)}
                    className="text-[11px] uppercase tracking-wider text-ink-subtle hover:text-signal transition font-sans"
                  >
                    ✎ Edit
                  </button>
                )}
              </div>

              {isEditing && draft ? (
                <div data-print="hide" className="space-y-3 bg-paper/60 border border-paper-edge rounded-md p-4 font-sans">
                  <EditField label="Primary channel">
                    <input
                      className={inputClass}
                      value={primary.name}
                      onChange={(e) => updateDraftPrimaryChannel({ name: e.target.value })}
                    />
                  </EditField>
                  <EditField label="Why this channel, for you">
                    <textarea
                      className={`${inputClass} min-h-20`}
                      value={primary.rationale}
                      onChange={(e) => updateDraftPrimaryChannel({ rationale: e.target.value })}
                    />
                  </EditField>
                  <EditField label="Owner">
                    <input
                      className={inputClass}
                      value={draft.ownerRole}
                      onChange={(e) => updateDraft({ ownerRole: e.target.value })}
                    />
                  </EditField>
                  <EditField label="Escalate when">
                    <input
                      className={inputClass}
                      value={draft.escalationTrigger}
                      onChange={(e) => updateDraft({ escalationTrigger: e.target.value })}
                      maxLength={80}
                    />
                  </EditField>
                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      onClick={saveEdit}
                      className="!px-4 !py-1.5 !text-sm"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={cancelEdit}
                      className="!px-3 !py-1.5 !text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    {view.channels.map((c, j) => (
                      <div key={j}>
                        <p className="text-ink">
                          <span className="font-semibold">{c.name}.</span>{' '}
                          <span className="text-ink-muted">{c.rationale}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-[15px]">
                    <dt className="text-ink-subtle">Owner</dt>
                    <dd className="text-ink">{view.ownerRole}</dd>
                    <dt className="text-ink-subtle">Escalate when</dt>
                    <dd className="text-ink">{view.escalationTrigger}</dd>
                    <dt className="text-ink-subtle">Failure modes</dt>
                    <dd className="text-ink">
                      <ul className="list-disc pl-5 space-y-0.5 marker:text-ink-subtle">
                        {view.failureModes.map((f, k) => (
                          <li key={k}>{f}</li>
                        ))}
                      </ul>
                    </dd>
                  </dl>
                </>
              )}
            </div>
          )
        })}
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-ink border-b border-paper-edge pb-2 mb-4">
          Activation checklist
        </h2>
        <div className="space-y-4">
          {plan.activationChecklist.map((entry) => (
            <div key={entry.tier}>
              <h3 className="font-semibold text-ink">{entry.tier}</h3>
              <ol className="list-decimal pl-6 text-ink-muted marker:text-ink-subtle space-y-1 mt-1">
                {entry.steps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-ink border-b border-paper-edge pb-2 mb-4">
          Contact roster
        </h2>
        <p className="text-sm text-ink-subtle mb-3">
          Fill in the contact details for the people in your plan and keep a printed copy on hand.
        </p>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {plan.contactRoster.columns.map((c) => (
                <th
                  key={c}
                  className="border border-paper-edge px-3 py-2 text-left font-semibold text-ink bg-paper"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, r) => (
              <tr key={r}>
                {plan.contactRoster.columns.map((c) => (
                  <td
                    key={c}
                    className="border border-paper-edge px-3 py-3 text-ink"
                  >
                    &nbsp;
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-ink border-b border-paper-edge pb-2 mb-4">
          Drill & test schedule
        </h2>
        <p className="text-ink">
          <span className="font-semibold">Cadence:</span>{' '}
          <span className="text-ink-muted">{plan.drillSchedule.cadence}</span>
        </p>
        <div className="mt-2">
          <p className="font-semibold text-ink mb-1">What to test</p>
          <ul className="list-disc pl-6 text-ink-muted marker:text-ink-subtle space-y-0.5">
            {plan.drillSchedule.whatToTest.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-ink border-b border-paper-edge pb-2 mb-4">
          Glossary
        </h2>
        <dl className="space-y-3">
          {plan.glossary.map((g) => (
            <div key={g.term}>
              <dt className="font-semibold text-ink">{g.term}</dt>
              <dd className="text-ink-muted">{g.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="mt-12 pt-5 border-t border-paper-edge text-xs text-ink-subtle text-center">
        Generated by PACEY · {plan.planDate}
      </footer>
    </article>
  )
})

function EditField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] uppercase tracking-wider text-ink-subtle font-medium">
        {label}
      </span>
      {children}
    </label>
  )
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}
