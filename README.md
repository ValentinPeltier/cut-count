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
cp .env.test.example .env.test
docker-compose up -d
yarn db migrate deploy
yarn db:seed
yarn rules:compile
yarn dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

## Commands

```bash
yarn dev                  # Next.js dev server (port 3000)
yarn build                # production build + standalone asset copy
yarn start                # node .next/standalone/server.js
yarn typecheck            # TypeScript check
yarn lint                 # Prettier + ESLint
yarn lint:fix            # auto-fix Prettier + ESLint
yarn test                 # unit + rules + e2e
yarn test:unit            # unit tests only
yarn test:e2e             # starts app on 3001, then runs e2e
yarn db:generate          # Prisma client → src/generated/prisma
yarn db migrate dev       # create/apply migrations
yarn db:seed              # seed database
yarn rules:compile        # compile Count Publicodes YAML
yarn rules:watch
yarn rules:translate
yarn db:test:reset        # reset + seed the test database
```

## Import scripts

Run from the repo root:

```bash
yarn script src/scripts/FE/importFEFromBase.ts -n ${versionNumber} -f ${pathToCSVFile} -b ${base}
yarn script src/scripts/cut/cnc/add.ts -f ${pathToCSVFile}
```

See `src/scripts/` for additional importers.

## Tests

`.env.test` overlays `.env`: test DB (Postgres 5433), `NODE_ENV`, and ports 3001. Copy `.env.example` → `.env` and `.env.test.example` → `.env.test` first.

```bash
yarn db:test:reset          # reset + seed the test database
yarn test                   # unit + rules + e2e
yarn test:unit
yarn test:unit:watch
yarn test:rules
yarn test:e2e               # starts the app on port 3001, then runs e2e
yarn test:e2e:gui           # same, with the e2e UI
```

## Dependency upgrades

```bash
yarn upgrade-interactive --latest
yarn outdated
yarn audit
```
