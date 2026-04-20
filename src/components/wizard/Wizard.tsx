import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useWizardStore,
  autoDisplayName,
  type WizardAnswers,
} from '../../state/wizardStore'
import { usePageTitle } from '../../lib/usePageTitle'
import { Progress } from './Progress'
import { Button } from '../ui/Button'

import StepPersona, { isPersonaValid } from './steps/StepPersona'
import StepAudienceRows, { isAudienceRowsValid } from './steps/StepAudienceRows'
import StepPlanDetails, { isPlanDetailsValid } from './steps/StepPlanDetails'
import StepRecommendationPrefs, {
  isRecommendationPrefsValid,
} from './steps/StepRecommendationPrefs'

type StepDef = {
  title: string
  subtitle: string
  component: ComponentType
  isValid: (a: WizardAnswers) => boolean
}

const STEPS: StepDef[] = [
  {
    title: 'Who is this plan for?',
    subtitle: 'This sets the audience and helper labels for your PACE matrix.',
    component: StepPersona,
    isValid: isPersonaValid,
  },
  {
    title: 'Build your PACE rows',
    subtitle: 'Add the people or relationships that most need a clear fallback path.',
    component: StepAudienceRows,
    isValid: isAudienceRowsValid,
  },
  {
    title: 'Name and frame the plan',
    subtitle: 'Give the worksheet and wallet card a title and short subtitle.',
    component: StepPlanDetails,
    isValid: isPlanDetailsValid,
  },
  {
    title: 'Optional AI review context',
    subtitle: 'This does not build your plan. It only helps the recommendation panel critique it.',
    component: StepRecommendationPrefs,
    isValid: isRecommendationPrefsValid,
  },
]

export default function Wizard() {
  usePageTitle('Build your plan')
  const navigate = useNavigate()
  const answers = useWizardStore((s) => s.answers)
  const setAnswers = useWizardStore((s) => s.setAnswers)
  const [stepIdx, setStepIdx] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const steps = useMemo(() => STEPS, [])
  const safeIdx = Math.min(stepIdx, steps.length - 1)
  const step = steps[safeIdx]
  const StepComponent = step.component
  const canAdvance = step.isValid(answers)
  const isLast = safeIdx === steps.length - 1
  const isFirst = safeIdx === 0
  const currentStep = safeIdx + 1
  const completedSteps = safeIdx

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const firstField = sectionRef.current?.querySelector<HTMLElement>(
      'input, select, textarea, button',
    )
    firstField?.focus({ preventScroll: true })
  }, [safeIdx])

  const goBack = () => {
    if (isFirst) navigate('/')
    else setStepIdx((i) => Math.max(0, i - 1))
  }

  const goNext = () => {
    if (!canAdvance) return
    if (isLast) {
      const autoName = autoDisplayName(answers)
      if (autoName && autoName !== answers.displayName) {
        setAnswers({ displayName: autoName })
      }
      navigate('/plan')
    } else {
      setStepIdx((i) => i + 1)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    goNext()
  }

  return (
    <main className="min-h-screen py-6 px-4">
      <nav className="max-w-3xl mx-auto mb-6">
        <Link
          to="/"
          aria-label="Back to home"
          className="inline-flex items-center gap-2 group"
        >
          <img
            src="/pacey-mascot.png"
            alt=""
            width={55}
            height={55}
            className="size-[55px] group-hover:-rotate-6 transition-transform"
          />
          <span className="font-semibold tracking-tight text-base text-ink">
            PACEY<span className="text-signal">.</span>
          </span>
        </Link>
      </nav>
      <form onSubmit={onSubmit} className="max-w-3xl mx-auto space-y-8">
        <Progress current={currentStep} completed={completedSteps} total={steps.length} />

        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">{step.title}</h1>
          <p className="text-ink-muted">{step.subtitle}</p>
        </header>

        <section ref={sectionRef}>
          <StepComponent />
        </section>

        <footer className="flex items-center justify-between pt-4 border-t border-paper-edge">
          <Button type="button" variant="ghost" onClick={goBack}>
            ← {isFirst ? 'Home' : 'Back'}
          </Button>
          <Button type="submit" disabled={!canAdvance}>
            {isLast ? 'Build my plan →' : 'Next →'}
          </Button>
        </footer>
      </form>
    </main>
  )
}
