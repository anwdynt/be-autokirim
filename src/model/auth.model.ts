import { mapEntity, mapFields } from "../utils/mapper";
import { users } from "@prisma/client";
export type RegisterDTO = {
    name: string;
    email: string;
    phone_number: string;
    outlet_name: string;
    outlet_phone_number: string;
    outlet_address: string;
    outlet_city: string;
    outlet_email : string;
    outlet_district_id: string;
    outlet_postal_code?: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
}

export type isRegisteredDTO = {
    agent_code: string;
}

export function toRegisterDTO (registerDTO: RegisterDTO) {
    return mapEntity(registerDTO, ["created_at", "updated_at"]);
}

export function toIsRegisteredDTO (user : users) {
    return mapFields(user, {
        remove: ["created_at", "updated_at"],
        rename: { password_hash: "token" }
    });
}


