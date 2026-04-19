import { useWizardStore, type WizardAnswers } from '../../../state/wizardStore'
import { Field } from '../../ui/Field'
import { CheckGroup } from '../../ui/CheckGroup'

const CHANNELS = [
  { value: 'imessage-whatsapp', label: 'iMessage / WhatsApp / Signal' },
  { value: 'sms', label: 'Text / SMS' },
  { value: 'phone', label: 'Phone calls' },
  { value: 'email', label: 'Email' },
  { value: 'landline', label: 'A landline (yours or someone close)' },
  { value: 'in-person', label: 'In-person (you see them regularly)' },
]

const LIFE_CONTEXT = [
  { value: 'travel', label: 'I travel for work or family' },
  { value: 'spotty-cell', label: 'My cell service is spotty where I live' },
  { value: 'laptop-day', label: "I'm on my laptop most of the day" },
  { value: 'shared-custody', label: 'I share custody of kids' },
  { value: 'only-adult', label: "I'm often the only adult reachable for someone" },
]

export default function StepIndivSetup() {
  const { answers, setAnswers } = useWizardStore()
  return (
    <div className="space-y-6">
      <Field label="What do you use most?" required>
        <CheckGroup
          name="individualChannels"
          options={CHANNELS}
          value={answers.individualChannels}
          onChange={(v) => setAnswers({ individualChannels: v })}
        />
      </Field>

      <Field
        label="Which of these is true about your life?"
        hint="Optional. Any that apply."
      >
        <CheckGroup
          name="lifeContext"
          options={LIFE_CONTEXT}
          value={answers.lifeContext}
          onChange={(v) => setAnswers({ lifeContext: v })}
        />
      </Field>
    </div>
  )
}

export function isIndivSetupValid(a: WizardAnswers) {
  return a.individualChannels.length > 0
}
