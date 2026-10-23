# The Offhand

A Next.js 15 and Payload CMS publication. PostgreSQL stores content; Azure Blob Storage stores media.

## Requirements

- Node.js 20+
- PostgreSQL
- Azure Blob Storage account/container

## Run locally

Copy `.env.example` to `.env` and fill in the database, Payload secret, and Azure Storage values. `NEXT_PUBLIC_SITE_URL` defaults to `http://localhost:3000`; `AZURE_STORAGE_CONTAINER_NAME` defaults to `media`.

```sh
npm ci
npx payload migrate
npm run dev
```

Open `http://localhost:3000` (admin: `/admin`).

## Repository

```text
src/
  app/(frontend)/   Public pages and layout
  app/(payload)/    Payload admin and API routes
  collections/      Posts, users, and media
  globals/          Site-wide settings
  migrations/       Versioned database changes
  payload.config.ts CMS and database configuration
.github/workflows/  Build and Azure deployment
Dockerfile          Production container
```

## Useful commands

```sh
npm run dev                 # Local development
npm run build               # Production build
npm start                   # Run the production build
npx tsc --noEmit            # Type-check
npx payload migrate:status  # Check database migrations
npx payload migrate         # Apply pending migrations
npx payload migrate:create # Create a migration after schema changes
npm run generate:types      # Regenerate Payload TypeScript types
npm run generate:importmap  # Regenerate Payload admin imports
```

Keep applied migrations: they are the database’s schema history.

## Telegram writing assistant

The optional webhook uses Azure Foundry for article drafts and Azure Speech F0 for voice notes (up to 60 seconds). Configure the `TELEGRAM_*`, `AZURE_FOUNDRY_*`, and `AZURE_SPEECH_*` values from `.env.example`, then apply pending Payload migrations before registering the Telegram webhook.

## Architecture

```mermaid
flowchart LR
  Visitor --> Next["Next.js + Payload CMS"]
  Telegram --> Next
  Next --> DB[(PostgreSQL)]
  Next --> Media["Azure Blob Storage"]
  Next --> Foundry["Azure Foundry"]
  Next --> Speech["Azure Speech F0"]
```
