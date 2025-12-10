import { checkPriceService } from "../service/autokirim-check-price.service";
import { Context } from "hono";
import { success, badRequest } from "../utils/response";

export const checkPrice = async (c: Context) => {
    try {
        const body = c.get("validatedBody");
        const result = await checkPriceService.checkPrice(body);
        return success(c, result, "Check price successfully fetched");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};