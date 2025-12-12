import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export type Ctx = Record<string, unknown>;
export type Finalizer = (
  req: NextRequest,
  ev: NextFetchEvent,
  ctx: Ctx,
  res: NextResponse
) => NextResponse | Promise<NextResponse>;

export type MW = (
  req: NextRequest,
  ev: NextFetchEvent,
  ctx: Ctx
) => NextResponse | Promise<NextResponse | void> | void;

export function compose(opts: { always?: Finalizer[]; stack: MW[] }) {
  const { always = [], stack } = opts;

  return async (req: NextRequest, ev: NextFetchEvent) => {
    const ctx: Ctx = {};
    // eslint-disable-next-line unicorn/no-useless-undefined
    let out: NextResponse | void = undefined;

    for (const mw of stack) {
      out = await mw(req, ev, ctx);
      if (out) break;
    }

    let finalRes = out ?? NextResponse.next();
    for (const f of always) finalRes = await f(req, ev, ctx, finalRes);

    return finalRes;
  };
}
