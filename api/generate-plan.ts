import type { VercelRequest, VercelResponse } from '@vercel/node'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT } from '../src/prompts/system'
import { PLAN_JSON_SCHEMA } from '../src/lib/jsonSchema'
import { planOutputSchema } from '../src/lib/schema'

const MODEL = 'claude-sonnet-4-6'

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

function buildUserMessage(answers: unknown) {
  return `Today is ${todayIso()}.

Here are this organization's answers to the intake wizard:

\`\`\`json
${JSON.stringify(answers, null, 2)}
\`\`\`

Build their PACE plan following the rules and schema in the system prompt. Ground every rationale in their specific context. Return only JSON.`
}

async function callAnthropic(answers: unknown) {
  const client = new Anthropic()
  return client.messages.create({
    model: MODEL,
    max_tokens: 8000,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: buildUserMessage(answers) }],
    output_config: {
      format: {
        type: 'json_schema',
        schema: PLAN_JSON_SCHEMA,
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

  const { answers } = (req.body ?? {}) as { answers?: unknown }
  if (!answers || typeof answers !== 'object') {
    res.status(400).json({ error: 'Missing answers' })
    return
  }

  try {
    const response = await callAnthropic(answers)
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

    const validated = planOutputSchema.safeParse(parsed)
    if (!validated.success) {
      res.status(502).json({
        error: 'Plan failed schema validation',
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
