import { Context } from "hono";
import { ZodError } from "zod";
import { badRequest } from "./response";

export const zodErrorResponse = (c: Context, error: ZodError) => {
    const issue = error.issues[0];

    const rawPath = issue?.path?.[0];
    const firstPath = rawPath !== undefined ? String(rawPath) : "UnknownField";

    const firstMessage = issue?.message ?? "Invalid input";

    const combined = `${firstPath}: ${firstMessage}`;

    return badRequest(c, combined, error.issues);


};
