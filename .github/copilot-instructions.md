# Diffuse Prime monorepo Agent Guide

This file is the shared starting point for repository-wide agents and assistants.
It is intentionally short and repo-specific: use it as a map, then read the nearest package `README.md`, `package.json`, and touched source files before making changes.

Because this file is symlinked from `AGENTS.md` and `CLAUDE.md`, keep it vendor-neutral and useful for any coding agent.

## Mission

Work safely inside the Diffuse Prime monorepo.
Prefer small, accurate changes that match existing patterns over broad rewrites.
When behavior, architecture, or package boundaries are unclear, inspect the code and package docs first.

## Repo Map

- `frontend/`: Next.js 15 app-router app. Routes live in `frontend/src/app/[lang]`; UI in `frontend/src/components`; business logic in `frontend/src/lib`; localization in `frontend/src/dictionaries`; tests in `frontend/tests` and colocated `*.test.ts(x)`. Frontend-specific guidance lives in `.github/instructions/frontend.instructions.md`.
- `ui-kit/`: shared React 19 component library. Source in `ui-kit/src`; stories in Ladle; tests in Vitest.
- `sdk-js/`: shared contract SDK. Source in `sdk-js/src`; contract assets in `sdk-js/src/contracts/*/abi.json`.
- `indexer/`: Drizzle/Postgres indexing package. Source in `indexer/src`; DB code in `indexer/src/features/db`; migrations in `indexer/migrations`.
- `config/`: shared chains, assets, addresses, and common config consumed by other packages.
- `scripts/`: repo maintenance checks.
- `.changeset/`: release metadata.
- `.github/workflows/`: CI is the final source of truth for required checks.

## Tech Stack

- Monorepo: npm workspaces
- Runtime/tooling: Node 22.x, npm 10+
- Language: TypeScript with strict settings
- Frontend: Next.js 15, React 19, `next-intl`, Wagmi, RainbowKit, viem, Sentry
- UI: Tailwind CSS v4, Radix UI, Ladle
- Libraries/build: Vite, vite-plugin-dts
- Testing: Vitest, Testing Library, Playwright
- DB/indexing: Drizzle, `pg`

## Working Style

- Read before editing. Start with the nearest package `README.md`, `package.json`, and the files already implementing the same pattern.
- Keep diffs narrow. Do not introduce new frameworks, architectural layers, or coding styles when the repo already has an established pattern.
- Prefer progressive disclosure: this file is the map; package READMEs, workflow files, env schemas, and source code are the deeper source of truth.
- Reusable task prompts live in `.github/prompts/`.
- If a package grows special rules that make this file too long, add a package-local `AGENTS.md` or a path-specific `.github/instructions/*.instructions.md` file instead of bloating this one.
- If you cannot run a needed verification step, say so explicitly in your final report.
- Prefer to make one commit per logical change and verify that the commit name satisfies the existing commit message style (find it in `commitlint.config.ts`).
- When making a UI change ensure it will work correctly in both light and dark mode, and that it is responsive across screen sizes.
- If you are unsure about the design implications of a change, say so explicitly in your final report.

## Package Boundaries

- Put shared chain, asset, and address data in `config/`, not duplicated in app code.
- Put reusable contract logic in `sdk-js/`, not copied into `frontend/`.
- Put reusable presentation components in `ui-kit/`; avoid app-specific business logic there.
- Keep `frontend/` focused on app composition, flows, route handling, localization, and wallet UX.
- When adding support for a new chain, asset, or address, start in `config/`, then update downstream consumers.
- When changing design-system components, update `ui-kit/` first, then frontend consumers.
- When changing indexer data shapes, update schema and migrations together.

## TypeScript And Imports

- Use the existing path aliases defined in each package `tsconfig.json`.
- Preserve ESM conventions already used across packages.
- Prefer explicit types for exported APIs and shared utilities.
- Match existing import style and file organization in the touched package.

## Validation

Use the smallest relevant validation first, then broader checks if the change touches shared behavior.

### Root

- `npm run lint`, `npm run test:unit`, `npm run build`
- `npm run check:format`, `npm run check:syncpack`, `npm run check:packages-sync`, `npm run check:licenses`

### UI Kit

- `npm run test:unit -w ui-kit`, `npm run test:unit:snap -w ui-kit`
- `npm run build -w ui-kit`, `npm run ladle -w ui-kit`

### SDK / Indexer / Config

- `npm run build -w sdk-js`, `npm run test:unit -w sdk-js`
- `npm run build -w indexer`, `npm run test:unit -w indexer`, `npm run db:check -w indexer`
- `npm run build -w config`, `npm run check -w config`

## Dependency And Release Rules

- The repo uses Syncpack to keep versions aligned. After dependency changes, run `npm run check:syncpack`.
- Production dependencies are intentionally pinned. Follow the existing semver policy instead of adding loose ranges casually.
- The repo uses Changesets. Add a changeset when a package-facing change should affect release notes or versions.
- The repo uses `ignore-scripts=true` and Lavamoat protections. Do not bypass this casually; use the existing `npm run setup` flow.

## Security Guardrails

- Never add secrets, private keys, seed phrases, or RPC credentials to source control.
- Do not move server-only values into client-exposed env vars.
- Avoid suggesting server-side signing flows for user wallets.
- Preserve dependency and install-script hardening unless the task explicitly changes security posture.
- If you cannot verify the security implications of a change, say so explicitly in your final report.
- Ensure eslint, tests, prettier, knip and other checks pass before suggesting a change that would be merged.
- Ensure Typescript errors are resolved before suggesting a change that would be merged.

## Good Agent Behavior In This Repo

- Explain assumptions when they matter.
- Verify with code, tests, or build output instead of guessing.
- Update nearby docs when code changes make them stale.
- Prefer fixing the root cause over layering workaround logic.
- Leave the repo easier for the next agent to understand.
