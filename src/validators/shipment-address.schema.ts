import { z } from "zod";

export const createShipmentAddressSchema =  z.object({
    name: z
        .string()
        .min(1)
        .max(100),

    phone_number: z
        .string()
        .min(1)
        .max(20)
        .regex(/^(?:\+62|62|0)8[1-9][0-9]{6,10}$/, {
        message:
            "Phone number is invalid (use Indonesian format, e.g. 081234567890)"
        }),

    address: z
        .string()
        .min(1)
        .max(255),

    city: z
        .string()
        .min(1)
        .max(100),

    postal_code: z
        .string()
        .max(10)
        .optional(),
        
    district_id: z.string().min(1),

    latitude: z.string().optional(),

    longitude: z.string().optional(),

    is_default: z.int().optional()
});

export const updateShipmentAddressSchema = createShipmentAddressSchema.partial();

export const shipmentAddressIdSchema = z.object({
    id: z.string().regex(/^\d+$/, "id harus angka").transform(Number)
});

export const getShipmentAddressQuerySchema = z.object({
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