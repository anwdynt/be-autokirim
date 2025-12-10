import { Context, Next } from "hono";
import { prisma } from "../config/prisma";

export const idempotencyMiddleware = async (c: Context, next: Next) => {
    const MODE = process.env.MODE!;
    if (MODE === "DEVELOPMENT") {
        // Skip idempotency in development mode
        return next();
    }
    const key = c.req.header("Idempotency-Key");

    if (!key) return next();

    const existing = await prisma.idempotency_keys.findUnique({
        where: { key }
    });

    if (existing && existing.response) {
        const saved = JSON.parse(existing.response);
        return c.json(saved.data, saved.init);
    }

    const originalJson = c.json.bind(c);
    let capturedBody: any = null;

    // Override JSON
    c.json = (data: any, init?: any) => {
        let normalizedInit: any = {};

        if (typeof init === "number") {
            normalizedInit = { status: init };
        } else if (typeof init === "object" && init !== null) {
            normalizedInit = init;
        }

        capturedBody = { data, init: normalizedInit };

        return originalJson(data, normalizedInit);
    };

    await next();

    if (capturedBody) {
        await prisma.idempotency_keys.create({
            data: {
                key,
                response: JSON.stringify(capturedBody)
            }
        });
    }
};

