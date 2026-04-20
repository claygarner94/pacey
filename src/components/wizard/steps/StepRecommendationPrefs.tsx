import { useWizardStore, type WizardAnswers } from '../../../state/wizardStore'
import { Field } from '../../ui/Field'
import { RadioGroup } from '../../ui/RadioGroup'

const BUDGETS = [
  { value: 'free', label: 'Free tools only', hint: 'No recurring spend.' },
  { value: 'modest', label: 'Modest', hint: 'A small paid tool is okay if it solves a real problem.' },
  { value: 'invest', label: 'Willing to invest', hint: 'A stronger paid option is on the table.' },
]

const TECH = [
  { value: 'low', label: 'Low', hint: 'Stick to familiar tools and very simple workflows.' },
  { value: 'medium', label: 'Medium', hint: 'Can adopt a small process change with some ramp.' },
  { value: 'high', label: 'High', hint: 'Comfortable with more advanced tools and processes.' },
]

export default function StepRecommendationPrefs() {
  const { answers, setAnswers } = useWizardStore()

  return (
    <div className="space-y-6">
      <Field
        label="Budget"
        hint="Optional. This only shapes AI review and improvement suggestions."
      >
        <RadioGroup
          name="budget"
          options={BUDGETS}
          value={answers.budget}
          onChange={(v) => setAnswers({ budget: v as typeof answers.budget })}
        />
      </Field>

      <Field
        label="Tech comfort"
        hint="Optional. AI should not recommend a plan your people will not actually use."
      >
        <RadioGroup
          name="techComfort"
          options={TECH}
          value={answers.techComfort}
          onChange={(v) => setAnswers({ techComfort: v as typeof answers.techComfort })}
        />
      </Field>

      <Field
        label="Context for AI review"
        hint="Optional. Accessibility, language, location, age, operating constraints, or anything else that matters."
        htmlFor="extraNotes"
      >
        <textarea
          id="extraNotes"
          className="w-full rounded-lg border border-paper-edge bg-paper-card px-3 py-2 text-ink placeholder:text-ink-subtle focus:border-signal focus:outline-none min-h-24"
          value={answers.extraNotes}
          onChange={(e) => setAnswers({ extraNotes: e.target.value })}
          placeholder="Cell service drops in storms, one volunteer only uses a flip phone, we prefer bilingual instructions."
          maxLength={320}
        />
      </Field>
    </div>
  )
}

export function isRecommendationPrefsValid(_: WizardAnswers) {
  return true
}
