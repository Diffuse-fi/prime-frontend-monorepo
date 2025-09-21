"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Locale, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi/config";
import { ReactNode } from "react";
import { queryClient } from "@/lib/query/client";
import { useRainbowTheme } from "@/lib/theme/rainbowTheme";
import Image from "next/image";
import { env } from "@/env";
import { useReadonlyChainState } from "@/lib/chains/ReadonlyChainContext";

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
          theme={theme}
          locale={locale as Locale}
          initialChain={readonlyChainId}
          appInfo={{
            appName: env.NEXT_PUBLIC_APP_NAME,
          }}
          avatar={() => <Image src="/logo.svg?v=1" alt="Avatar" width={64} height={64} />}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
