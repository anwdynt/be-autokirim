import { logger as winstonLogger } from "../config/logger";
import { CheckPriceDTO, SpecialExpedition } from "../model/autokirim-check-price.model";
import { fetchCheckPrice } from "../utils/autokirim/price";
import { specialExpeditionService } from "./special-expedition.service"; 
import { toPriceResult } from "../model/autokirim-check-price.model";

export const checkPriceService = {
    checkPrice: async (data: CheckPriceDTO) => {
        try {
            const specialExpedition = await specialExpeditionService.getAllSpecialExpedition() as SpecialExpedition[];
            const result = await fetchCheckPrice({
                origin_id: data.origin_id,
                destination_id: data.destination_id,
                weight: data.weight,
                length: data.length,
                width: data.width,
                height: data.height,
                pickup_point_code: data.pickup_point_code,
                is_sender_pp: data.is_sender_pp,
            });
            return toPriceResult({
                data: result,
                method: data.method,
                specialExpedition,
                itemPrice: data.item_price
            });
        } catch (error) {
            winstonLogger.error(`Error fetching check price: ${error}`);
            throw error;
        }
    },
};