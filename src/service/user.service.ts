import { prisma  } from "../config/prisma";
import { logger as winstonLogger } from "../config/logger";
import { CreateUserDTO } from "../model/user.model";
import { mapEntity } from "../utils/mapper";
import { generateDefaultPassword } from "../utils/secret";

export const userService = {
    create: async (data: CreateUserDTO) => {
        //password random with timestamp bcrypt
        try {
            const existingAgent = await prisma.users.findUnique({
                where: { agent_code: data.agent_code }
            });

            if (existingAgent) {
                throw new Error("Kode agen sudah digunakan");
            }

            const result = await prisma.users.create({
                data: {
                    agent_code: data.agent_code,
                    name: data.name,
                    email: data.email,
                    password_hash: await generateDefaultPassword(),
                    phone_number: data.phone_number,
                },
            });
            return mapEntity(result, ["created_at", "updated_at","password_hash"]);
        } catch (err) {
            winstonLogger.error(`Error creating user: ${err}`);
            throw err;
        }
    }
}