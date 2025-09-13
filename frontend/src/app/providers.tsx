"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Locale, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi/config";
import { ReactNode } from "react";
import { queryClient } from "@/lib/query/client";
import { useRainbowTheme } from "@/lib/theme/rainbowTheme";
import { getInitialChain } from "@/lib/chains";
import Image from "next/image";

type ProvidersProps = {
  children: ReactNode;
  locale: string;
};

export function Providers({ children, locale }: ProvidersProps) {
  const theme = useRainbowTheme();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={theme}
          locale={locale as Locale}
          initialChain={getInitialChain()}
          appInfo={{
            appName: "Diffuse Prime",
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
