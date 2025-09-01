import { SCALES } from "../formatters/config";

export type CalculateAprOpts = {
  durationInDays?: number;
  aprScale?: bigint;
  daysInYear?: number;
};

export function calcAprInterest(
  apr: bigint,
  amount: bigint,
  { durationInDays = 365, aprScale = SCALES.BPS, daysInYear = 365 }: CalculateAprOpts = {}
): bigint {
  if (apr === 0n || amount === 0n) return 0n;

  return (amount * apr * BigInt(durationInDays)) / (aprScale * BigInt(daysInYear));
}
