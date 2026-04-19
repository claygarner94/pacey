import {
  useWizardStore,
  type IndividualPerson,
  type PersonLocation,
  type WizardAnswers,
} from '../../../state/wizardStore'
import { Field, inputClass } from '../../ui/Field'

const PEOPLE_OPTIONS = [
  { value: 'partner', label: 'My partner / spouse' },
  { value: 'kids', label: 'My kids' },
  { value: 'kids-school', label: "My kids' school or caregiver" },
  { value: 'parent-family', label: 'A parent or close family member' },
  { value: 'employer', label: 'My employer or team' },
  { value: 'close-friend', label: 'A close friend' },
  { value: 'emergency-contact', label: 'My emergency contact' },
  { value: 'other', label: 'Someone else' },
]

const LOCATIONS: { value: PersonLocation; label: string }[] = [
  { value: 'nearby', label: 'With me or nearby' },
  { value: 'school-work', label: 'At school or work during the day' },
  { value: 'elsewhere', label: 'Somewhere else (different city, traveling)' },
]

const MIN = 2
const MAX = 4

export default function StepIndivPeople() {
  const { answers, setAnswers } = useWizardStore()
  const selected = answers.people
  const atMax = selected.length >= MAX

  const toggle = (kind: string) => {
    const existing = selected.find((p) => p.kind === kind)
    if (existing) {
      setAnswers({ people: selected.filter((p) => p.kind !== kind) })
    } else if (!atMax) {
      setAnswers({
        people: [...selected, { kind, location: '' }],
      })
    }
  }

  const updateLocation = (kind: string, location: PersonLocation) => {
    setAnswers({
      people: selected.map((p) =>
        p.kind === kind ? { ...p, location } : p,
      ),
    })
  }

  const updateLabel = (kind: string, customLabel: string) => {
    setAnswers({
      people: selected.map((p) =>
        p.kind === kind ? { ...p, customLabel } : p,
      ),
    })
  }

  return (
    <div className="space-y-6">
      <Field
        label="Pick 2 to 4 people or groups"
        hint={`${selected.length} of ${MAX} picked`}
        required
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PEOPLE_OPTIONS.map((opt) => {
            const picked = selected.some((p) => p.kind === opt.value)
            const disabled = !picked && atMax
            return (
              <label
                key={opt.value}
                className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 transition ${
                  disabled
                    ? 'border-paper-edge bg-paper-card opacity-50 cursor-not-allowed'
                    : picked
                      ? 'border-ink bg-paper-card cursor-pointer'
                      : 'border-paper-edge bg-paper-card hover:border-ink-muted cursor-pointer'
                }`}
              >
                <input
                  type="checkbox"
                  checked={picked}
                  disabled={disabled}
                  onChange={() => toggle(opt.value)}
                  className="accent-ink"
                />
                <span className="text-sm text-ink">{opt.label}</span>
              </label>
            )
          })}
        </div>
      </Field>

      {selected.length > 0 && (
        <div className="space-y-4 pt-2 border-t border-paper-edge">
          <p className="text-sm text-ink-muted">
            Where are they most days?
          </p>
          {selected.map((person) => {
            const opt = PEOPLE_OPTIONS.find((o) => o.value === person.kind)
            const labelText =
              person.kind === 'other' && person.customLabel
                ? person.customLabel
                : opt?.label ?? person.kind
            return (
              <div key={person.kind} className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-medium text-ink">{labelText}</span>
                </div>
                {person.kind === 'other' && (
                  <input
                    className={inputClass}
                    placeholder="Who? (short label)"
                    value={person.customLabel ?? ''}
                    onChange={(e) => updateLabel('other', e.target.value)}
                  />
                )}
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc.value}
                      type="button"
                      onClick={() => updateLocation(person.kind, loc.value)}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        person.location === loc.value
                          ? 'border-ink bg-ink text-paper'
                          : 'border-paper-edge text-ink-muted hover:border-ink-muted'
                      }`}
                    >
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function isIndivPeopleValid(a: WizardAnswers) {
  if (a.people.length < MIN || a.people.length > MAX) return false
  return a.people.every(
    (p: IndividualPerson) =>
      !!p.location &&
      (p.kind !== 'other' || (p.customLabel && p.customLabel.trim().length > 0)),
  )
}
