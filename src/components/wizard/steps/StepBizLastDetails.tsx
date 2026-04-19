import { useWizardStore, type WizardAnswers } from '../../../state/wizardStore'
import { Field, inputClass } from '../../ui/Field'
import { RadioGroup } from '../../ui/RadioGroup'

const BUDGETS = [
  { value: 'free', label: 'Free tools only' },
  { value: 'modest', label: 'Modest — up to a few hundred a year' },
  { value: 'invest', label: 'Willing to invest in the right tool' },
]

const TECH = [
  { value: 'low', label: 'Low — the team sticks to what they know' },
  { value: 'medium', label: 'Medium — can adopt new tools with some ramp' },
  { value: 'high', label: 'High — comfortable trying most tools' },
]

const SIZE_BANDS = [
  { value: '1-5', label: '1–5 people' },
  { value: '6-15', label: '6–15 people' },
  { value: '16-30', label: '16–30 people' },
  { value: '31-50', label: '31–50 people' },
]

export default function StepBizLastDetails() {
  const { answers, setAnswers } = useWizardStore()

  return (
    <div className="space-y-6">
      <Field label="Team size" required>
        <select
          className={inputClass}
          value={answers.sizeBand}
          onChange={(e) => setAnswers({ sizeBand: e.target.value })}
        >
          <option value="">Choose a size…</option>
          {SIZE_BANDS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Budget" hint="We'll only suggest tools that fit this." required>
        <RadioGroup
          name="budget"
          options={BUDGETS}
          value={answers.budget}
          onChange={(v) => setAnswers({ budget: v as typeof answers.budget })}
        />
      </Field>

      <Field label="Tech comfort across the team" required>
        <RadioGroup
          name="techComfort"
          options={TECH}
          value={answers.techComfort}
          onChange={(v) => setAnswers({ techComfort: v as typeof answers.techComfort })}
        />
      </Field>

      <Field label="Organization name" required htmlFor="displayName">
        <input
          id="displayName"
          className={inputClass}
          value={answers.displayName}
          onChange={(e) => setAnswers({ displayName: e.target.value })}
          placeholder="Maple Valley Food Pantry"
        />
      </Field>

      <Field
        label="Anything else we should know?"
        hint="Optional. Accessibility, language, one-off context."
        htmlFor="extraNotes"
      >
        <textarea
          id="extraNotes"
          className={`${inputClass} min-h-20`}
          value={answers.extraNotes}
          onChange={(e) => setAnswers({ extraNotes: e.target.value })}
          placeholder="Several older volunteers don't use smartphones; we serve Spanish-speaking families; we lose cell service in bad storms."
          maxLength={300}
        />
      </Field>
    </div>
  )
}

export function isBizLastDetailsValid(a: WizardAnswers) {
  return (
    !!a.sizeBand &&
    !!a.budget &&
    !!a.techComfort &&
    a.displayName.trim().length > 0
  )
}
