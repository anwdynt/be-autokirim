import { z } from "zod";

export const createShipmentSchema = z.object({
    pickup_point_id: z.number(),
    shipment_address_id: z.number(),

    service_code: z.string().min(1),

    origin_id: z.number().optional(),
    destination_id: z.number().optional(),

    weight: z.string().optional(),
    qty: z.number().optional(),
    length: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),

    description: z.string().optional(),
    remarks: z.string().optional(),
    is_cod: z.number().optional(),
    price: z.number().optional(),
    is_sender_pp: z.number().optional(),
    is_insurance: z.number().optional(),

    pickup_name: z.string(),
    pickup_phone: z.string().optional(),
    pickup_address: z.string(),
    pickup_city: z.string().optional(),
    pickup_postal_code: z.string().optional(),

    destination_name: z.string(),
    destination_phone: z.string().optional(),
    destination_address: z.string(),
    destination_city: z.string().optional(),
    destination_postal_code: z.string().optional(),

    pickup_point_code: z.string().min(1),

    fee_cod: z.number().optional(),
    fee_insurance: z.number().optional(),
    fee_total: z.number().optional(),
    fee_expedition: z.number().optional(),
});
