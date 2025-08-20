import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
export type Ctx = Record<string, unknown>;
export type MW = (
  req: NextRequest,
  ev: NextFetchEvent,
  ctx: Ctx
) => Promise<NextResponse | void> | NextResponse | void;

export type Finalizer = (
  req: NextRequest,
  ev: NextFetchEvent,
  ctx: Ctx,
  res: NextResponse
) => Promise<NextResponse> | NextResponse;

function asNextResponse(res?: NextResponse): NextResponse {
  return res ?? NextResponse.next();
}

export function compose(opts: { stack: MW[]; always?: Finalizer[] }) {
  const { stack, always = [] } = opts;
  return async (req: NextRequest, ev: NextFetchEvent) => {
    const ctx: Ctx = {};
    let out: NextResponse | void;

    for (const mw of stack) {
      out = await mw(req, ev, ctx);
      if (out) break; // early exit allowed
    }

    // Always-run phase
    let finalRes = asNextResponse(out as NextResponse | undefined);
    for (const f of always) finalRes = await f(req, ev, ctx, finalRes);
    return finalRes;
  };
}
