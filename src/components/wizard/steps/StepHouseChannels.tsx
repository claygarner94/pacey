import { useWizardStore, type WizardAnswers } from '../../../state/wizardStore'
import { CheckGroup } from '../../ui/CheckGroup'

type Group = {
  header: string
  options: { value: string; label: string }[]
}

const GROUPS: Group[] = [
  {
    header: 'Apps',
    options: [
      { value: 'family-chat', label: 'Family group chat (iMessage / WhatsApp / etc.)' },
      { value: 'shared-calendar', label: 'Shared calendar' },
      { value: 'email', label: 'Email' },
    ],
  },
  {
    header: 'Direct',
    options: [
      { value: 'sms', label: 'Text / SMS' },
      { value: 'phone', label: 'Phone calls' },
      { value: 'landline', label: 'A landline in the house' },
    ],
  },
  {
    header: 'In-person',
    options: [
      { value: 'bulletin', label: 'Fridge / whiteboard / family bulletin board' },
      { value: 'neighbor', label: 'A trusted neighbor or nearby family we can rely on' },
    ],
  },
]

export default function StepHouseChannels() {
  const { answers, setAnswers } = useWizardStore()

  return (
    <div className="space-y-7">
      <p className="text-sm text-ink-muted">
        Your current toolkit — what we'll build your fallback around.
      </p>
      {GROUPS.map((group) => {
        const groupValues = group.options.map((o) => o.value)
        return (
          <div key={group.header} className="space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-ink-subtle font-medium">
              {group.header}
            </div>
            <CheckGroup
              name={`house-channel-${group.header}`}
              options={group.options}
              value={answers.householdChannels.filter((v) =>
                groupValues.includes(v),
              )}
              onChange={(selected) => {
                const others = answers.householdChannels.filter(
                  (v) => !groupValues.includes(v),
                )
                setAnswers({ householdChannels: [...others, ...selected] })
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

export function isHouseChannelsValid(a: WizardAnswers) {
  return a.householdChannels.length > 0
}
