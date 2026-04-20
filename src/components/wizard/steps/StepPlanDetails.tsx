import { useWizardStore, type WizardAnswers } from '../../../state/wizardStore'
import { Field, inputClass } from '../../ui/Field'

function placeholderFor(persona: WizardAnswers['persona']) {
  if (persona === 'household') return 'Our household PACE card'
  if (persona === 'business') return 'Maple Valley Pantry comms matrix'
  return 'My personal PACE card'
}

function subtitlePlaceholder(persona: WizardAnswers['persona']) {
  if (persona === 'household') {
    return 'A family fallback plan for school, work, and home routines.'
  }
  if (persona === 'business') {
    return 'Critical relationships we need to keep connected during a disruption.'
  }
  return 'A direct fallback plan for the people who most need to reach me.'
}

export default function StepPlanDetails() {
  const { answers, setAnswers } = useWizardStore()

  return (
    <div className="space-y-6">
      <Field
        label="Plan name"
        hint="This title appears on the worksheet and wallet card."
        required
        htmlFor="displayName"
      >
        <input
          id="displayName"
          className={inputClass}
          value={answers.displayName}
          onChange={(e) => setAnswers({ displayName: e.target.value })}
          placeholder={placeholderFor(answers.persona)}
        />
      </Field>

      <Field
        label="Short subtitle"
        hint="Optional. One line that says what this matrix is for."
        htmlFor="ownerContext"
      >
        <textarea
          id="ownerContext"
          className={`${inputClass} min-h-24`}
          value={answers.ownerContext}
          onChange={(e) => setAnswers({ ownerContext: e.target.value })}
          placeholder={subtitlePlaceholder(answers.persona)}
          maxLength={220}
        />
      </Field>
    </div>
  )
}

export function isPlanDetailsValid(a: WizardAnswers) {
  return a.displayName.trim().length > 0
}
