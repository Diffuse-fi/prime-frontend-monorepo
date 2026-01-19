import { Strategy, VaultFullInfo } from "@/lib/core/types";

export type SelectedStartegy = Strategy & {
  vault: VaultFullInfo;
};
