---
applyTo: "frontend/src/**/*.ts,frontend/src/**/*.tsx,frontend/tests/**/*.ts,frontend/tests/**/*.tsx"
---

# Frontend Instructions

Apply these rules in addition to the repo-wide guide when editing `frontend/`.

## App Router

- Follow the existing Next.js App Router structure under `frontend/src/app/[lang]`.
- Prefer server components by default; add `"use client"` only when interactivity, browser APIs, wallet access, or local state require it.
- Keep route logic in `app/`, shared app behavior in `components/`, and reusable frontend domain logic in `lib/`.

## Localization

- The frontend is locale-scoped under `[lang]`. Preserve that routing model.
- Use `getTranslations` and other `next-intl/server` helpers in server components and route files.
- Use `useTranslations` in client components.
- Do not hardcode new user-facing strings in components if they belong in the dictionaries.
- When changing translation keys or dictionaries, keep namespaces aligned and run `npm run check:i18n -w frontend`.

## Wagmi And Wallet Flows

- Wallet writes, signing, and chain-switch prompts must stay in client components.
- Reads may remain server-side or in existing query hooks, depending on the current pattern in the touched feature.
- Reuse the existing wagmi and protocol hooks in `frontend/src/lib/core` and `frontend/src/lib/wagmi` instead of duplicating write logic in UI components.
- Preserve current handling of user-rejected wallet actions; do not turn them into generic failure flows.

## Environment Variables

- Frontend env access should go through `frontend/src/env.ts`.
- If you add or rename env vars, update `frontend/src/env.ts` and keep `frontend/scripts/validateEnv.ts` passing.
- Only `NEXT_PUBLIC_*` values may be exposed to client code. Treat every non-`NEXT_PUBLIC_*` variable as server-only.

## Toast And Error UX

- Reuse `toast` from `@/lib/toast` for notification UX instead of inventing another notification path.
- Error messages should be actionable and preserve important underlying context when safe to show, especially for API and wallet failures.
- Prefer existing error helpers and existing per-feature patterns over ad hoc string building.
- Avoid swallowing errors silently. If an error is intentionally ignored, make that choice explicit in code.

## Required Checks

- Run the smallest relevant frontend verification for the change.
- Default checks for frontend code:
  - `npm run test:unit -w frontend`
  - `npm run build -w frontend`
- For localization changes:
  - `npm run check:i18n -w frontend`
- For route, navigation, or end-to-end flow changes:
  - `npm run test:e2e -w frontend` when feasible
