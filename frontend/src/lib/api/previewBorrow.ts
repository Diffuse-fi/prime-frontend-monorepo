import { getApiUrl } from ".";

export type PreviewBorrowResponse = {
  assetsReceived: string[];
};

type PreviewBorrowApiError = {
  availableLiquidity?: string;
  error: string;
  requestedBorrow?: string;
};

export async function previewBorrow(
  params: {
    assets_to_borrow: string;
    collateral_amount: string;
    collateral_type: string;
    data?: string;
    strategy_id: string;
    vault_address: string;
  },
  opts: { signal?: AbortSignal } = {}
): Promise<PreviewBorrowResponse> {
  const res = await fetch(getApiUrl("previewBorrow"), {
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
    const message = isPreviewBorrowApiError(data) ? data.error : `HTTP ${res.status}`;
    throw new Error(message);
  }

  if (!isPreviewBorrowResponse(data)) {
    throw new TypeError(
      `Invalid previewBorrow response: expected { assetsReceived: string[] }, received: ${JSON.stringify(
        data
      )}`
    );
  }

  return data;
}

function isPreviewBorrowApiError(v: unknown): v is PreviewBorrowApiError {
  if (!isRecord(v)) return false;
  if (typeof v.error !== "string") return false;
  if (v.availableLiquidity !== undefined && typeof v.availableLiquidity !== "string")
    return false;
  if (v.requestedBorrow !== undefined && typeof v.requestedBorrow !== "string")
    return false;
  return true;
}

function isPreviewBorrowResponse(v: unknown): v is PreviewBorrowResponse {
  if (!isRecord(v)) return false;
  if (!Array.isArray(v.assetsReceived)) return false;
  return v.assetsReceived.every(x => typeof x === "string");
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
