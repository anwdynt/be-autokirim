import { prisma } from "../config/prisma";
import { logger as winstonLogger } from "../config/logger";


export const specialExpeditionService = {
    getAllSpecialExpedition: async() => {
        try {
            const result = await prisma.special_expedition.findMany();
            return result;
        } catch (error) {
            winstonLogger.error(`Error fetching special expedition: ${error}`);
            throw error;
        }
    }
}