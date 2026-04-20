import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import {
  planOutputSchema,
  recommendationOutputSchema,
} from '../src/lib/schema.js'

const MODEL = 'claude-sonnet-4-6'

const SYSTEM_PROMPT = `You are reviewing a deterministic PACE communications matrix.

Your job is not to rewrite the whole plan. Your job is to inspect the rows and return only targeted recommendations that improve resilience.

Focus only on:
- single points of failure
- weak alternates that depend on the same infrastructure
- missing escalation clarity
- plans that are too complex for the stated budget or tech comfort
- obvious better-fit fallback options

When possible, target one exact audience label from the provided plan and one exact field:
- primary
- alternate
- contingency
- emergency
- escalateAfter
- notes

If you target a PACE field, return:
- proposedMethod
- optionally proposedDetail

If you target escalateAfter or notes, return:
- proposedText

Do not invent audiences that are not in the provided plan. Use the audience labels exactly as given. Keep the number of recommendations small and high signal. Return only JSON.`

function buildUserMessage(input: unknown) {
  return `Review this PACE plan and its optional context:

\`\`\`json
${JSON.stringify(input, null, 2)}
\`\`\`

Return a concise summary and up to 6 actionable recommendations.`
}

async function callAnthropic(input: unknown) {
  const client = new Anthropic()
  return client.messages.create({
    model: MODEL,
    max_tokens: 2500,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: buildUserMessage(input) }],
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: {
            summary: { type: 'string' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  severity: { type: 'string', enum: ['high', 'medium', 'low'] },
                  issue: { type: 'string' },
                  recommendation: { type: 'string' },
                  targetAudience: { type: 'string' },
                  targetField: {
                    type: 'string',
                    enum: [
                      'primary',
                      'alternate',
                      'contingency',
                      'emergency',
                      'escalateAfter',
                      'notes',
                    ],
                  },
                  proposedMethod: { type: 'string' },
                  proposedDetail: { type: 'string' },
                  proposedText: { type: 'string' },
                },
                required: ['title', 'severity', 'issue', 'recommendation'],
                additionalProperties: false,
              },
            },
          },
          required: ['summary', 'items'],
          additionalProperties: false,
        },
      },
    },
  })
}

function extractJsonText(content: Anthropic.ContentBlock[]): string | null {
  for (const block of content) {
    if (block.type === 'text') return block.text
  }
  return null
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    res.status(500).json({ error: 'Server missing ANTHROPIC_API_KEY' })
    return
  }

  const body = req.body ?? {}
  const parsedPlan = planOutputSchema.safeParse(body.plan)
  if (!parsedPlan.success) {
    res.status(400).json({ error: 'Missing or invalid plan payload' })
    return
  }

  try {
    const response = await callAnthropic({
      plan: parsedPlan.data,
      reviewContext: body.answers ?? {},
    })
    const text = extractJsonText(response.content)
    if (!text) {
      res.status(502).json({ error: 'Model returned no text content' })
      return
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      res.status(502).json({ error: 'Model response was not valid JSON' })
      return
    }

    const validated = recommendationOutputSchema.safeParse(parsed)
    if (!validated.success) {
      res.status(502).json({
        error: 'Recommendations failed schema validation',
        issues: validated.error.issues.slice(0, 5),
      })
      return
    }

    res.status(200).json(validated.data)
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      res.status(429).json({ error: 'Rate limited — please try again in a moment.' })
      return
    }
    if (err instanceof Anthropic.APIError) {
      res.status(502).json({ error: `Anthropic API error: ${err.message}` })
      return
    }
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Unknown server error',
    })
  }
}
