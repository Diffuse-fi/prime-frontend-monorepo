"use client";

import { TokenImage } from "@/components/TokenImage";
import { useVaults } from "@/lib/core/useVaults";
import { useLocalization } from "@/lib/localization/useLocalization";
import { useTokensList } from "@/lib/tokens/useTokensList";
import { Card, TokenInput } from "@diffuse/ui-kit";

export default function LendPage() {
  const { dict } = useLocalization();
  const { tokensList } = useTokensList();
  const vaults = useVaults();

  console.log("tokensList", tokensList);
  console.log("strategies", vaults);

  return (
    <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 sm:gap-4">
      <Card title={dict.lend.assetsToLend}>
        Тфьу
        <TokenInput
          tokenSymbol="mUSDC"
          renderTokenImage={() => <TokenImage imgURI="" alt="" address="" />}
        />
      </Card>
    </div>
  );
}
