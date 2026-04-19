export const PLAN_JSON_SCHEMA = {
  type: 'object',
  properties: {
    displayName: { type: 'string' },
    planDate: { type: 'string' },
    missionEcho: { type: 'string' },
    tiers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: {
            type: 'string',
            enum: ['Primary', 'Alternate', 'Contingency', 'Emergency'],
          },
          channels: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                rationale: { type: 'string' },
              },
              required: ['name', 'rationale'],
              additionalProperties: false,
            },
          },
          ownerRole: { type: 'string' },
          escalationTrigger: { type: 'string' },
          failureModes: { type: 'array', items: { type: 'string' } },
        },
        required: ['label', 'channels', 'ownerRole', 'escalationTrigger', 'failureModes'],
        additionalProperties: false,
      },
    },
    contactRoster: {
      type: 'object',
      properties: {
        columns: { type: 'array', items: { type: 'string' } },
      },
      required: ['columns'],
      additionalProperties: false,
    },
    drillSchedule: {
      type: 'object',
      properties: {
        cadence: { type: 'string' },
        whatToTest: { type: 'array', items: { type: 'string' } },
      },
      required: ['cadence', 'whatToTest'],
      additionalProperties: false,
    },
    activationChecklist: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          tier: {
            type: 'string',
            enum: ['Primary', 'Alternate', 'Contingency', 'Emergency'],
          },
          steps: { type: 'array', items: { type: 'string' } },
        },
        required: ['tier', 'steps'],
        additionalProperties: false,
      },
    },
    glossary: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          term: { type: 'string' },
          definition: { type: 'string' },
        },
        required: ['term', 'definition'],
        additionalProperties: false,
      },
    },
    responseWindow: { type: 'string' },
  },
  required: [
    'displayName',
    'planDate',
    'missionEcho',
    'tiers',
    'contactRoster',
    'drillSchedule',
    'activationChecklist',
    'glossary',
    'responseWindow',
  ],
  additionalProperties: false,
} as const
