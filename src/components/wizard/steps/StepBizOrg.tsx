import { useWizardStore, type OperatingMode, type WizardAnswers } from '../../../state/wizardStore'
import { Field, inputClass } from '../../ui/Field'
import { RadioGroup } from '../../ui/RadioGroup'

const MODES: { value: OperatingMode; label: string; hint?: string }[] = [
  {
    value: 'in-person',
    label: 'We serve people in person',
    hint: 'Clients, members, or congregants come to us.',
  },
  {
    value: 'office-based',
    label: "We're mostly office-based",
    hint: 'Desks, computers, internal work.',
  },
  {
    value: 'field-work',
    label: 'We do field work',
    hint: 'We go to clients, volunteers, or sites.',
  },
  {
    value: 'hybrid',
    label: 'Hybrid — a real mix of the above',
  },
]

function placeholderFor(orgType: string) {
  if (orgType === 'small-business')
    return 'We run a neighborhood dental practice with 8 staff.'
  if (orgType === 'faith')
    return 'Small Baptist church, about 180 members, active youth program.'
  if (orgType === 'school')
    return 'After-school program for grades K–5, 40 kids, 6 staff.'
  if (orgType === 'neighborhood')
    return 'We organize block watch and emergency-prep for about 60 households.'
  return 'We distribute groceries to families in the Maple Valley area twice a week.'
}

export default function StepBizOrg() {
  const { answers, setAnswers } = useWizardStore()
  return (
    <div className="space-y-6">
      <Field
        label="Describe what your organization does"
        hint="A sentence or two. This is what makes the plan feel like it's for you."
        required
        htmlFor="orgDescription"
      >
        <textarea
          id="orgDescription"
          className={`${inputClass} min-h-24`}
          value={answers.orgDescription}
          onChange={(e) => setAnswers({ orgDescription: e.target.value })}
          placeholder={placeholderFor(answers.orgType)}
          maxLength={400}
        />
      </Field>

      <Field label="How does your org mostly operate?" required>
        <RadioGroup
          name="operatingMode"
          options={MODES}
          value={answers.operatingMode}
          onChange={(v) => setAnswers({ operatingMode: v as OperatingMode })}
        />
      </Field>
    </div>
  )
}

export function isBizOrgValid(a: WizardAnswers) {
  return a.orgDescription.trim().length >= 20 && !!a.operatingMode
}
