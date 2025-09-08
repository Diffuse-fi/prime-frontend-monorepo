# Copilot Instructions — dApp (Next.js + RainbowKit/Wagmi/viem + Tailwind/shadcn + Monorepo)

> This file tells GitHub Copilot exactly **how we build this project**: stack choices, coding style, folders, security guardrails, and ready‑to‑use code patterns. Keep this at the repo root as `copilot-instructions.md`.

---

## 0) Stack & Scope

**Primary tech**

- Framework: **Next.js (App Router, TypeScript, RSC-first)**
- Wallet/Connect: **RainbowKit** + **Wagmi** (v2) + **viem**
- Styling/UI: **Tailwind CSS** + **shadcn/ui** (Radix primitives). Custom UI kit lives in a **separate workspace package**.
- Package manager: **npm** monorepo
- Testing: **Vitest** + **Testing Library** (unit), **Playwright** (e2e)
- Lint/format: **ESLint** + **Prettier**

**Core product rules**

- Contract **reads**: server‑side (RSC/server actions) wherever possible.
- Contract **writes**: client‑side via Wagmi; never sign on server.
- No private keys in code. No server-side wallets. No secrets in client bundle.
- Indexing: plan to use a dedicated indexer (e.g., The Graph/Subsquid) for history/aggregations; don’t “loop RPC” in the UI.

---

## 1) Repository Layout (monorepo)

```
/frontend - Next.js app (web)
/ui-kit - shared UI components (shadcn/ui)
/sdk-js - shared JS SDK for smart-contract interactions
```

---

## 2) Next.js Conventions

- **RSC-first**: prefer Server Components for data fetching & rendering. Add `"use client"` only when needed (wallet UI, event handlers, dialogs).
- **App Router** only. Avoid legacy `pages/`.
- **Data caching**:
  - Use `fetch` with `{ next: { revalidate: N, tags: ['tag'] } }` or `cache: 'no-store'` for truly dynamic.
  - For contract reads with viem, wrap in `unstable_cache` or manual tag revalidation when sensible.
- **Environment variables**:
  - Server-only: `ALCHEMY_API_KEY`, `INFURA_API_KEY`, etc. **Don’t** prefix with `NEXT_PUBLIC_`.
  - Client-allowed: `NEXT_PUBLIC_...` only if it’s safe to expose.
- **Imports**: use `@/*` alias.
- **Routing**: group routes under `app/(marketing)`, `app/(app)`, etc.

**Example: server read in a Server Component**

```ts
// apps/web/app/(app)/markets/page.tsx
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

const client = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ALCHEMY_HTTP_URL),
})

export default async function Page() {
  const totalSupply = await client.readContract({
    address: '0x…',
    abi: [{ name: 'totalSupply', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] }],
    functionName: 'totalSupply',
  })

  return <div className="text-sm">Total supply: {totalSupply.toString()}</div>
}
```

---

## 3) UI & Styling

### Tailwind + shadcn/ui kit (separate package)

- The **UI kit** lives in `packages/ui` and exports components + `styles.css` (CSS variables/tokens).
- Apps import tokens once: `@acme/ui/styles.css`.
- Next config must transpile the UI package: `transpilePackages: ['@acme/ui']`.

**Tailwind preset** (shared in `packages/tailwind-config`):

- Exposes theme tokens (colors, radius) and plugins (`tailwindcss-animate`).
- App `tailwind.config.ts` consumes via `presets: [preset]`.
- Add UI package sources to Tailwind `content` globs to enable tree-shaking.

**Dark mode**: class-based (`.dark`).

**Do**: co-locate UI-only CSS with the UI package; keep app styles minimal.  
**Don’t**: copy shadcn components into the app; always go through `@acme/ui` so design is centralized.

---

## 4) Wallet, Wagmi & RainbowKit

### Config

- Keep the Wagmi/RainbowKit provider **in a Client Layout** (`app/(app)/providers.tsx`), not at the root Server Layout.

