import { Hono } from "hono";
import { register, isRegistered } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth-register.middleware";
import { createRegisterSchema, isRegisteredSchema } from "../validators/auth.schema";
import { validateJson } from "../middlewares/validate.middleware";
import { idempotencyMiddleware } from "../middlewares/idempotency.middleware";

const auth = new Hono();

auth.post(
    "/register",
    validateJson(createRegisterSchema),
    idempotencyMiddleware,
    authMiddleware,
    register
);

auth.post(
    "/is-registered",
    validateJson(isRegisteredSchema),
    authMiddleware,
    isRegistered
);

export default auth;