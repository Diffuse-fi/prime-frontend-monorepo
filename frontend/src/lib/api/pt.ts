import { getApiUrl } from ".";

export type GetPtAmountResponse = {
  amounts: string[];
  finished: boolean;
};

type PtAmountApiError = {
  error: string;
};

export async function getPtAmount(
  params: {
    strategy_id: string;
    usdc_amount: string;
    vault_address: string;
  },
  opts: { signal?: AbortSignal } = {}
): Promise<GetPtAmountResponse> {
  const res = await fetch(getApiUrl("ptAmount"), {
    body: JSON.stringify(params),
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
    const message = isPtAmountApiError(data) ? data.error : `HTTP ${res.status}`;
    throw new Error(message);
  }

  if (!isGetPtAmountResponse(data)) {
    throw new TypeError(
      `Invalid ptAmount response: expected { finished: boolean; amounts: string[] }, received: ${JSON.stringify(
        data
      )}`
    );
  }

  return data;
}

function isGetPtAmountResponse(v: unknown): v is GetPtAmountResponse {
  if (!isRecord(v)) return false;
  if (typeof v.finished !== "boolean") return false;
  if (!Array.isArray(v.amounts)) return false;
  return v.amounts.every(x => typeof x === "string");
}

function isPtAmountApiError(v: unknown): v is PtAmountApiError {
  return isRecord(v) && typeof v.error === "string";
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
