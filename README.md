# PACEY

PACEY is a free, open-source tool for generating PACE communication plans for individuals, households, and small organizations.

It guides a user through a short intake, generates an LLM-backed draft plan across the four PACE tiers, lets them edit the result, and supports export as either a full plan or a wallet card PDF.

## Features

- Guided intake wizard for different user types
- LLM-generated PACE plan draft
- Editable full-plan view
- Wallet-card view for quick carry
- PDF export for printing or saving

## Local Setup

1. Install dependencies:

```bash
bun install
```

2. Create a local environment file:

```bash
cp .env.example .env
```

3. Set the required server-side API key in `.env`:

```bash
ANTHROPIC_API_KEY=your_key_here
```

4. Start the local app:

```bash
bun run dev
```

The current serverless route at `POST /api/generate-plan` is implemented with Anthropic and expects `ANTHROPIC_API_KEY` to be present at runtime.

## Scripts

- `bun run dev` — start the Vite development server
- `bun run build` — type-check and build the production bundle
- `bun run lint` — run ESLint
- `bun run preview` — preview the production build locally

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Serverless API route for plan generation
- Zod schema validation for generated plan output

## Privacy And Behavior

PACEY does not require accounts and does not include analytics.

Wizard answers are sent to an LLM provider once to generate a plan. The app is designed not to intentionally persist that data server-side; when you close the tab, the plan remains only where you chose to save it, such as a downloaded PDF or printed copy.

## Contributing

PACEY is open source and open to issues and pull requests.

## License

MIT
