import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createAudienceRow,
  useWizardStore,
  type AudienceRowInput,
  type Persona,
  type WizardAnswers,
} from '../../../state/wizardStore'
import { Field, inputClass } from '../../ui/Field'
import { Button } from '../../ui/Button'

const MAX_ROWS = 4

type TemplateCopy = {
  chipLabel: string
  audiencePlaceholder: string
  contactPlaceholder: string
  primaryMethod: string
  primaryDetail: string
  alternateMethod: string
  alternateDetail: string
  contingencyMethod: string
  contingencyDetail: string
  emergencyMethod: string
  emergencyDetail: string
  escalatePlaceholder: string
  notesPlaceholder: string
}

const TEMPLATE_LIBRARY = {
  partner_spouse: {
    chipLabel: 'Partner / spouse',
    audiencePlaceholder: 'Partner / spouse',
    contactPlaceholder: 'Sam / spouse',
    primaryMethod: 'Text / SMS',
    primaryDetail: 'Fastest way to check in during the day',
    alternateMethod: 'Phone call',
    alternateDetail: 'Use if texts are delayed or missed',
    contingencyMethod: 'Email or shared app',
    contingencyDetail: 'Use when phone service is unreliable',
    emergencyMethod: 'Home rally point / in-person',
    emergencyDetail: 'Last resort if devices fail',
    escalatePlaceholder: '10 minutes with no reply',
    notesPlaceholder: 'Use this row for urgent check-ins, pickups, and location changes.',
  },
  kids_school: {
    chipLabel: "Kids' school or caregiver",
    audiencePlaceholder: "Kids' school or caregiver",
    contactPlaceholder: 'Ms. J / front desk / daycare lead',
    primaryMethod: 'Phone call to office',
    primaryDetail: 'Use the main number during school hours',
    alternateMethod: 'Text to teacher or caregiver',
    alternateDetail: 'Only if that person normally uses text',
    contingencyMethod: 'Email or school app',
    contingencyDetail: 'Use when phones are tied up',
    emergencyMethod: 'Approved pickup / in-person',
    emergencyDetail: 'Go to the school or pickup point if contact fails',
    escalatePlaceholder: '15 minutes with no answer',
    notesPlaceholder: 'Office hours, dismissal rules, pickup instructions, or caregiver backup details.',
  },
  emergency_contact: {
    chipLabel: 'Emergency contact',
    audiencePlaceholder: 'Emergency contact',
    contactPlaceholder: 'A.B. / aunt / backup contact',
    primaryMethod: 'Phone call',
    primaryDetail: 'Use when you need immediate relay help',
    alternateMethod: 'Text / SMS',
    alternateDetail: 'Send the short version if voice fails',
    contingencyMethod: 'Email',
    contingencyDetail: 'Use when both sides still have internet',
    emergencyMethod: 'In-person relay via family/friend',
    emergencyDetail: 'Last resort if all comms are down',
    escalatePlaceholder: '15 minutes with no reply',
    notesPlaceholder: 'Include who they should relay to and any important numbers they keep.',
  },
  employer_team: {
    chipLabel: 'Employer or team',
    audiencePlaceholder: 'Employer or team',
    contactPlaceholder: 'Manager / on-call lead / team channel',
    primaryMethod: 'Work chat',
    primaryDetail: 'Normal working-hours check-in channel',
    alternateMethod: 'Phone call',
    alternateDetail: 'Use when chat is down or response is urgent',
    contingencyMethod: 'Email',
    contingencyDetail: 'Use if synchronous channels fail',
    emergencyMethod: 'Office hotline / in-person reporting',
    emergencyDetail: 'Fallback when systems are unavailable',
    escalatePlaceholder: '20 minutes with no response',
    notesPlaceholder: 'Include shift timing, reporting chain, or after-hours instructions.',
  },
  close_family: {
    chipLabel: 'Close family member',
    audiencePlaceholder: 'Close family member',
    contactPlaceholder: 'Mom / brother / family group admin',
    primaryMethod: 'Text / SMS',
    primaryDetail: 'Use for quick status checks',
    alternateMethod: 'Phone call',
    alternateDetail: 'Use when text is missed',
    contingencyMethod: 'Family group chat or email',
    contingencyDetail: 'Use when reaching multiple people',
    emergencyMethod: 'Neighbor or family rally point',
    emergencyDetail: 'Fallback for all-comms-down scenarios',
    escalatePlaceholder: '20 minutes with no reply',
    notesPlaceholder: 'Add travel, medical, or shared-care details that matter for this contact.',
  },
  close_friend: {
    chipLabel: 'Close friend',
    audiencePlaceholder: 'Close friend',
    contactPlaceholder: 'J.T. / trusted friend',
    primaryMethod: 'Text / SMS',
    primaryDetail: 'Use for normal quick updates',
    alternateMethod: 'Phone call',
    alternateDetail: 'Use when the text may be missed',
    contingencyMethod: 'App message or email',
    contingencyDetail: 'Use if phone coverage is unreliable',
    emergencyMethod: 'Meetup point / mutual friend relay',
    emergencyDetail: 'Fallback for severe outages',
    escalatePlaceholder: '20 minutes with no reply',
    notesPlaceholder: 'Add where this friend fits into your overall fallback chain.',
  },
  adult_work: {
    chipLabel: 'Adult at work',
    audiencePlaceholder: 'Adult at work',
    contactPlaceholder: 'A.D. / work phone / desk line',
    primaryMethod: 'Text / SMS',
    primaryDetail: 'Use while they are commuting or between meetings',
    alternateMethod: 'Phone call',
    alternateDetail: 'Use if the text is not answered promptly',
    contingencyMethod: 'Email or office line',
    contingencyDetail: 'Use during long stretches away from a cell phone',
    emergencyMethod: 'Home rally point / pickup plan',
    emergencyDetail: 'Fallback if all comms fail',
    escalatePlaceholder: '15 minutes with no reply',
    notesPlaceholder: 'Include schedule constraints, commute timing, or desk line details.',
  },
  school_daycare: {
    chipLabel: 'School or daycare',
    audiencePlaceholder: 'School or daycare',
    contactPlaceholder: 'Front desk / teacher / pickup office',
    primaryMethod: 'Main office phone',
    primaryDetail: 'Use during operating hours',
    alternateMethod: 'Teacher or caregiver text',
    alternateDetail: 'Only if that is already normal practice',
    contingencyMethod: 'Email or school app',
    contingencyDetail: 'Use for written pickup changes or updates',
    emergencyMethod: 'Approved pickup / in-person',
    emergencyDetail: 'Go directly if communications break down',
    escalatePlaceholder: '15 minutes with no answer',
    notesPlaceholder: 'Include pickup authorization, release rules, or aftercare details.',
  },
  teen_phone: {
    chipLabel: 'Teen with phone',
    audiencePlaceholder: 'Teen with phone',
    contactPlaceholder: 'Teen initials / device name',
    primaryMethod: 'Text / SMS',
    primaryDetail: 'Normal fast check-in method',
    alternateMethod: 'Phone call',
    alternateDetail: 'Use when a text is missed',
    contingencyMethod: 'Friend parent / school office',
    contingencyDetail: 'Use if the phone is dead or unavailable',
    emergencyMethod: 'Meetup point / home fallback',
    emergencyDetail: 'Pre-agreed place to go if nothing works',
    escalatePlaceholder: '10 minutes with no reply',
    notesPlaceholder: 'Include charging, curfew, or school release instructions.',
  },
  elder_dependent: {
    chipLabel: 'Elder or dependent',
    audiencePlaceholder: 'Elder or dependent',
    contactPlaceholder: 'Grandma / caregiver / home phone',
    primaryMethod: 'Phone call',
    primaryDetail: 'Use the method they reliably answer',
    alternateMethod: 'Text to caregiver or nearby adult',
    alternateDetail: 'Use if the elder does not text',
    contingencyMethod: 'Landline or neighbor check',
    contingencyDetail: 'Use when mobile coverage fails',
    emergencyMethod: 'In-person welfare check',
    emergencyDetail: 'Last resort for urgent safety concerns',
    escalatePlaceholder: '10 minutes with no answer',
    notesPlaceholder: 'Include mobility, hearing, medication, or caregiver timing notes.',
  },
  trusted_neighbor: {
    chipLabel: 'Trusted neighbor',
    audiencePlaceholder: 'Trusted neighbor',
    contactPlaceholder: 'Neighbor initials / apartment number',
    primaryMethod: 'Text / SMS',
    primaryDetail: 'Quick local check-in',
    alternateMethod: 'Phone call',
    alternateDetail: 'Use if text is missed',
    contingencyMethod: 'Knock / building intercom',
    contingencyDetail: 'Use when phones fail but they are nearby',
    emergencyMethod: 'Shared rally point',
    emergencyDetail: 'Use if the whole block is affected',
    escalatePlaceholder: '10 minutes with no reply',
    notesPlaceholder: 'Add keys, pet, pickup, or neighborhood coordination details.',
  },
  caregiver: {
    chipLabel: 'Caregiver',
    audiencePlaceholder: 'Caregiver',
    contactPlaceholder: 'Sitter / home health aide / backup caregiver',
    primaryMethod: 'Text / SMS',
    primaryDetail: 'Quick schedule and status updates',
    alternateMethod: 'Phone call',
    alternateDetail: 'Use for urgent handoff or delay changes',
    contingencyMethod: 'Agency line / family backup',
    contingencyDetail: 'Use if the caregiver is unreachable',
    emergencyMethod: 'In-person backup handoff',
    emergencyDetail: 'Last resort if timing is critical',
    escalatePlaceholder: '10 minutes with no reply',
    notesPlaceholder: 'Include arrival window, allergies, medications, or backup caregiver info.',
  },
  leadership_staff: {
    chipLabel: 'Leadership ↔ staff',
    audiencePlaceholder: 'Leadership ↔ staff',
    contactPlaceholder: 'Executive lead / team channel / duty officer',
    primaryMethod: 'Team chat',
    primaryDetail: 'Normal operational broadcast channel',
    alternateMethod: 'SMS group',
    alternateDetail: 'Use if chat or data access fails',
    contingencyMethod: 'Phone tree',
    contingencyDetail: 'Use when direct apps are unavailable',
    emergencyMethod: 'Physical rally point / on-site briefing',
    emergencyDetail: 'Use if systems are fully down',
    escalatePlaceholder: '15 minutes with no response',
    notesPlaceholder: 'Include who sends the first message and who confirms receipt.',
  },
  staff_volunteers: {
    chipLabel: 'Staff ↔ volunteers',
    audiencePlaceholder: 'Staff ↔ volunteers',
    contactPlaceholder: 'Volunteer coordinator / roster lead',
    primaryMethod: 'Group chat or roster text',
    primaryDetail: 'Use for normal scheduling and updates',
    alternateMethod: 'Phone call tree',
    alternateDetail: 'Use if the group platform fails',
    contingencyMethod: 'Email list',
    contingencyDetail: 'Use for non-urgent but broad updates',
    emergencyMethod: 'On-site check-in / partner location',
    emergencyDetail: 'Fallback if remote coordination fails',
    escalatePlaceholder: '20 minutes with no response',
    notesPlaceholder: 'Include shift leads, reporting times, or volunteer access constraints.',
  },
  org_members_clients: {
    chipLabel: 'Org ↔ members or clients',
    audiencePlaceholder: 'Org ↔ members or clients',
    contactPlaceholder: 'Front desk / member hotline / broadcast list',
    primaryMethod: 'Email or client message platform',
    primaryDetail: 'Use for broad routine notifications',
    alternateMethod: 'SMS alert',
    alternateDetail: 'Use for urgent updates that must be seen quickly',
    contingencyMethod: 'Phone line or voicemail blast',
    contingencyDetail: 'Use when digital delivery is unreliable',
    emergencyMethod: 'Physical notice / rally site',
    emergencyDetail: 'Use if people must be redirected in person',
    escalatePlaceholder: '30 minutes with no confirmation',
    notesPlaceholder: 'Include bilingual needs, service hours, or critical client instructions.',
  },
  org_vendors: {
    chipLabel: 'Org ↔ vendors',
    audiencePlaceholder: 'Org ↔ vendors',
    contactPlaceholder: 'Vendor rep / dispatch line / account manager',
    primaryMethod: 'Phone call',
    primaryDetail: 'Use for real-time operational issues',
    alternateMethod: 'Email',
    alternateDetail: 'Use for documentation and follow-up',
    contingencyMethod: 'Alternate vendor line',
    contingencyDetail: 'Use if the primary rep is unreachable',
    emergencyMethod: 'On-site fallback or alternate supplier',
    emergencyDetail: 'Use when delivery or access is disrupted',
    escalatePlaceholder: '30 minutes with no response',
    notesPlaceholder: 'Include account numbers, delivery windows, or alternate supplier details.',
  },
  staff_board: {
    chipLabel: 'Staff ↔ board',
    audiencePlaceholder: 'Staff ↔ board',
    contactPlaceholder: 'Board chair / executive committee',
    primaryMethod: 'Email',
    primaryDetail: 'Normal board communication channel',
    alternateMethod: 'Phone call',
    alternateDetail: 'Use for urgent governance updates',
    contingencyMethod: 'SMS to board chair',
    contingencyDetail: 'Use when email is delayed or missed',
    emergencyMethod: 'Emergency meeting point / partner office',
    emergencyDetail: 'Use if urgent board action is required',
    escalatePlaceholder: '30 minutes with no response',
    notesPlaceholder: 'Include approval thresholds, quorum needs, or emergency authority notes.',
  },
  org_funders_regulators: {
    chipLabel: 'Org ↔ funders or regulators',
    audiencePlaceholder: 'Org ↔ funders or regulators',
    contactPlaceholder: 'Program officer / regulator hotline',
    primaryMethod: 'Email',
    primaryDetail: 'Normal official communication method',
    alternateMethod: 'Phone call',
    alternateDetail: 'Use for urgent reporting or clarification',
    contingencyMethod: 'Portal submission / alternate contact',
    contingencyDetail: 'Use if the primary channel is unavailable',
    emergencyMethod: 'Documented manual notice process',
    emergencyDetail: 'Use when deadlines or compliance exposure are immediate',
    escalatePlaceholder: '1 hour with no response',
    notesPlaceholder: 'Include filing deadlines, case numbers, or required reporting language.',
  },
} as const satisfies Record<string, TemplateCopy>

