import { Hono } from "hono";
import { createShipment } from "../controllers/shipment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { idempotencyMiddleware } from "../middlewares/idempotency.middleware";
import { createShipmentSchema } from "../validators/shipment.schema";
import { validateJson } from "../middlewares/validate.middleware";

const shipment = new Hono();

shipment.use("*", authMiddleware);

shipment.post(
    "/",
    validateJson(createShipmentSchema),
    idempotencyMiddleware,
    createShipment
);

export default shipment;