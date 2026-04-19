import { useWizardStore, type WizardAnswers } from '../../../state/wizardStore'
import { Field } from '../../ui/Field'
import { CheckGroup } from '../../ui/CheckGroup'

const PAIRS = [
  { value: 'leader-staff', label: 'Leadership ↔ staff' },
  { value: 'staff-volunteers', label: 'Staff ↔ volunteers' },
  { value: 'org-members', label: 'Org ↔ members / clients / people you serve' },
  { value: 'staff-board', label: 'Staff ↔ board' },
  { value: 'org-vendors', label: 'Org ↔ key vendors or partner agencies' },
  { value: 'org-funders', label: 'Org ↔ funders or regulators' },
]

export default function StepBizReach() {
  const { answers, setAnswers } = useWizardStore()
  return (
    <div className="space-y-6">
      <Field
        label="Who needs to stay in touch during a disruption?"
        hint="Leadership ↔ staff is the default backbone. Add what else applies."
        required
      >
        <CheckGroup
          name="reachPairs"
          options={PAIRS}
          value={answers.reachPairs}
          onChange={(v) => setAnswers({ reachPairs: v })}
        />
      </Field>
    </div>
  )
}

export function isBizReachValid(a: WizardAnswers) {
  return a.reachPairs.length > 0
}
