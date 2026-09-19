# Count!

Cinema carbon-footprint app for Association Bilan Carbone. Single Next.js 16 application (no Yarn workspaces, no Turbo).

## Stack

- Node 26.x, Yarn 1.22
- Next.js 16 App Router, React 19, Turbopack, `output: 'standalone'`
- next-auth v4, next-intl (French)
- PostgreSQL 17 + Prisma 7 (`@prisma/adapter-pg`)
- Publicodes rules under `src/publicodes/`
- Jest (unit) + Cypress 15 (e2e) + Vitest (Publicodes)

## Get started

### Prerequisites

- Node.js 26.9.x
- Yarn 1.22
- Docker and Docker Compose

### Setup

```bash
yarn install
cp .env.example .env
docker-compose up -d
yarn prisma migrate deploy
yarn seed
yarn publicodes:compile
yarn dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

## Commands

```bash
yarn dev                  # Next.js dev server (port 3000)
yarn build                # production build + standalone asset copy
yarn start                # node .next/standalone/server.js
yarn ts                   # TypeScript check
yarn lint                 # Prettier + ESLint
yarn test                 # Jest + Publicodes Vitest
yarn cypress              # Cypress e2e
yarn db:generate          # Prisma client → src/generated/prisma
yarn prisma migrate dev   # create/apply migrations
yarn seed                 # seed database
yarn publicodes:compile   # compile Count Publicodes YAML
yarn publicodes:watch
yarn publicodes:translate
yarn db:test:reset        # reset + seed the test database
```

## Import scripts

Run from the repo root:

```bash
yarn tsx src/scripts/FE/importFEFromBase.ts -n ${versionNumber} -f ${pathToCSVFile} -b ${base}
yarn tsx src/scripts/cut/cnc/add.ts -f ${pathToCSVFile}
```

See `src/scripts/` for additional importers.

## Tests

`.env.test` is tracked and overlays `.env`: test DB (Postgres 5433), `NODE_ENV`, and ports 3001. Copy `.env.example` → `.env` first.

```bash
yarn db:test:reset          # reset + seed the test database
yarn test                   # unit + Publicodes
yarn test:watch
yarn publicodes:test
yarn dev:test               # app on port 3001 against the test DB
yarn cypress
yarn cypress:gui
```

## Dependency upgrades

```bash
yarn upgrade-interactive --latest
yarn outdated
yarn audit
```
