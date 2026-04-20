import { create } from 'zustand'

export type Persona = 'individual' | 'household' | 'business' | ''

export type PersonLocation = 'nearby' | 'school-work' | 'elsewhere' | ''

export type IndividualPerson = {
  kind: string
  location: PersonLocation
  customLabel?: string
}

export type HouseholdMember = {
  tag: string
  name?: string
}

export type OperatingMode =
  | 'in-person'
  | 'office-based'
  | 'field-work'
  | 'hybrid'
  | ''

export type ContinuityStake =
  | 'safety-critical'
  | 'revenue-impacting'
  | 'mission-disruption'
  | 'inconvenience'

export type PaceMethodInput = {
  method: string
  detail: string
}

export type AudienceRowInput = {
  id: string
  templateKey?: string
  audienceLabel: string
  contactLabel: string
  primary: PaceMethodInput
  alternate: PaceMethodInput
  contingency: PaceMethodInput
  emergency: PaceMethodInput
  escalateAfter: string
  notes: string
}

export type WizardAnswers = {
  // Shared
  persona: Persona
  orgType: string
  budget: 'free' | 'modest' | 'invest' | ''
  techComfort: 'low' | 'medium' | 'high' | ''
  extraNotes: string
  displayName: string
  ownerContext: string
  rows: AudienceRowInput[]

  // Individual
  people: IndividualPerson[]
  individualChannels: string[]
  lifeContext: string[]

  // Household
  householdMembers: HouseholdMember[]
  householdChannels: string[]

  // Business
  orgDescription: string
  operatingMode: OperatingMode
  reachPairs: string[]
  businessChannels: string[]
  continuityStakes: ContinuityStake[]
  sizeBand: string
}

type WizardState = {
  answers: WizardAnswers
  setAnswers: (patch: Partial<WizardAnswers>) => void
  reset: () => void
}

const initial: WizardAnswers = {
  persona: '',
  orgType: '',
  budget: '',
  techComfort: '',
  extraNotes: '',
  displayName: '',

  people: [],
  individualChannels: [],
  lifeContext: [],

  householdMembers: [{ tag: 'adult-home', name: '' }],
  householdChannels: [],

  orgDescription: '',
  operatingMode: '',
  reachPairs: ['leader-staff'],
  businessChannels: [],
  continuityStakes: [],
  sizeBand: '',
  ownerContext: '',
  rows: [],
}

export const useWizardStore = create<WizardState>((set) => ({
  answers: initial,
  setAnswers: (patch) =>
    set((s) => ({ answers: { ...s.answers, ...patch } })),
  reset: () => set({ answers: initial }),
}))

export function createAudienceRow(
  patch: Partial<AudienceRowInput> = {},
): AudienceRowInput {
  return {
    id: `row-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`,
    audienceLabel: '',
    contactLabel: '',
    primary: { method: '', detail: '' },
    alternate: { method: '', detail: '' },
    contingency: { method: '', detail: '' },
    emergency: { method: '', detail: '' },
    escalateAfter: '',
    notes: '',
    ...patch,
  }
}

export function autoDisplayName(a: WizardAnswers): string {
  if (a.displayName.trim()) return a.displayName.trim()
  if (a.persona === 'individual') return 'My personal plan'
  if (a.persona === 'household') return 'Our household plan'
  return ''
}
