import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useWizardStore,
  autoDisplayName,
  type Persona,
  type WizardAnswers,
} from '../../state/wizardStore'
import { usePageTitle } from '../../lib/usePageTitle'
import { Progress } from './Progress'
import { Button } from '../ui/Button'

import StepPersona, { isPersonaValid } from './steps/StepPersona'
import StepIndivPeople, { isIndivPeopleValid } from './steps/StepIndivPeople'
import StepIndivSetup, { isIndivSetupValid } from './steps/StepIndivSetup'
import {
  StepIndivBudget,
  StepHouseBudget,
  isBudgetComfortValid,
} from './steps/StepBudgetComfort'
import StepHouseMembers, { isHouseMembersValid } from './steps/StepHouseMembers'
import StepHouseChannels, { isHouseChannelsValid } from './steps/StepHouseChannels'
import StepBizOrg, { isBizOrgValid } from './steps/StepBizOrg'
import StepBizReach, { isBizReachValid } from './steps/StepBizReach'
import StepBizStackStakes, { isBizStackStakesValid } from './steps/StepBizStackStakes'
import StepBizLastDetails, { isBizLastDetailsValid } from './steps/StepBizLastDetails'

type StepDef = {
  title: string
  subtitle: string
  component: ComponentType
  isValid: (a: WizardAnswers) => boolean
}

const PERSONA_STEP: StepDef = {
  title: 'Who is this plan for?',
  subtitle: 'This shapes how we build your fallback.',
  component: StepPersona,
  isValid: isPersonaValid,
}

const INDIVIDUAL_STEPS: StepDef[] = [
  {
    title: 'Who are you staying reachable to?',
    subtitle: "Pick the people or groups that matter most. We'll build your fallback around them.",
    component: StepIndivPeople,
    isValid: isIndivPeopleValid,
  },
  {
    title: 'How do you stay in touch today?',
    subtitle: 'So we know what to fall back from.',
    component: StepIndivSetup,
    isValid: isIndivSetupValid,
  },
  {
    title: 'A few more questions',
    subtitle: "We'll only suggest tools that fit this.",
    component: StepIndivBudget,
    isValid: isBudgetComfortValid,
  },
]

const HOUSEHOLD_STEPS: StepDef[] = [
  {
    title: "Who's in your household?",
    subtitle: 'Add the people this plan needs to cover.',
    component: StepHouseMembers,
    isValid: isHouseMembersValid,
  },
  {
    title: 'How does your household stay in touch?',
    subtitle: "Your current toolkit — what we'll build your fallback around.",
    component: StepHouseChannels,
    isValid: isHouseChannelsValid,
  },
  {
    title: 'A few more questions',
    subtitle: "We'll only suggest tools that fit this.",
    component: StepHouseBudget,
    isValid: isBudgetComfortValid,
  },
]

const BUSINESS_STEPS: StepDef[] = [
  {
    title: 'What does your organization do?',
    subtitle: "A sentence or two so this feels like a plan for you, not a template.",
    component: StepBizOrg,
    isValid: isBizOrgValid,
  },
  {
    title: 'Who needs to stay in touch during a disruption?',
    subtitle: 'The relationships your plan has to protect.',
    component: StepBizReach,
    isValid: isBizReachValid,
  },
  {
    title: "How you communicate today, and what's at stake",
    subtitle: 'Two quick questions.',
    component: StepBizStackStakes,
    isValid: isBizStackStakesValid,
  },
  {
    title: 'A few more questions',
    subtitle: 'Helps us right-size the plan.',
    component: StepBizLastDetails,
    isValid: isBizLastDetailsValid,
  },
]

function stepsFor(persona: Persona): StepDef[] {
  if (persona === 'individual') return [PERSONA_STEP, ...INDIVIDUAL_STEPS]
  if (persona === 'household') return [PERSONA_STEP, ...HOUSEHOLD_STEPS]
  if (persona === 'business') return [PERSONA_STEP, ...BUSINESS_STEPS]
  return [PERSONA_STEP]
}

export default function Wizard() {
  usePageTitle('Build your plan')
  const navigate = useNavigate()
  const answers = useWizardStore((s) => s.answers)
  const setAnswers = useWizardStore((s) => s.setAnswers)
  const [stepIdx, setStepIdx] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  const steps = useMemo(() => stepsFor(answers.persona), [answers.persona])
  const safeIdx = Math.min(stepIdx, steps.length - 1)
  const step = steps[safeIdx]
  const StepComponent = step.component
  const canAdvance = step.isValid(answers)
  const isLast = safeIdx === steps.length - 1
  const isFirst = safeIdx === 0

  useEffect(() => {
    // Reset step index if we've navigated back to persona step and the persona changed.
    if (safeIdx !== stepIdx) setStepIdx(safeIdx)
  }, [safeIdx, stepIdx])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const firstField = sectionRef.current?.querySelector<HTMLElement>(
      'input, select, textarea',
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
      <nav className="max-w-2xl mx-auto mb-6">
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
      <form onSubmit={onSubmit} className="max-w-2xl mx-auto space-y-8">
        <Progress current={safeIdx + 1} total={steps.length} />

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
            {isLast ? 'Generate my plan →' : 'Next →'}
          </Button>
        </footer>
      </form>
    </main>
  )
}
