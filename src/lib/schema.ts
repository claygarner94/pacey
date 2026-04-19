import { z } from 'zod'

export const tierLabel = z.enum(['Primary', 'Alternate', 'Contingency', 'Emergency'])

export const planTierSchema = z.object({
  label: tierLabel,
  channels: z
    .array(
      z.object({
        name: z.string().min(1),
        rationale: z.string().min(1),
      }),
    )
    .min(1),
  ownerRole: z.string().min(1),
  escalationTrigger: z.string().min(1),
  failureModes: z.array(z.string().min(1)).min(1),
})

export const planOutputSchema = z.object({
  displayName: z.string().min(1),
  planDate: z.string().min(1),
  missionEcho: z.string().min(1),
  tiers: z.array(planTierSchema).length(4),
  contactRoster: z.object({
    columns: z.array(z.string().min(1)).min(2),
  }),
  drillSchedule: z.object({
    cadence: z.string().min(1),
    whatToTest: z.array(z.string().min(1)).min(1),
  }),
  activationChecklist: z
    .array(
      z.object({
        tier: tierLabel,
        steps: z.array(z.string().min(1)).min(1),
      }),
    )
    .length(4),
  glossary: z
    .array(
      z.object({
        term: z.string().min(1),
        definition: z.string().min(1),
      }),
    )
    .min(3),
  responseWindow: z.string().min(1),
})

export type PlanOutput = z.infer<typeof planOutputSchema>
export type PlanTier = z.infer<typeof planTierSchema>
