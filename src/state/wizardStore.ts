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

export type WizardAnswers = {
  // Shared
  persona: Persona
  orgType: string
  budget: 'free' | 'modest' | 'invest' | ''
  techComfort: 'low' | 'medium' | 'high' | ''
  extraNotes: string
  displayName: string

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
}

export const useWizardStore = create<WizardState>((set) => ({
  answers: initial,
  setAnswers: (patch) =>
    set((s) => ({ answers: { ...s.answers, ...patch } })),
  reset: () => set({ answers: initial }),
}))

export function autoDisplayName(a: WizardAnswers): string {
  if (a.displayName.trim()) return a.displayName.trim()
  if (a.persona === 'individual') return 'My personal plan'
  if (a.persona === 'household') return 'Our household plan'
  return ''
}
