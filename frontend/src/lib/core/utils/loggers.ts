import { createLogger } from "@/lib/logger/logger";

export const lendLogger = createLogger("app:lend");
export const borrowLogger = createLogger("app:borrow");

export const loggerMut = createLogger("rq:mut");
export const loggerQry = createLogger("rq:query");

export const walletLogger = createLogger("wallet");
export const chainLogger = createLogger("chain");
