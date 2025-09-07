"use client";

import { useVaults } from "@/lib/core/useVaults";
import { useRouter } from "next/navigation";
import { localizePath } from "@/lib/localization/locale";
import { useLocalization } from "@/lib/localization/useLocalization";
import { ExternalLink } from "lucide-react";

export default function MyPositions() {
  const { vaults, vaultsAssetsList } = useVaults();
  const router = useRouter();
  const { dict, lang, dir } = useLocalization();
  const onAddMoreLiquidity = () => router.push(localizePath("/lend/deposit", lang));

  return (
    <div className="flex flex-col gap-6">
      <div></div>
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-2 sm:gap-4"></div>
    </div>
  );
}
