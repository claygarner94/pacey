import type { WizardAnswers } from '../state/wizardStore'
import {
  recommendationOutputSchema,
  type PlanOutput,
  type RecommendationOutput,
} from './schema'

export type ReviewResult =
  | { ok: true; recommendations: RecommendationOutput }
  | { ok: false; error: string }

export async function reviewPlan(
  plan: PlanOutput,
  answers: WizardAnswers,
): Promise<ReviewResult> {
  try {
    const res = await fetch('/api/recommend-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, answers }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      return { ok: false, error: text || `Request failed (${res.status})` }
    }

    const json = await res.json()
    const parsed = recommendationOutputSchema.safeParse(json)
    if (!parsed.success) {
      return { ok: false, error: 'Received recommendations in an unexpected format.' }
    }
    return { ok: true, recommendations: parsed.data }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    }
  }
}
