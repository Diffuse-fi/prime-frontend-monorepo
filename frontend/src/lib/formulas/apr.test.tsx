import { describe, it, expect } from "vitest";
import { calcAprInterest, calcAverageApr, calcAprByInterestEarned } from "./apr.js";

describe("APR formulas", () => {
  const BPS = 10_000n;

  describe("calcAprInterest", () => {
    it("returns 0n when apr is 0n or amount is 0n", () => {
      expect(calcAprInterest(0n, 1_000n, { aprScale: BPS })).toBe(0n);
      expect(calcAprInterest(1_000n, 0n, { aprScale: BPS })).toBe(0n);
    });

    it("computes interest for 10% APR over 365 days (BPS)", () => {
      const apr = 1_000n;
      const amount = 1_000_000n;
      const expected = (amount * apr * 365n) / (BPS * 365n);
      expect(calcAprInterest(apr, amount, { aprScale: BPS })).toBe(expected);
    });

    it("prorates linearly with durationInDays", () => {
      const apr = 1_000n;
      const amount = BPS * 365n;

      const i30 = calcAprInterest(apr, amount, { aprScale: BPS, durationInDays: 30 });
      const i60 = calcAprInterest(apr, amount, { aprScale: BPS, durationInDays: 60 });

      expect(i30).toBe(apr * 30n);
      expect(i60).toBe(apr * 60n);
      expect(i60).toBe(2n * i30);
    });
  });

  describe("calcAprByInterestEarned", () => {
    it("returns 0n when interest is 0n or amount is 0n", () => {
      expect(calcAprByInterestEarned(0n, 1_000n, { aprScale: BPS })).toBe(0n);
      expect(calcAprByInterestEarned(1_000n, 0n, { aprScale: BPS })).toBe(0n);
    });

    it("inverts calcAprInterest with defaults (round-trip property)", () => {
      const apr = 1_234n;
      const amount = 1_000_000n;
      const interest = calcAprInterest(apr, amount);
      const recoveredApr = calcAprByInterestEarned(interest, amount);

      expect(recoveredApr).toBe(apr);
    });

    it("inverts calcAprInterest with custom aprScale and duration", () => {
      const WAD = 1_000_000_000_000_000_000n;
      const opts = { aprScale: WAD, durationInDays: 30 };
      const apr = 123_456_789_012_345_678n;
      const amount = 987_654_321n;

      const interest = calcAprInterest(apr, amount, opts);
      const recoveredApr = calcAprByInterestEarned(interest, amount, opts);

      expect(recoveredApr <= apr).toBe(true);

      // we can not calculate with perfect precision due to truncation, this is a fallback
      // to make sure we are close enough (within 1 unit of aprScale)
      const days = BigInt(opts.durationInDays);
      if (amount * days >= opts.aprScale * 365n) {
        expect(apr - recoveredApr <= 1n).toBe(true);
      }
    });
  });

  describe("calcAverageApr", () => {
    it("returns 0n for empty list", () => {
      expect(calcAverageApr([], BPS)).toBe(0n);
    });

    it("with BPS scale, returns truncated integer “real units”", () => {
      const aprs = [1_000n, 500n];
      const expected = 1_500n / BPS / 2n;

      expect(calcAverageApr(aprs, BPS)).toBe(expected);
    });

    it("matches the explicit BigInt formula for any inputs", () => {
      const aprs = [25_000n, 15_000n, 5_000n];
      const expected = aprs.reduce((a, b) => a + b, 0n) / BPS / BigInt(aprs.length);

      expect(calcAverageApr(aprs, BPS)).toBe(expected);
    });
  });
});
