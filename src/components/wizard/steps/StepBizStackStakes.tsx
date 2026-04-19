import {
  useWizardStore,
  type ContinuityStake,
  type WizardAnswers,
} from '../../../state/wizardStore'
import { Field } from '../../ui/Field'
import { CheckGroup } from '../../ui/CheckGroup'

type Group = {
  header: string
  options: { value: string; label: string }[]
}

const CHANNEL_GROUPS: Group[] = [
  {
    header: 'Apps',
    options: [
      { value: 'group-chat', label: 'Group chat (Slack, Teams, WhatsApp, GroupMe)' },
      { value: 'email', label: 'Email' },
      { value: 'website', label: 'Website or newsletter' },
      { value: 'social', label: 'Social media' },
    ],
  },
  {
    header: 'Direct',
    options: [
      { value: 'sms', label: 'Text / SMS' },
      { value: 'phone', label: 'Phone calls' },
      { value: 'phone-tree', label: 'A staff phone tree or contact list' },
    ],
  },
  {
    header: 'In-person / physical',
    options: [
      { value: 'bulletin', label: 'Bulletin board, posted notices, or in-person huddles' },
      { value: 'partner-space', label: 'A partner org or nearby space we can use' },
    ],
  },
]

const STAKES: { value: ContinuityStake; label: string }[] = [
  {
    value: 'safety-critical',
    label: 'Someone we serve could be harmed (missed meals, medication, safety risk, unsupervised kids)',
  },
  {
    value: 'revenue-impacting',
    label: "We'd lose real revenue or miss critical deadlines",
  },
  {
    value: 'mission-disruption',
    label: 'Our mission would be disrupted but no one is at immediate risk',
  },
  {
    value: 'inconvenience',
    label: 'It would be inconvenient but nothing serious',
  },
]

export default function StepBizStackStakes() {
  const { answers, setAnswers } = useWizardStore()
  return (
    <div className="space-y-7">
      <div className="space-y-5">
        <p className="text-sm text-ink-muted">What channels do you actually use?</p>
        {CHANNEL_GROUPS.map((group) => {
          const groupValues = group.options.map((o) => o.value)
          return (
            <div key={group.header} className="space-y-2">
              <div className="text-[11px] uppercase tracking-wider text-ink-subtle font-medium">
                {group.header}
              </div>
              <CheckGroup
                name={`biz-channel-${group.header}`}
                options={group.options}
                value={answers.businessChannels.filter((v) =>
                  groupValues.includes(v),
                )}
                onChange={(selected) => {
                  const others = answers.businessChannels.filter(
                    (v) => !groupValues.includes(v),
                  )
                  setAnswers({ businessChannels: [...others, ...selected] })
                }}
              />
            </div>
          )
        })}
      </div>

      <div className="pt-4 border-t border-paper-edge">
        <Field
          label="If your org went dark for 24 hours, what would that mean?"
          hint="Pick all that apply."
          required
        >
          <CheckGroup
            name="continuityStakes"
            options={STAKES}
            value={answers.continuityStakes}
            onChange={(v) =>
              setAnswers({ continuityStakes: v as ContinuityStake[] })
            }
          />
        </Field>
      </div>
    </div>
  )
}

export function isBizStackStakesValid(a: WizardAnswers) {
  return a.businessChannels.length > 0 && a.continuityStakes.length > 0
}
