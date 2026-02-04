import { Strategy, VaultFullInfo } from "@/lib/core/types";

export type SelectedStrategy = Strategy & {
  vault: VaultFullInfo;
};
