import { z } from "zod";
import { Context, Next } from "hono";
import { zodErrorResponse } from "../utils/zod";

export const validateQuery = (schema: z.ZodSchema<any>) => {
    return async (c: Context, next: Next) => {
        const query = c.req.query();

        const parsed = schema.safeParse(query);

        if (!parsed.success) {
            return zodErrorResponse(c, parsed.error);
        }

        // inject validated result into context
        c.set("validatedQuery", parsed.data);

        await next();
    };
};

export const validateJson = (schema: z.ZodSchema<any>) => {
    return async (c: Context, next: Next) => {
        const body = await c.req.json().catch(() => null);

        const parsed = schema.safeParse(body);

        if (!parsed.success) {
            return zodErrorResponse(c, parsed.error);
        }

        c.set("validatedBody", parsed.data);

        await next();
    };
};

export const validateParams = (schema: z.ZodSchema<any>) => {
    return async (c: Context, next: Next) => {
        const params = c.req.param(); // ambil params dari URL
        
        const parsed = schema.safeParse(params);

        if (!parsed.success) {
            return zodErrorResponse(c, parsed.error);
        }
        c.set("validatedParams", parsed.data);

        await next();
    };
};