type TemplateKey = keyof typeof TEMPLATE_LIBRARY

const SUGGESTIONS: Record<
  Exclude<Persona, ''>,
  { key: TemplateKey; label: string }[]
> = {
  individual: [
    { key: 'partner_spouse', label: TEMPLATE_LIBRARY.partner_spouse.chipLabel },
    { key: 'kids_school', label: TEMPLATE_LIBRARY.kids_school.chipLabel },
    { key: 'emergency_contact', label: TEMPLATE_LIBRARY.emergency_contact.chipLabel },
    { key: 'employer_team', label: TEMPLATE_LIBRARY.employer_team.chipLabel },
    { key: 'close_family', label: TEMPLATE_LIBRARY.close_family.chipLabel },
    { key: 'close_friend', label: TEMPLATE_LIBRARY.close_friend.chipLabel },
  ],
  household: [
    { key: 'adult_work', label: TEMPLATE_LIBRARY.adult_work.chipLabel },
    { key: 'school_daycare', label: TEMPLATE_LIBRARY.school_daycare.chipLabel },
    { key: 'teen_phone', label: TEMPLATE_LIBRARY.teen_phone.chipLabel },
    { key: 'elder_dependent', label: TEMPLATE_LIBRARY.elder_dependent.chipLabel },
    { key: 'trusted_neighbor', label: TEMPLATE_LIBRARY.trusted_neighbor.chipLabel },
    { key: 'caregiver', label: TEMPLATE_LIBRARY.caregiver.chipLabel },
  ],
  business: [
    { key: 'leadership_staff', label: TEMPLATE_LIBRARY.leadership_staff.chipLabel },
    { key: 'staff_volunteers', label: TEMPLATE_LIBRARY.staff_volunteers.chipLabel },
    { key: 'org_members_clients', label: TEMPLATE_LIBRARY.org_members_clients.chipLabel },
    { key: 'org_vendors', label: TEMPLATE_LIBRARY.org_vendors.chipLabel },
    { key: 'staff_board', label: TEMPLATE_LIBRARY.staff_board.chipLabel },
    { key: 'org_funders_regulators', label: TEMPLATE_LIBRARY.org_funders_regulators.chipLabel },
  ],
}

