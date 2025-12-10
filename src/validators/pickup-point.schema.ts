import { z } from "zod";

export const createPickupPointSchema =  z.object({
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
    
    email: z.email().min(1),
    
    district_id: z.string().min(1),

    latitude: z.string().optional(),

    longitude: z.string().optional(),

    is_default: z.int().optional()
});

export const updatePickupPointSchema = createPickupPointSchema.partial();

export const pickupPointIdSchema = z.object({
    id: z.string().regex(/^\d+$/).transform(Number)
});

export const getPickupPointQuerySchema = z.object({
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

export const deletePickupPointSchema = z.object({
    pickup_point_code: z.string().min(1),
});
