import type { WizardAnswers } from '../state/wizardStore'
import { planOutputSchema, type PlanOutput } from './schema'

export type GenerateResult =
  | { ok: true; plan: PlanOutput }
  | { ok: false; error: string }

export async function generatePlan(answers: WizardAnswers): Promise<GenerateResult> {
  try {
    const res = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { ok: false, error: text || `Request failed (${res.status})` }
    }

    const json = await res.json()
    const parsed = planOutputSchema.safeParse(json)
    if (!parsed.success) {
      return { ok: false, error: 'Received a plan in an unexpected format.' }
    }
    return { ok: true, plan: parsed.data }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
