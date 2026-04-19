import {
  useWizardStore,
  type HouseholdMember,
  type WizardAnswers,
} from '../../../state/wizardStore'
import { Field, inputClass } from '../../ui/Field'
import { Button } from '../../ui/Button'

const TAGS = [
  { value: 'adult-home', label: 'Adult at home most of the day' },
  { value: 'adult-work', label: 'Adult who leaves for work' },
  { value: 'school-kid', label: 'School-age kid' },
  { value: 'young-kid', label: 'Young kid (not in school yet)' },
  { value: 'teen', label: 'Teen with a phone' },
  { value: 'elder', label: 'Elder or dependent family member' },
  { value: 'caregiver', label: 'Caregiver (sitter, home health)' },
  { value: 'roommate', label: 'Roommate / other adult' },
]

const MIN = 2
const MAX = 8

export default function StepHouseMembers() {
  const { answers, setAnswers } = useWizardStore()
  const members = answers.householdMembers
  const atMax = members.length >= MAX

  const update = (idx: number, patch: Partial<HouseholdMember>) => {
    const next = members.map((m, i) => (i === idx ? { ...m, ...patch } : m))
    setAnswers({ householdMembers: next })
  }

  const add = () => {
    if (atMax) return
    setAnswers({ householdMembers: [...members, { tag: '', name: '' }] })
  }

  const remove = (idx: number) => {
    if (members.length <= 1) return
    setAnswers({ householdMembers: members.filter((_, i) => i !== idx) })
  }

  return (
    <div className="space-y-4">
      <Field
        label="Add each person in your household"
        hint={`${members.length} added · up to ${MAX}`}
        required
      >
        <div className="space-y-2">
          {members.map((m, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center rounded-lg border border-paper-edge bg-paper-card p-2.5"
            >
              <select
                className={`${inputClass} sm:flex-1`}
                value={m.tag}
                onChange={(e) => update(i, { tag: e.target.value })}
              >
                <option value="">Pick a role…</option>
                {TAGS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <input
                className={`${inputClass} sm:w-40`}
                placeholder="Name (optional)"
                value={m.name ?? ''}
                onChange={(e) => update(i, { name: e.target.value })}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                disabled={members.length <= 1}
                className="text-xs text-ink-subtle hover:text-ink disabled:opacity-30 sm:self-center px-2 py-1"
                aria-label="Remove person"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </Field>

      <Button
        type="button"
        variant="secondary"
        onClick={add}
        disabled={atMax}
        className="w-full sm:w-auto"
      >
        + Add person
      </Button>
    </div>
  )
}

export function isHouseMembersValid(a: WizardAnswers) {
  if (a.householdMembers.length < MIN || a.householdMembers.length > MAX) return false
  return a.householdMembers.every((m) => !!m.tag)
}
