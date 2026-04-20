import { z } from 'zod'

export const paceMethodSchema = z.object({
  method: z.string().min(1),
  detail: z.string().default(''),
})

export const planRowSchema = z.object({
  audienceLabel: z.string().min(1),
  contactLabel: z.string().min(1),
  primary: paceMethodSchema,
  alternate: paceMethodSchema,
  contingency: paceMethodSchema,
  emergency: paceMethodSchema,
  escalateAfter: z.string().min(1),
  notes: z.string().default(''),
})

export const planOutputSchema = z.object({
  displayName: z.string().min(1),
  planDate: z.string().min(1),
  ownerContext: z.string().min(1),
  rows: z.array(planRowSchema).min(1),
  drillCadence: z.string().min(1),
})

export const recommendationSeveritySchema = z.enum(['high', 'medium', 'low'])

export const recommendationFieldSchema = z.enum([
  'primary',
  'alternate',
  'contingency',
  'emergency',
  'escalateAfter',
  'notes',
])

export const recommendationItemSchema = z.object({
  title: z.string().min(1),
  severity: recommendationSeveritySchema,
  issue: z.string().min(1),
  recommendation: z.string().min(1),
  targetAudience: z.string().default(''),
  targetField: recommendationFieldSchema.optional(),
  proposedMethod: z.string().optional(),
  proposedDetail: z.string().optional(),
  proposedText: z.string().optional(),
})

export const recommendationOutputSchema = z.object({
  summary: z.string().min(1),
  items: z.array(recommendationItemSchema).max(6),
})

export type PaceMethod = z.infer<typeof paceMethodSchema>
export type PlanRow = z.infer<typeof planRowSchema>
export type PlanOutput = z.infer<typeof planOutputSchema>
export type RecommendationItem = z.infer<typeof recommendationItemSchema>
export type RecommendationOutput = z.infer<typeof recommendationOutputSchema>
