import { Hono } from "hono";
import { getDistricts } from "../controllers/district.controller";
import { authMiddleware } from "../middlewares/auth-register.middleware";
import { getDistrictQuerySchema } from "../validators/districts.schema";
import { validateQuery } from "../middlewares/validate.middleware";

const districts = new Hono();

districts.use("*", authMiddleware);

districts.get(
    "/",
    validateQuery(getDistrictQuerySchema),
    getDistricts
);

export default districts;