```ts
// apps/web/app/(app)/providers.tsx
'use client'

import { RainbowKitProvider, getDefaultConfig, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { mainnet, arbitrum, polygon } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const config = getDefaultConfig({
  appName: 'My dApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, arbitrum, polygon],
  ssr: true,
})

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme({ accentColor: 'hsl(var(--primary))' }),
            darkMode:  darkTheme({ accentColor: 'hsl(var(--primary))' }),
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
```

**Usage**

```tsx
// apps/web/app/(app)/layout.tsx
import Providers from "./providers";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// Client component (button)
("use client");
import { ConnectButton } from "@rainbow-me/rainbowkit";
export function WalletButton() {
  return <ConnectButton />;
}
```

### Reads vs Writes

- **Reads**: prefer Server Components via `viem` public client.
- **Writes**: only in Client Components via Wagmi `useWriteContract`, `useSimulateContract`, `useWaitForTransactionReceipt`.

```tsx
// Client write pattern
"use client";
import {
  useWriteContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useState } from "react";

export function ApproveButton({ token, spender, amount, abi }: any) {
  const [hash, setHash] = useState<`0x${string}` | undefined>(undefined);

  const { data: sim } = useSimulateContract({
    address: token,
    abi,
    functionName: "approve",
    args: [spender, amount],
  });

  const { writeContractAsync } = useWriteContract();
  const { data: receipt } = useWaitForTransactionReceipt({ hash });

  return (
    <button
      onClick={async () => {
        if (!sim) return;
        const txHash = await writeContractAsync(sim.request);
        setHash(txHash);
      }}
    >
      {hash ? "Pending…" : "Approve"}
    </button>
  );
}
```

---

## 5) Data Strategy

- **Don’t** fetch historical logs/aggregations directly from the UI every render; that is slow/expensive.
- **Short-term**: precompute on the server with caching (`revalidate`), or a small worker/cron writing to a DB.

---

## 6) Security Guardrails (Copilot must follow)

- **Never** embed private keys, mnemonics, keystore files, or JSON-RPC URLs with secrets in client code.
- **Never** suggest server-side signing or storing user mnemonics.
- Use **`NEXT_PUBLIC_…`** only for non-sensitive values. RPC/API keys must stay server-side.
- For typed data signing (**EIP‑712**), always show a clear UX summary and domain separator values.
- Detect injected wallets via **EIP‑6963** indirectly through RainbowKit/Wagmi. Don’t hand-roll `window.ethereum` logic.
- **RPC providers**: prefer Alchemy/Infura/Ankr etc. Always read from env. Gracefully handle rate limits.
- **Chain safety**: validate `chainId` before sending writes; block unsupported chains.
- **Re-entrancy & approvals UX**: suggest minimal allowances; surface spender + exact allowance; support “Revoke” paths.
- **Transaction UI**: stages = _simulated → prompted → pending → confirmed/failed_; always show hashes and a link to the explorer.

---

## 7) TypeScript & Code Style

- TS: **strict** mode. No `any` unless absolutely necessary. Prefer `satisfies` and const‑assertions.
- Components: **function components**, PascalCase filenames, 1-3 components per file.
- Hooks: `use*` prefix, colocate in `/hooks` if shared.
- Utilities: pure, no side effects.
- State: use Wagmi’s internal TanStack Query for onchain data; optional **Zustand** for pure UI state (drawings, filters).
- Avoid moment/dayjs for heavy date ops when not needed; native `Intl` first.

**Lint/format**: ESLint + Prettier; run on CI; block merges on errors.

---

## 8) Copilot Prompts — Useful Patterns

Use these when asking Copilot in this repo.

### A) Server contract read (RSC)

> “Create a Server Component that reads `userAccountData(address)` from the Aave pool contract on Arbitrum using viem, caches it for 60s, and renders LTV and health factor. Format large numbers.”

### B) Client write with simulation

> “Add a Client Component `SupplyButton` that simulates and then calls `supply(asset, amount, onBehalfOf, referralCode)` on the market contract using Wagmi. Show steps: ‘Simulated’, ‘Confirm in wallet’, ‘Pending tx…’, ‘Confirmed’. Handle user rejection.”

### C) UI kit component

