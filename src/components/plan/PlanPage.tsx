import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { autoDisplayName, useWizardStore } from '../../state/wizardStore'
import { buildPlan } from '../../lib/planBuilder'
import { reviewPlan } from '../../lib/api'
import { usePageTitle } from '../../lib/usePageTitle'
import type {
  PlanOutput,
  RecommendationItem,
  RecommendationOutput,
} from '../../lib/schema'
import { PlanDocument } from './PlanDocument'
import { PlanCard } from './PlanCard'
import { PlanActions } from './PlanActions'
import { RecommendationsPanel } from './RecommendationsPanel'

type RecommendationStatus =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; data: RecommendationOutput }

export type PlanView = 'worksheet' | 'card' | 'recommendations'

export default function PlanPage() {
  usePageTitle('Your plan')
  const answers = useWizardStore((s) => s.answers)
  const basePlan = useMemo(() => buildPlan(answers), [answers])
  const [plan, setPlan] = useState<PlanOutput>(basePlan)
  const [view, setView] = useState<PlanView>('worksheet')
  const [recommendations, setRecommendations] = useState<RecommendationStatus>({
    kind: 'idle',
  })
  const [appliedKeys, setAppliedKeys] = useState<string[]>([])
  const docRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const hasAnswers =
    !!answers.persona &&
    answers.rows.length > 0 &&
    !!(answers.displayName.trim() || autoDisplayName(answers))

  useEffect(() => {
    setPlan(basePlan)
    setAppliedKeys([])
  }, [basePlan])

  const requestReview = async () => {
    setRecommendations({ kind: 'loading' })
    const result = await reviewPlan(plan, answers)
    if (result.ok) {
      setRecommendations({ kind: 'ready', data: result.recommendations })
      setAppliedKeys([])
    } else {
      setRecommendations({ kind: 'error', message: result.error })
    }
  }

  const canApplyRecommendation = (item: RecommendationItem) => {
    const key = itemKey(item)
    if (appliedKeys.includes(key)) return false
    if (!item.targetAudience || !item.targetField) return false
    const row = plan.rows.find((candidate) => candidate.audienceLabel === item.targetAudience)
    if (!row) return false
    if (
      item.targetField === 'primary' ||
      item.targetField === 'alternate' ||
      item.targetField === 'contingency' ||
      item.targetField === 'emergency'
    ) {
      return !!item.proposedMethod
    }
    return !!item.proposedText
  }

  const applyRecommendation = (item: RecommendationItem) => {
    if (!canApplyRecommendation(item) || !item.targetAudience || !item.targetField) return

    setPlan((current) => ({
      ...current,
      rows: current.rows.map((row) => {
        if (row.audienceLabel !== item.targetAudience) return row

        if (
          item.targetField === 'primary' ||
          item.targetField === 'alternate' ||
          item.targetField === 'contingency' ||
          item.targetField === 'emergency'
        ) {
          return {
            ...row,
            [item.targetField]: {
              method: item.proposedMethod ?? row[item.targetField].method,
              detail: item.proposedDetail ?? row[item.targetField].detail,
            },
          }
        }

        if (item.targetField === 'escalateAfter') {
          return {
            ...row,
            escalateAfter: item.proposedText ?? row.escalateAfter,
          }
        }

        return {
          ...row,
          notes: item.proposedText ?? row.notes,
        }
      }),
    }))

    setAppliedKeys((current) => [...current, itemKey(item)])
  }

  if (!hasAnswers) return <Navigate to="/" replace />

  return (
    <main className="min-h-screen bg-paper">
      <PlanActions
        plan={plan}
        docRef={docRef}
        cardRef={cardRef}
        view={view}
        onShowCard={() => setView('card')}
        onShowWorksheet={() => setView('worksheet')}
      />

      <div data-print="hide" className="max-w-[980px] mx-auto px-4 pt-5">
        <div className="inline-flex rounded-full border border-paper-edge bg-paper-card p-1 gap-0.5">
          <ViewTab active={view === 'worksheet'} onClick={() => setView('worksheet')}>
            PACE worksheet
          </ViewTab>
          <ViewTab active={view === 'card'} onClick={() => setView('card')}>
            Wallet card
          </ViewTab>
          <ViewTab
            active={view === 'recommendations'}
            onClick={() => setView('recommendations')}
          >
            Recommendations
          </ViewTab>
        </div>
      </div>

      <div className="py-6 px-4">
        {view === 'card' ? (
          <div className="space-y-4">
            <div
              data-print="hide"
              className="max-w-[720px] mx-auto rounded-2xl border border-paper-edge bg-paper-card px-4 py-3 text-sm text-ink-muted"
            >
              This is a compact carry card, not the full worksheet. It shows only the
              first 2 rows and keeps the detailed notes in the worksheet.
            </div>
            <PlanCard ref={cardRef} plan={plan} />
          </div>
        ) : view === 'recommendations' ? (
          <RecommendationsPanel
            status={recommendations}
            onReview={requestReview}
            onApply={applyRecommendation}
            canApply={canApplyRecommendation}
          />
        ) : (
          <PlanDocument ref={docRef} plan={plan} />
        )}
      </div>
    </main>
  )
}

function ViewTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 text-sm rounded-full transition ${
        active
          ? 'bg-ink text-paper shadow-soft'
          : 'text-ink-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function itemKey(item: RecommendationItem) {
  return [item.title, item.targetAudience, item.targetField, item.proposedMethod, item.proposedText]
    .filter(Boolean)
    .join('::')
}
