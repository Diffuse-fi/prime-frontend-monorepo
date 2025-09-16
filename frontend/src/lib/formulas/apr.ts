import { SCALES } from "../formatters/config";

export type CalculateAprOpts = {
  durationInDays?: number;
  aprScale?: bigint;
};

const daysInYear = 365;

export function calcAprInterest(
  apr: bigint,
  amount: bigint,
  { durationInDays = 365, aprScale = SCALES.BPS }: CalculateAprOpts = {}
): bigint {
  if (apr === 0n || amount === 0n) return 0n;

  return (amount * apr * BigInt(durationInDays)) / (aprScale * BigInt(daysInYear));
}

export function calcAverageApr(aprs: bigint[], aprScale = SCALES.BPS): bigint {
  if (aprs.length === 0) return 0n;

  const totalApr = aprs.reduce((acc, apr) => acc + apr, 0n);
  return totalApr / aprScale / BigInt(aprs.length);
}

export function calcAprByInterestEarned(
  interest: bigint,
  amount: bigint,
  { durationInDays = 365, aprScale = SCALES.BPS }: CalculateAprOpts = {}
): bigint {
  if (interest === 0n || amount === 0n) return 0n;

  return (interest * aprScale * BigInt(daysInYear)) / (amount * BigInt(durationInDays));
}
