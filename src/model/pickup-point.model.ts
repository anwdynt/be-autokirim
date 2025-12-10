import { pickup_points } from "@prisma/client";
import { mapEntity } from "../utils/mapper";
export type CreatePickupPointDTO = {
    name: string;
    phone_number: string;
    address: string;
    district_id: string;
    city: string;
    postal_code?: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    is_default?: number;
    pickup_point_code?: string;
    email?: string;
}

export type UpdatePickupPointDTO = {
    name: string;
    phone_number: string;
    district_id: string;
    address: string;
    city: string;
    postal_code: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    is_default?: number;
    email: string;
    pickup_point_code: string;
}

export type DeletePickupPointDTO = {
    pickup_point_code: string;
}


export function toPickupPoint(pickupPoint: pickup_points){
    return mapEntity(pickupPoint, ["created_at", "updated_at", "is_deleted","user_id"]);
}

export function toPickupPoints(pickupPoint: pickup_points []){
    return pickupPoint.map((item) => mapEntity(item, ["created_at", "updated_at", "is_deleted","user_id"]));
}
