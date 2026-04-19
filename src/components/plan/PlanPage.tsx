import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useWizardStore } from '../../state/wizardStore'
import { generatePlan } from '../../lib/api'
import { usePageTitle } from '../../lib/usePageTitle'
import type { PlanOutput } from '../../lib/schema'
import { Generating } from './Generating'
import { PlanDocument } from './PlanDocument'
import { PlanCard } from './PlanCard'
import { PlanActions } from './PlanActions'
import { Button } from '../ui/Button'

type Status =
  | { kind: 'loading' }
  | { kind: 'ready'; plan: PlanOutput }
  | { kind: 'error'; message: string }

export type PlanView = 'card' | 'document'

export default function PlanPage() {
  usePageTitle('Your plan')
  const navigate = useNavigate()
  const answers = useWizardStore((s) => s.answers)
  const [status, setStatus] = useState<Status>({ kind: 'loading' })
  const [view, setView] = useState<PlanView>('document')
  const docRef = useRef<HTMLDivElement | null>(null)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const hasAnswers = !!answers.persona && !!answers.displayName

  const run = useCallback(async () => {
    setStatus({ kind: 'loading' })
    setView('document')
    const result = await generatePlan(answers)
    if (result.ok) setStatus({ kind: 'ready', plan: result.plan })
    else setStatus({ kind: 'error', message: result.error })
  }, [answers])

  const updatePlan = useCallback((patch: Partial<PlanOutput>) => {
    setStatus((s) =>
      s.kind === 'ready' ? { ...s, plan: { ...s.plan, ...patch } } : s,
    )
  }, [])

  useEffect(() => {
    if (hasAnswers) void run()
  }, [hasAnswers, run])

  if (!hasAnswers) return <Navigate to="/" replace />

  if (status.kind === 'loading') {
    return (
      <main className="min-h-screen">
        <Generating />
      </main>
    )
  }

  if (status.kind === 'error') {
    return (
      <main className="min-h-screen grid place-items-center px-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold">Something went wrong</h1>
          <p className="text-ink-muted">{status.message}</p>
          <div className="flex gap-2 justify-center pt-2">
            <Button variant="secondary" onClick={() => navigate('/wizard')}>
              Edit answers
            </Button>
            <Button onClick={run}>Try again</Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-paper">
      <PlanActions
        plan={status.plan}
        docRef={docRef}
        cardRef={cardRef}
        view={view}
        onRegenerate={run}
        onMakeCard={() => setView('card')}
      />

      <div data-print="hide" className="max-w-3xl mx-auto px-4 pt-5">
        <div className="inline-flex rounded-full border border-paper-edge bg-paper-card p-1 gap-0.5">
          <ViewTab active={view === 'document'} onClick={() => setView('document')}>
            Full plan
          </ViewTab>
          <ViewTab active={view === 'card'} onClick={() => setView('card')}>
            Wallet card
          </ViewTab>
        </div>
      </div>

      <div className="py-6 px-4">
        {view === 'card' ? (
          <PlanCard ref={cardRef} plan={status.plan} />
        ) : (
          <PlanDocument ref={docRef} plan={status.plan} onUpdate={updatePlan} />
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