> “In `packages/ui`, add a `StatCard` component with props `{ label, value, hint, icon }`, responsive layout, and export from the package. Write stories and tests.”

### D) Indexer facade

> “Create `lib/indexer.ts` with a function `getUserPositions(address): Promise<…>` that calls `/api/positions?address=…`, caches with `revalidate: 120`, and types the response. The component must not loop RPC calls.”

### E) Error-first UX

> “Wrap async actions in a toast-enabled boundary: show errors with a human label + raw reason from RPC. Map common viem `RpcError` codes to friendly text.”

---

## 9) Environment Variables (examples)

`.env.local` (not committed):

```
ALCHEMY_HTTP_URL=
INFURA_HTTP_URL=
WALLETCONNECT_PROJECT_ID=
INDEXER_BASE_URL=
```

Client-safe (if needed):

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
NEXT_PUBLIC_DEFAULT_CHAIN_ID=1
```

**Rules**

- Never expose RPC keys publicly if the provider forbids it.
- All secrets must be read only on the server.

---

## 10) Example: Bringing it all together

**Server read + Client write + Shared UI**

```tsx
// apps/web/app/(app)/lend/page.tsx (Server Component)
import { createPublicClient, http, formatUnits } from "viem";
import { arbitrum } from "viem/chains";
import { Card } from "@acme/ui";

const client = createPublicClient({
  chain: arbitrum,
  transport: http(process.env.ALCHEMY_HTTP_URL),
});

export default async function LendPage() {
  const { totalDeposits } = (await client.readContract({
    address: "0xMarket…",
    abi: [
      {
        name: "totalDeposits",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ type: "uint256" }],
      },
    ],
    functionName: "totalDeposits",
  })) as { totalDeposits: bigint };

  return (
    <div className="grid gap-6">
      <Card>
        <div className="text-muted-foreground text-xs">Protocol Deposits</div>
        <div className="text-2xl font-semibold">
          {Number(formatUnits(totalDeposits, 18)).toLocaleString()}
        </div>
      </Card>

      {/* Client write below */}
      {/* @ts-expect-error Server/Client boundary */}
      <SupplyWidget />
    </div>
  );
}
```

```tsx
// apps/web/app/(app)/lend/SupplyWidget.tsx (Client Component)
"use client";
import {
  useSimulateContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Button, Input, useToast } from "@acme/ui";
import { useState } from "react";

const market = "0xMarket…";
const abi = [
  /* … */
] as const;

export default function SupplyWidget() {
  const [amount, setAmount] = useState("");
  const { toast } = useToast();

  const { data: sim } = useSimulateContract({
    address: market,
    abi,
    functionName: "supply",
    args: ["0xAsset…", BigInt(amount || "0"), "0xSelf…", 0],
    query: { enabled: Boolean(amount) },
  });

  const { writeContractAsync } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}` | undefined>();
  const { isSuccess, isError } = useWaitForTransactionReceipt({ hash });

  return (
    <div className="flex gap-3">
      <Input
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <Button
        disabled={!sim}
        onClick={async () => {
          try {
            if (!sim) return;
            const h = await writeContractAsync(sim.request);
            setHash(h);
            toast({ title: "Transaction sent", description: h });
          } catch (e: any) {
            toast({
              title: "Transaction failed",
              description: e?.shortMessage ?? e?.message,
              variant: "destructive",
            });
          }
        }}
      >
        {hash ? (isSuccess ? "Supplied" : "Pending…") : "Supply"}
      </Button>
    </div>
  );
}
```

---

## 11) Anti‑Patterns (Copilot: avoid generating)

- Accessing `window.ethereum` directly instead of Wagmi connectors.
- Server-side writes or exposing signers on server.
- Hardcoding RPC URLs/API keys in client code.
- Fetching unbounded historical logs in client without pagination/caching.
- Storing sensitive data in localStorage.
- Non-deterministic decimals handling (always store onchain values as `bigint` and format at the edge).

---

**That’s it.** Copilot, follow this document for style, structure, and guardrails in this repo. Prefer RSC for reads, Wagmi for writes, Tailwind+shadcn for UI, and keep secrets off the client.
