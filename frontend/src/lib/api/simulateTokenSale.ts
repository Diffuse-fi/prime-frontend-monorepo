import { getApiUrl } from ".";

export type SimulateTokenSaleResponse = {
  amountOut: string;
};

type SimulateTokenSaleApiError = {
  error: string;
};

export async function simulateTokenSale(
  params: {
    adapters: string[];
    amount: string;
    data?: string;
  },
  opts: { signal?: AbortSignal } = {}
): Promise<SimulateTokenSaleResponse> {
  const res = await fetch(getApiUrl("simulateTokenSale"), {
    body: JSON.stringify({
      ...params,
      data: params.data ?? "0x",
    }),
    headers: { "content-type": "application/json" },
    method: "POST",
    signal: opts.signal,
  });

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = isSimulateTokenSaleApiError(data) ? data.error : `HTTP ${res.status}`;
    throw new Error(message);
  }

  const amountOut = extractAmountOut(data);
  if (!amountOut) {
    throw new TypeError(
      `Invalid simulateTokenSale response: expected amount string, received: ${JSON.stringify(
        data
      )}`
    );
  }

  return { amountOut };
}

function extractAmountOut(v: unknown): null | string {
  if (!isRecord(v)) return null;

  if (typeof v.amountOut === "string") return v.amountOut;
  if (typeof v.amount === "string") return v.amount;

  if (Array.isArray(v.amounts) && v.amounts.every(x => typeof x === "string")) {
    return v.amounts.at(-1) ?? null;
  }

  if (
    Array.isArray(v.assetsReceived) &&
    v.assetsReceived.every(x => typeof x === "string")
  ) {
    return v.assetsReceived.at(-1) ?? null;
  }

  if (Array.isArray(v.buyResults)) {
    const last = v.buyResults.at(-1);
    if (isRecord(last) && typeof last.amountOut === "string") {
      return last.amountOut;
    }
  }

  return null;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isSimulateTokenSaleApiError(v: unknown): v is SimulateTokenSaleApiError {
  return isRecord(v) && typeof v.error === "string";
}
