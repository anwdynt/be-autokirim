import { logger as winstonLogger } from "../config/logger";
import { RegisterDTO, isRegisteredDTO, toIsRegisteredDTO  } from "../model/auth.model";
import { toUser  } from "../model/user.model";
import { toPickupPoint } from "../model/pickup-point.model";
import { prisma } from "../config/prisma";
import { generateDefaultPassword } from "../utils/secret";
import { decryptAgentCode } from "../utils/secret";
import { fetchPickupPointCode, fetchDeletePickupPoint } from "../utils/autokirim/pickup-point";


export const registerService = {
    register: async (data: RegisterDTO, agentCode: string) => {
        let pickupPointCode: string | null = null;

        try {
            pickupPointCode = await fetchPickupPointCode({
                name: data.outlet_name,
                phone: data.outlet_phone_number,
                address: data.outlet_address,
                email: data.outlet_email,
                longitude: data.longitude as string,
                latitude: data.latitude as string,
                district_id: Number(data.outlet_district_id),
            });
            const result = await prisma.$transaction(async (tx) => {
                const user = await tx.users.create({
                    data: {
                        agent_code: agentCode,
                        name: data.name,
                        email: data.email,
                        password_hash: generateDefaultPassword(),
                        phone_number: data.phone_number,
                    },
                });

                const pickupPoint = await tx.pickup_points.create({
                    data: {
                        user_id: user.id,
                        name: data.outlet_name,
                        phone_number: data.outlet_phone_number,
                        address: data.outlet_address,
                        city: data.outlet_city,
                        email: data.outlet_email,
                        postal_code: data.outlet_postal_code ?? null,
                        latitude: data.latitude ? Number(data.latitude) : null,
                        longitude: data.longitude ? Number(data.longitude) : null,
                        district_id: data.outlet_district_id,
                        pickup_point_code: pickupPointCode!,
                        is_default: 1,
                    },
                });

                return { user, pickupPoint };
            });

            return {
                ...toUser(result.user),
                pickup_point: toPickupPoint(result.pickupPoint),
            };

        } catch (err: any) {
            winstonLogger.error(`Error in registerService: ${err.message}`);
            if (pickupPointCode) {
                try {
                    await fetchDeletePickupPoint({ pickup_point_code: pickupPointCode });
                } catch (deleteErr) {
                    winstonLogger.error(
                        `Failed to rollback pickup point ${pickupPointCode}: ${(deleteErr as Error).message}`
                    );
                }
            }

            if (err.code === "P2002") {
                throw new Error("Agent code already used");
            }
            throw err;
        }
    },
    async isRegistered(data: isRegisteredDTO) {
        const SECRET_KEY_AGEN_AES = process.env.SECRET_KEY_AGEN_AES!;
        const IV = process.env.IV!;
        try {
            const agentCodeDecrypted = decryptAgentCode(data.agent_code, SECRET_KEY_AGEN_AES, IV);
            const user = await prisma.users.findUnique({
                where: { agent_code: agentCodeDecrypted }
            });

            if (!user) {
                throw new Error("Agent code not found");
            }

            return toIsRegisteredDTO(user);
        } catch (err) {
            winstonLogger.error(`Error creating user: ${err}`);
            throw err;
        }
    },
}
