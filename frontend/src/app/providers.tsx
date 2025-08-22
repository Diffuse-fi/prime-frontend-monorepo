"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Locale, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi/config";
import { PropsWithLocale } from "@/lib/localization/locale";
import { ReactNode } from "react";
import { queryClient } from "@/lib/query/client";
import { useRainbowTheme } from "@/lib/theme/rainbowTheme";
import { getInitialChain } from "@/lib/wagmi/chains";

type ProvidersProps = PropsWithLocale<{
  children: ReactNode;
}>;

export function Providers({ children, locale }: ProvidersProps) {
  const theme = useRainbowTheme();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={theme}
          locale={locale as Locale}
          initialChain={getInitialChain()}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
