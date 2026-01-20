import type { AegisRouteInfo } from "./types";
import type { Hex } from "viem";

import { decodeAbiParameters, parseAbiParameters } from "viem";

const params = parseAbiParameters("address, uint256, uint256");

export function decodeAegisRouteInfo(data: Hex): AegisRouteInfo {
  const [instanceAddress, instanceIndex, yusdAmount] = decodeAbiParameters(params, data);
  return { instanceAddress, instanceIndex, yusdAmount };
}
