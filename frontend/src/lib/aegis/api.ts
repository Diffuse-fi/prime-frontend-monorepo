import type { AegisRedeemRequest, AegisRedeemResponse } from "./types";
import type { Hex } from "viem";

export async function requestAegisRedeemEncodedData(args: {
  baseUrl: string;
  req: AegisRedeemRequest;
}) {
  console.log("Requesting Aegis redeem encoded data with args:", args);
  const res = await fetch(`${args.baseUrl}/redeem`, {
    body: JSON.stringify({
      collateral_asset: args.req.collateralAsset,
      slippage: args.req.slippageBps.toString(),
      yusd_amount: args.req.yusdAmount.toString(),
    }),
    headers: { "content-type": "application/json" },
    method: "POST",
  });

  if (!res.ok) throw new Error(`Redeem API error: ${res.status}`);

  const json = (await res.json()) as Partial<AegisRedeemResponse> & {
    encoded_data?: Hex;
    encodedData?: Hex;
  };

  const encoded = (json.encodedData ?? json.encoded_data) as Hex | undefined;
  if (!encoded) throw new Error("Redeem API response missing encodedData");

  return { encodedData: encoded };
}
