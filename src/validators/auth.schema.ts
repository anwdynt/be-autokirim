// validators/user.schema.ts
import { z } from "zod";

export const createRegisterSchema = z.object({
    name: z.string().min(1).max(100),
    email: z.email().min(1),
    phone_number: z.string().optional(),

    // Outlet (pickup point)
    outlet_name: z.string().min(1),
    outlet_phone_number: z
        .string()
        .min(1)
        .max(20),

    outlet_address: z.string().min(1),
    outlet_email: z.email().min(1),
    outlet_district_id: z.string().min(1),
    outlet_city: z.string().min(1),
    outlet_postal_code: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
});

export const isRegisteredSchema = z.object({
    agent_code: z.string().min(32).max(32),
});
