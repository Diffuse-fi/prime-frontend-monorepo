export function calcBorrowingFactor(
  borrowAPR: bigint,
  spreadFee: number,
  secondsUntilStrategyEnd: bigint
): bigint {
  const YEAR = BigInt(60 * 60 * 24 * 365);
  return ((borrowAPR + BigInt(spreadFee)) * secondsUntilStrategyEnd) / YEAR;
}
