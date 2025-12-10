import { z } from "zod";

export const getDistrictQuerySchema = z.object({
    page: z
    .string()
    .min(1, "page is required")
    .transform((val) => Number(val))
    .refine((val) => val > 0, {
        message: "page must be greater than 0"
    }),
    limit: z
    .string()
    .min(1, "limit is required")
    .transform((val) => Number(val))
    .refine((val) => val > 0, {
        message: "limit must be greater than 0"
    }),
    search: z.string().optional()
});