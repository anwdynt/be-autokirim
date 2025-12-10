import { Hono } from "hono";
import { createShipmentAddress, updateShipmentAddress, deleteShipmentAddress, getShipmentAddresses, getShipmentAddressById } from "../controllers/shipment-address.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { idempotencyMiddleware } from "../middlewares/idempotency.middleware";
import { createShipmentAddressSchema, updateShipmentAddressSchema, getShipmentAddressQuerySchema } from "../validators/shipment-address.schema";
import { validateJson, validateQuery, validateParams  } from "../middlewares/validate.middleware";
import { shipmentAddressIdSchema } from "../validators/shipment-address.schema";

const shipmentAddresses = new Hono();

shipmentAddresses.use("*", authMiddleware);

shipmentAddresses.get(
    "/",
    validateQuery(getShipmentAddressQuerySchema),
    getShipmentAddresses
);

shipmentAddresses.get(
    "/detail/:id",
    validateParams(shipmentAddressIdSchema),
    getShipmentAddressById
);

shipmentAddresses.post(
    "/",
    validateJson(createShipmentAddressSchema),
    idempotencyMiddleware,
    createShipmentAddress
);

shipmentAddresses.put(
    "/:id",
    validateParams(shipmentAddressIdSchema),
    validateJson(updateShipmentAddressSchema),
    updateShipmentAddress
);

shipmentAddresses.delete(
    "/:id",
    validateParams(shipmentAddressIdSchema),
    deleteShipmentAddress
);

export default shipmentAddresses;