import { Hono } from "hono";
import { createPickupPoint, updatePickupPoint, deletePickupPoint, getPickupPoints, setFavorite, getPickupPointFavorite, getPickupPointById } from "../controllers/pickup-point.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { idempotencyMiddleware } from "../middlewares/idempotency.middleware";
import { createPickupPointSchema, updatePickupPointSchema, getPickupPointQuerySchema } from "../validators/pickup-point.schema";
import { validateJson, validateQuery, validateParams  } from "../middlewares/validate.middleware";
import { pickupPointIdSchema, deletePickupPointSchema } from "../validators/pickup-point.schema";

const pickupPoints = new Hono();

pickupPoints.use("*", authMiddleware);

pickupPoints.get(
    "/",
    validateQuery(getPickupPointQuerySchema),
    getPickupPoints
);

pickupPoints.get("/detail/:id",
    validateParams(pickupPointIdSchema),
    getPickupPointById
);

pickupPoints.get(
    "/favorite",
    getPickupPointFavorite
);

pickupPoints.post(
    "/",
    validateJson(createPickupPointSchema),
    idempotencyMiddleware,
    createPickupPoint
);

pickupPoints.put(
    "/favorite/:id",
    validateParams(pickupPointIdSchema),
    setFavorite
)

pickupPoints.put(
    "/:id",
    validateParams(pickupPointIdSchema),
    validateJson(updatePickupPointSchema),
    updatePickupPoint
);

pickupPoints.delete(
    "/:id",
    validateParams(pickupPointIdSchema),
    validateJson(deletePickupPointSchema),
    deletePickupPoint
);

export default pickupPoints;