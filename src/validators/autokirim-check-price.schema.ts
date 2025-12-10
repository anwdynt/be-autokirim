import { z } from "zod";

export const checkPriceSchema = z.object({
    origin_id: z.number().min(1),
    destination_id: z.number().min(1),
    weight: z.string().min(1),
    length: z.number().min(1),
    width: z.number().min(1),
    height: z.number().min(1),
    pickup_point_code: z.string().min(1),
    is_sender_pp: z.number().min(0),
    method: z.number().min(0),
    item_price: z.number().min(1),
});