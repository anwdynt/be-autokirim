import { mapFields } from "../utils/mapper";
import { users } from "@prisma/client";
export type CreateUserDTO = {
    agent_code: string;
    name: string;
    email: string;
    phone_number: string;
}

export function toUser(user: users){
    return mapFields(user, {
        remove: ["created_at", "updated_at"],
        rename: { password_hash: "token" }
    });
}