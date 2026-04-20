import { autoDisplayName, type WizardAnswers } from '../state/wizardStore'
import type { PlanOutput, PlanRow } from './schema'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function defaultOwnerContext(answers: WizardAnswers) {
  if (answers.persona === 'individual') {
    return 'A direct fallback matrix for the people who most need to reach you.'
  }
  if (answers.persona === 'household') {
    return 'A shared family fallback matrix for the people and places your household depends on.'
  }
  return 'A communications fallback matrix for the most important relationships your organization has to maintain.'
}

function deriveDrillCadence(answers: WizardAnswers) {
  if (answers.persona === 'household') return 'Semiannually'
  if (answers.persona === 'business') {
    return answers.continuityStakes.includes('safety-critical') ? 'Monthly' : 'Quarterly'
  }
  return 'Yearly'
}

function trimMethod(method: { method: string; detail: string }) {
  return {
    method: method.method.trim(),
    detail: method.detail.trim(),
  }
}

function normalizeRow(row: WizardAnswers['rows'][number]): PlanRow {
  return {
    audienceLabel: row.audienceLabel.trim(),
    contactLabel: row.contactLabel.trim(),
    primary: trimMethod(row.primary),
    alternate: trimMethod(row.alternate),
    contingency: trimMethod(row.contingency),
    emergency: trimMethod(row.emergency),
    escalateAfter: row.escalateAfter.trim(),
    notes: row.notes.trim(),
  }
}

export function buildPlan(answers: WizardAnswers): PlanOutput {
  const displayName = answers.displayName.trim() || autoDisplayName(answers) || 'PACE plan'

  return {
    displayName,
    planDate: todayIso(),
    ownerContext: answers.ownerContext.trim() || defaultOwnerContext(answers),
    rows: answers.rows.map(normalizeRow),
    drillCadence: deriveDrillCadence(answers),
  }
}
