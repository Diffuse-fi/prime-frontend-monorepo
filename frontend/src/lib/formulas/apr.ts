import { SCALES } from "../formatters/config";

export type CalculateAprOpts = {
  aprScale?: bigint;
  durationInDays?: number;
};

const daysInYear = 365;

export function calcAprByInterestEarned(
  interest: bigint,
  amount: bigint,
  { aprScale = SCALES.BPS, durationInDays = 365 }: CalculateAprOpts = {}
): bigint {
  if (interest === 0n || amount === 0n) return 0n;

  return (interest * aprScale * BigInt(daysInYear)) / (amount * BigInt(durationInDays));
}

export function calcAprInterest(
  apr: bigint,
  amount: bigint,
  { aprScale = SCALES.BPS, durationInDays = 365 }: CalculateAprOpts = {}
): bigint {
  if (apr === 0n || amount === 0n) return 0n;

  return (amount * apr * BigInt(durationInDays)) / (aprScale * BigInt(daysInYear));
}

export function calcAverageApr(aprs: bigint[], aprScale = SCALES.BPS): bigint {
  if (aprs.length === 0) return 0n;

  const totalApr = aprs.reduce((acc, apr) => acc + apr, 0n);
  return totalApr / aprScale / BigInt(aprs.length);
}
