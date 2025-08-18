"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Locale, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/crypto/wagmi";
import { PropsWithLocale } from "@/lib/localization/locale";
import { ReactNode } from "react";

type ProvidersProps = PropsWithLocale<{
  children: ReactNode;
}>;

const queryClient = new QueryClient();

export function Providers({ children, locale }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider locale={locale as Locale}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
