import { useWizardStore, type Persona, type WizardAnswers } from '../../../state/wizardStore'
import { Field, inputClass } from '../../ui/Field'
import { RadioGroup } from '../../ui/RadioGroup'

const PERSONAS = [
  {
    value: 'individual',
    label: 'Just me',
    hint: 'Staying reachable to the people who count on me.',
  },
  {
    value: 'household',
    label: 'My household',
    hint: 'Keeping everyone under one roof connected.',
  },
  {
    value: 'business',
    label: 'My business or organization',
    hint: 'Staying in touch with staff, members, or clients.',
  },
]

const ORG_TYPES = [
  { value: 'nonprofit', label: 'Nonprofit' },
  { value: 'small-business', label: 'Small business' },
  { value: 'faith', label: 'Faith community' },
  { value: 'neighborhood', label: 'Neighborhood / volunteer group' },
  { value: 'school', label: 'School or daycare' },
  { value: 'other', label: 'Other' },
]

export default function StepPersona() {
  const { answers, setAnswers } = useWizardStore()
  return (
    <div className="space-y-6">
      <Field label="Who is this plan for?" required>
        <RadioGroup
          name="persona"
          options={PERSONAS}
          value={answers.persona}
          onChange={(v) => setAnswers({ persona: v as Persona })}
        />
      </Field>

      {answers.persona === 'business' && (
        <Field label="What kind?" required>
          <select
            className={inputClass}
            value={answers.orgType}
            onChange={(e) => setAnswers({ orgType: e.target.value })}
          >
            <option value="">Choose one…</option>
            {ORG_TYPES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      )}
    </div>
  )
}

export function isPersonaValid(a: WizardAnswers) {
  if (!a.persona) return false
  if (a.persona === 'business') return !!a.orgType
  return true
}
