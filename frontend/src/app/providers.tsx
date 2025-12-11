"use client";

import { Locale, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClientProvider } from "@tanstack/react-query";
import Image from "next/image";
import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { env } from "@/env";
import { useReadonlyChainState } from "@/lib/chains/ReadonlyChainContext";
import { queryClient } from "@/lib/query/client";
import { useRainbowTheme } from "@/lib/theme/rainbowTheme";
import { config } from "@/lib/wagmi/config";

type ProvidersProps = {
  children: ReactNode;
  locale: string;
};

export function Providers({ children, locale }: ProvidersProps) {
  const theme = useRainbowTheme();
  const { readonlyChainId } = useReadonlyChainState();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          appInfo={{
            appName: env.NEXT_PUBLIC_APP_NAME,
          }}
          avatar={() => <Image alt="Avatar" height={64} src="/logo.svg?v=1" width={64} />}
          initialChain={readonlyChainId}
          locale={locale as Locale}
          modalSize="compact"
          theme={theme}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