const GENERIC_COPY: TemplateCopy = {
  chipLabel: 'Custom row',
  audiencePlaceholder: 'Who is this row for?',
  contactPlaceholder: 'Name, initials, role, or desk',
  primaryMethod: 'Main method',
  primaryDetail: 'What you try first',
  alternateMethod: 'Backup method',
  alternateDetail: 'What you use if the main method fails',
  contingencyMethod: 'Contingency method',
  contingencyDetail: 'A slower or less convenient fallback',
  emergencyMethod: 'Emergency fallback',
  emergencyDetail: 'Last resort if everything else is down',
  escalatePlaceholder: 'When to move to the next method',
  notesPlaceholder: 'Special handling, timing, location, or coordination notes.',
}

export default function StepAudienceRows() {
  const { answers, setAnswers } = useWizardStore()
  const rows = answers.rows
  const atMax = rows.length >= MAX_ROWS
  const [openRowId, setOpenRowId] = useState<string | null>(rows[0]?.id ?? null)
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const suggestions = useMemo(() => {
    if (!answers.persona) return []
    const existing = new Set(rows.map((row) => row.templateKey).filter(Boolean))
    return SUGGESTIONS[answers.persona].filter(
      (suggestion) => !existing.has(suggestion.key),
    )
  }, [answers.persona, rows])

  useEffect(() => {
    if (!rows.length) {
      setOpenRowId(null)
      return
    }
    if (openRowId && !rows.some((row) => row.id === openRowId)) {
      setOpenRowId(rows[0].id)
    }
  }, [rows, openRowId])

  useEffect(() => {
    if (!openRowId) return
    const node = rowRefs.current[openRowId]
    if (!node) return
    const firstField = node.querySelector<HTMLElement>('input, textarea, select, button')
    firstField?.focus({ preventScroll: true })
  }, [openRowId])

  const updateRow = (id: string, patch: Partial<AudienceRowInput>) => {
    setAnswers({
      rows: rows.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    })
  }

  const updateMethod = (
    id: string,
    field: 'primary' | 'alternate' | 'contingency' | 'emergency',
    patch: Partial<AudienceRowInput['primary']>,
  ) => {
    setAnswers({
      rows: rows.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: {
                ...row[field],
                ...patch,
              },
            }
          : row,
      ),
    })
  }

  const toggleRow = (id: string) => {
    setOpenRowId((current) => (current === id ? null : id))
  }

  const addSuggestion = (key: TemplateKey) => {
    if (atMax) return
    const copy = TEMPLATE_LIBRARY[key]
    const nextRow = createAudienceRow({
      templateKey: key,
      audienceLabel: copy.chipLabel,
    })
    setAnswers({ rows: [...rows, nextRow] })
    setOpenRowId(nextRow.id)
  }

  const addBlankRow = () => {
    if (atMax) return
    const nextRow = createAudienceRow()
    setAnswers({ rows: [...rows, nextRow] })
    setOpenRowId(nextRow.id)
  }

  const removeRow = (id: string) => {
    const idx = rows.findIndex((row) => row.id === id)
    const nextRows = rows.filter((row) => row.id !== id)
    setAnswers({ rows: nextRows })

    if (!nextRows.length) {
      setOpenRowId(null)
      return
    }

    const fallbackRow = nextRows[Math.min(idx, nextRows.length - 1)]
    setOpenRowId(fallbackRow.id)
  }

  return (
    <div className="space-y-6">
      <Field
        label="Add 1 to 4 critical audiences or relationships"
        hint="These rows become the lines on your worksheet. The first 2 rows appear on the wallet card, so put your most critical relationships first."
        required
      >
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.key}
              type="button"
              onClick={() => addSuggestion(suggestion.key)}
              disabled={atMax}
              className="rounded-full border border-paper-edge px-3 py-1.5 text-sm text-ink-muted hover:border-ink-muted hover:text-ink transition disabled:opacity-40"
            >
              + {suggestion.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="space-y-3">
        {rows.map((row, idx) => {
          const isOpen = openRowId === row.id
          const copy = getTemplateCopy(row.templateKey)
          const complete = isRowComplete(row)
          const summaryAudience =
            row.audienceLabel.trim() || copy.chipLabel || `Row ${idx + 1}`
          const summaryContact = row.contactLabel.trim()

          return (
            <div
              key={row.id}
              className={`rounded-xl border bg-paper-card transition ${
                isOpen
                  ? 'border-ink shadow-soft'
                  : 'border-paper-edge hover:border-ink-muted'
              }`}
            >
              <div className="flex items-start justify-between gap-3 p-4">
                <button
                  type="button"
                  onClick={() => toggleRow(row.id)}
                  className="min-w-0 flex-1 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs uppercase tracking-[0.18em] text-ink-subtle">
                        Row {idx + 1}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          complete
                            ? 'bg-ink text-paper'
                            : 'bg-paper-edge text-ink-subtle'
                        }`}
                      >
                        {complete ? 'Ready' : 'Incomplete'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-ink truncate">
                      {summaryAudience}
                    </p>
                    <p className="text-sm text-ink-muted truncate">
                      {summaryContact || 'No contact added yet'}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="text-xs text-ink-subtle hover:text-ink transition"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleRow(row.id)}
                    className="text-ink-subtle"
                    aria-label={isOpen ? 'Collapse row' : 'Expand row'}
                  >
                    <span
                      className={`block transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden
                    >
                      ▾
                    </span>
                  </button>
                </div>
              </div>

              {isOpen && (
                <div
                  ref={(node) => {
                    rowRefs.current[row.id] = node
                  }}
                  className="border-t border-paper-edge px-4 pb-4 pt-4 space-y-4"
                >
                  <p className="text-sm text-ink-muted">
                    Use names, initials, or roles. Privacy-safe labels are fine.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Who is this row for?"
                      hint={fieldHint(row.templateKey, 'audience')}
                      required
                    >
                      <input
                        className={inputClass}
                        value={row.audienceLabel}
                        onChange={(e) =>
                          updateRow(row.id, { audienceLabel: e.target.value })
                        }
                        placeholder={copy.audiencePlaceholder}
                      />
                    </Field>
                    <Field
                      label="Contact name, initials, or role"
                      hint={fieldHint(row.templateKey, 'contact')}
                      required
                    >
                      <input
                        className={inputClass}
                        value={row.contactLabel}
                        onChange={(e) =>
                          updateRow(row.id, { contactLabel: e.target.value })
                        }
                        placeholder={copy.contactPlaceholder}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <PaceMethodFields
                      label="Primary"
                      method={row.primary.method}
                      detail={row.primary.detail}
                      methodPlaceholder={copy.primaryMethod}
                      detailPlaceholder={copy.primaryDetail}
                      onMethodChange={(value) =>
                        updateMethod(row.id, 'primary', { method: value })
                      }
                      onDetailChange={(value) =>
                        updateMethod(row.id, 'primary', { detail: value })
                      }
                    />
                    <PaceMethodFields
                      label="Alternate"
                      method={row.alternate.method}
                      detail={row.alternate.detail}
                      methodPlaceholder={copy.alternateMethod}
                      detailPlaceholder={copy.alternateDetail}
                      onMethodChange={(value) =>
                        updateMethod(row.id, 'alternate', { method: value })
                      }
                      onDetailChange={(value) =>
                        updateMethod(row.id, 'alternate', { detail: value })
                      }
                    />
                    <PaceMethodFields
                      label="Contingency"
                      method={row.contingency.method}
                      detail={row.contingency.detail}
                      methodPlaceholder={copy.contingencyMethod}
                      detailPlaceholder={copy.contingencyDetail}
                      onMethodChange={(value) =>
                        updateMethod(row.id, 'contingency', { method: value })
                      }
                      onDetailChange={(value) =>
                        updateMethod(row.id, 'contingency', { detail: value })
                      }
                    />
                    <PaceMethodFields
                      label="Emergency"
                      method={row.emergency.method}
                      detail={row.emergency.detail}
                      methodPlaceholder={copy.emergencyMethod}
                      detailPlaceholder={copy.emergencyDetail}
                      onMethodChange={(value) =>
                        updateMethod(row.id, 'emergency', { method: value })
                      }
                      onDetailChange={(value) =>
                        updateMethod(row.id, 'emergency', { detail: value })
                      }
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field
                      label="Escalate after"
                      hint={fieldHint(row.templateKey, 'escalate')}
                      required
                    >
                      <input
                        className={inputClass}
                        value={row.escalateAfter}
                        onChange={(e) =>
                          updateRow(row.id, { escalateAfter: e.target.value })
                        }
                        placeholder={copy.escalatePlaceholder}
                      />
                    </Field>
                    <Field
                      label="Notes"
                      hint="Optional. Include timing, location, accessibility, or special handling."
                    >
                      <textarea
                        className={`${inputClass} min-h-24`}
                        value={row.notes}
                        onChange={(e) => updateRow(row.id, { notes: e.target.value })}
                        placeholder={copy.notesPlaceholder}
                      />
                    </Field>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <Button type="button" variant="secondary" onClick={addBlankRow} disabled={atMax}>
        {atMax ? 'Maximum rows added' : '+ Add another row'}
      </Button>
    </div>
  )
}

function PaceMethodFields({
  label,
  method,
  detail,
  methodPlaceholder,
  detailPlaceholder,
  onMethodChange,
  onDetailChange,
}: {
  label: string
  method: string
  detail: string
  methodPlaceholder: string
  detailPlaceholder: string
  onMethodChange: (value: string) => void
  onDetailChange: (value: string) => void
}) {
  return (
    <div className="space-y-2 rounded-lg border border-paper-edge/80 p-3">
      <p className="text-sm font-medium text-ink">{label}</p>
      <input
        className={inputClass}
        value={method}
        onChange={(e) => onMethodChange(e.target.value)}
        placeholder={methodPlaceholder}
      />
      <input
        className={inputClass}
        value={detail}
        onChange={(e) => onDetailChange(e.target.value)}
        placeholder={detailPlaceholder}
      />
    </div>
  )
}

function getTemplateCopy(templateKey?: string): TemplateCopy {
  if (!templateKey) return GENERIC_COPY
  return TEMPLATE_LIBRARY[templateKey as TemplateKey] ?? GENERIC_COPY
}

function fieldHint(templateKey: string | undefined, field: 'audience' | 'contact' | 'escalate') {
  if (!templateKey) {
    if (field === 'audience') return 'Use the relationship or audience this row protects.'
    if (field === 'contact') return 'Use the specific person, desk, or role you actually reach.'
    return 'Keep this short and actionable.'
  }

  if (field === 'audience') return 'Keep the relationship label clear and scannable on the card.'
  if (field === 'contact') return 'Use the person, desk, office, or role you would actually reach.'
  return 'Set the point where you stop waiting and move down the ladder.'
}

function isRowComplete(row: AudienceRowInput) {
  return (
    row.audienceLabel.trim().length > 0 &&
    row.contactLabel.trim().length > 0 &&
    row.primary.method.trim().length > 0 &&
    row.alternate.method.trim().length > 0 &&
    row.contingency.method.trim().length > 0 &&
    row.emergency.method.trim().length > 0 &&
    row.escalateAfter.trim().length > 0
  )
}

export function isAudienceRowsValid(a: WizardAnswers) {
  if (a.rows.length < 1 || a.rows.length > MAX_ROWS) return false
  return a.rows.every(isRowComplete)
}
