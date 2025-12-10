import { Hono } from "hono";
import { checkPrice } from "../controllers/autokirim-check-price.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkPriceSchema } from "../validators/autokirim-check-price.schema";
import { validateJson } from "../middlewares/validate.middleware";

const price = new Hono();

price.use("*", authMiddleware);

price.post(
    "/check",
    validateJson(checkPriceSchema),
    checkPrice
);

export default price;