# PostgreSQL → MySQL migration

This folder contains scripts to move Count data from a legacy or standalone PostgreSQL database into the application’s MySQL database.

There are two ways to reach a PostgreSQL source that `03-migrate-pg-to-mysql.ts` can read:

- **Path A** — extract CUT-only data from a **shared** Bilan Carbone PostgreSQL instance (multi-tenant `bilan_carbone` / `common` schemas), load it into a **dedicated** PostgreSQL database, then migrate to MySQL.
- **Path B** — migrate directly when the source is already a **Count** PostgreSQL database with the current `public` schema and all Prisma migrations applied (no steps 01–02).

---

## Path A — Shared PostgreSQL → dedicated PostgreSQL → MySQL

### Step 1 — Export CUT data from the source (PostgreSQL)

**Where:** machine that can reach the **shared source** database (production/staging dump host, bastion, etc.).

**What:** `01-export-from-source-pgsql.sh`

Builds a temporary `cut_export` schema (SQL inlined in the script), dumps CUT-scoped rows, then removes the staging schema on the source.

```bash
cd scripts/pgsql-to-mysql

DATABASE_URL='postgresql://USER:PASS@HOST:5432/DATABASE' \
  ./01-export-from-source-pgsql.sh cut-environment-data.sql
```

- **Input:** `DATABASE_URL` — connection to the shared PostgreSQL database.
- **Output:** `cut-environment-data.sql` (or the path you pass as the first argument).

Requirements: `psql`, `pg_dump`, and network access to the source DB.

---

### Step 2 — Import the dump into a target PostgreSQL database

**Where:** environment that hosts the **target** PostgreSQL instance (local Docker, staging PG, etc.) — the DB that will become the migration source for MySQL.

**2a — Restore the data-only dump into `cut_export`:**

```bash
psql 'postgresql://USER:PASS@HOST:5432/TARGET_DB' \
  -v ON_ERROR_STOP=1 \
  -f /path/to/cut-environment-data.sql
```

**2b — Copy from `cut_export` into `bilan_carbone` / `common`:**

```bash
psql 'postgresql://USER:PASS@HOST:5432/TARGET_DB' \
  -v ON_ERROR_STOP=1 \
  -f scripts/pgsql-to-mysql/02-import-into-target-pgsql.sql
```

- **Prerequisite:** the target database must already have the legacy Bilan Carbone / Count PostgreSQL schema (tables in `bilan_carbone` and `common`) so the `INSERT … SELECT` statements succeed.
- **After step 2b:** `cut_export` is dropped by the script. The usable data lives in the normal tenant schemas on that PostgreSQL instance.

If this target database is not yet on the **current** Count `public` schema, apply the archived PostgreSQL migrations under `prisma/schema/migrations_postgresql/` and any one-off transforms your ops team uses before step 3.

---

### Step 3 — Copy PostgreSQL → MySQL

**Where:** developer machine or CI job with access to **both** the prepared PostgreSQL source (step 2) and an empty (or reset) **MySQL** database.

**What:** `03-migrate-pg-to-mysql.ts`

From the repository root:

```bash
SOURCE_DATABASE_URL='postgresql://USER:PASS@HOST:5432/TARGET_DB' \
DATABASE_URL='mysql://count:count@localhost:3306/count' \
  yarn script scripts/pgsql-to-mysql/03-migrate-pg-to-mysql.ts
```

- **`SOURCE_DATABASE_URL`:** PostgreSQL database containing the data to copy (current `public` schema layout expected by the script).
- **`DATABASE_URL`:** empty MySQL database (or one you are allowed to truncate). The script runs `prisma migrate deploy`, truncates application tables, then copies rows in FK order.
- **`sub_posts`:** PostgreSQL enum arrays on `emission_factors` are expanded into `emission_factor_sub_posts` on MySQL.
- **Verification:** the script compares PostgreSQL `sub_posts` cardinality with MySQL junction row counts.

Start MySQL locally with `docker compose up -d db` (or `db_test` on port 3307 for tests).

---

## Path B — Direct PostgreSQL (Count, fully migrated) → MySQL

**Where:** same as step 3 above.

Skip steps 01 and 02 when the source is already the Count PostgreSQL database with **all** migrations applied and data in the `public` schema.

```bash
SOURCE_DATABASE_URL='postgresql://count:count@localhost:5432/count' \
DATABASE_URL='mysql://count:count@localhost:3306/count' \
  yarn script scripts/pgsql-to-mysql/03-migrate-pg-to-mysql.ts
```

---

## File map (execution order)

| Order | File                              | Role                                                       |
| ----- | --------------------------------- | ---------------------------------------------------------- |
| 1     | `01-export-from-source-pgsql.sh`  | Export CUT data from shared PG (`cut_export` build + dump) |
| 2     | `02-import-into-target-pgsql.sql` | Load dump into target PG tenant schemas                    |
| 3     | `03-migrate-pg-to-mysql.ts`       | PostgreSQL → MySQL via Prisma                              |

---

## After migration

1. Point the application `DATABASE_URL` at MySQL.
2. Run `yarn db:seed` only if you need reference/dev seed data on top of migrated production data (usually not on production).
3. Run the test suite (`yarn test:unit`, `yarn test:e2e`) against a MySQL test database (`yarn db:test:seed`).

PostgreSQL migration history is archived in `prisma/schema/migrations_postgresql/`. Only `prisma/schema/migrations/` is used for MySQL.
