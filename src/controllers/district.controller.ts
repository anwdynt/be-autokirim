
import { districtService } from "../service/district.service";
import { Context } from "hono";
import { success, badRequest} from "../utils/response";

export const getDistricts = async (c: Context) => {
    try {
        const page = Number(c.req.query('page') ?? 1);
        const limit = Number(c.req.query('limit') ?? 10);
        const search = c.req.query('search');

        const result = await districtService.getAllDistricts(page, limit, search);

        return success(c, result, 'Districts successfully fetched');
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        return badRequest(c, `Failed to fetch districts: ${errMsg}`);
    }
}
