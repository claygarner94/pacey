import { useWizardStore, type WizardAnswers } from '../../../state/wizardStore'
import { Field, inputClass } from '../../ui/Field'
import { RadioGroup } from '../../ui/RadioGroup'

const BUDGETS = [
  { value: 'free', label: 'Free tools only', hint: 'No recurring spend.' },
  { value: 'modest', label: 'Modest', hint: 'Up to a few hundred a year.' },
  { value: 'invest', label: 'Willing to invest in the right tool', hint: 'Paid tools on the table.' },
]

const TECH = [
  { value: 'low', label: 'Low', hint: 'I stick to what I know.' },
  { value: 'medium', label: 'Medium', hint: 'I can pick up new tools.' },
  { value: 'high', label: 'High', hint: 'Happy to try anything.' },
]

type Props = {
  showExtraNotes?: boolean
  extraNotesPlaceholder?: string
}

export default function StepBudgetComfort({
  showExtraNotes = false,
  extraNotesPlaceholder = '',
}: Props) {
  const { answers, setAnswers } = useWizardStore()
  return (
    <div className="space-y-6">
      <Field
        label="Budget"
        hint="We'll only suggest tools that fit this."
        required
      >
        <RadioGroup
          name="budget"
          options={BUDGETS}
          value={answers.budget}
          onChange={(v) => setAnswers({ budget: v as typeof answers.budget })}
        />
      </Field>

      <Field label="Tech comfort" required>
        <RadioGroup
          name="techComfort"
          options={TECH}
          value={answers.techComfort}
          onChange={(v) => setAnswers({ techComfort: v as typeof answers.techComfort })}
        />
      </Field>

      {showExtraNotes && (
        <Field
          label="Anything else we should know?"
          hint="Optional. Accessibility, language, one-off context — all the same kind of thing."
          htmlFor="extraNotes"
        >
          <textarea
            id="extraNotes"
            className={`${inputClass} min-h-20`}
            value={answers.extraNotes}
            onChange={(e) => setAnswers({ extraNotes: e.target.value })}
            placeholder={extraNotesPlaceholder}
            maxLength={300}
          />
        </Field>
      )}
    </div>
  )
}

export function StepIndivBudget() {
  return <StepBudgetComfort showExtraNotes={false} />
}

export function StepHouseBudget() {
  return (
    <StepBudgetComfort
      showExtraNotes
      extraNotesPlaceholder="Grandma has hearing loss, the kids don't have phones yet, we speak Spanish at home."
    />
  )
}

export function isBudgetComfortValid(a: WizardAnswers) {
  return !!a.budget && !!a.techComfort
}
