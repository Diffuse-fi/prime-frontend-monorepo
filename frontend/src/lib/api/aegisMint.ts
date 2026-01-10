import { getApiUrl } from ".";

export type AegisMintResponse = {
  data: {
    order: Record<string, unknown>;
    signature: string;
  };
  encodedData: string;
  signerSignature: string;
  status: "success";
};

type AegisMintApiError = {
  error?: string;
  message?: string;
};

export async function aegisMint(
  params: {
    collateral_amount: string;
    collateral_asset: string;
    slippage: number;
  },
  opts: { signal?: AbortSignal } = {}
): Promise<AegisMintResponse> {
  const res = await fetch(getApiUrl("mint"), {
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
    const message = isAegisMintApiError(data)
      ? (data.error ?? data.message ?? `HTTP ${res.status}`)
      : `HTTP ${res.status}`;
    throw new Error(message);
  }

  if (!isAegisMintResponse(data)) {
    throw new TypeError(
      `Invalid mint response: expected { status:"success", data:{order,signature}, encodedData, signerSignature }, received: ${JSON.stringify(
        data
      )}`
    );
  }

  return data;
}

function isAegisMintApiError(v: unknown): v is AegisMintApiError {
  if (!isRecord(v)) return false;
  if (v.error !== undefined && typeof v.error !== "string") return false;
  if (v.message !== undefined && typeof v.message !== "string") return false;
  return true;
}

function isAegisMintResponse(v: unknown): v is AegisMintResponse {
  if (!isRecord(v)) return false;
  if (v.status !== "success") return false;
  if (!isRecord(v.data)) return false;
  if (!isRecord(v.data.order)) return false;
  if (typeof v.data.signature !== "string") return false;
  if (typeof v.encodedData !== "string") return false;
  if (typeof v.signerSignature !== "string") return false;
  return true;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
