import type { Context, Next } from "hono";
import { logger as winstonLogger } from "../config/logger";

export const requestLogger = async (c: Context, next: Next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    winstonLogger.info(`${c.req.method} ${c.req.path} → ${c.res.status} (${ms}ms)`);
};
