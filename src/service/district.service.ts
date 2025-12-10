import { prisma } from "../config/prisma";
import { logger as winstonLogger } from "../config/logger";
import { paginateResponse } from "../utils/pagination";

export const districtService = {
    getAllDistricts: async (page = 1, limit = 10, search: string = "") => {
        try {
            const skip = (page - 1) * limit;

            // Build dynamic WHERE
            const where: any = {};

            if (search.trim() !== "") {
                where.OR = [
                    { district_name: { contains: search.toLowerCase() } },
                    { regency_name: { contains: search.toLocaleLowerCase() } },
                ]
            }

            const [districts, total] = await Promise.all([
                prisma.district.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy: { id: "asc" }
                }),
                prisma.district.count({ where })
            ]);

            const totalPages = Math.ceil(total / limit);

            winstonLogger.info(
                `Fetched page ${page}/${totalPages} | search: "${search}" | items: ${districts.length}`
            );

            return paginateResponse(districts, page, limit, total, { search });

        } catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            winstonLogger.error(`Error fetching districts paginated: ${errMsg}`);
            throw error;
        }
    }
};
