import { prisma } from "../config/prisma";
import { logger as winstonLogger } from "../config/logger";
import { toShipment } from "../model/shipment.model";
import { CreateShipmentDTO } from "../model/shipment.model";
import { generateRefId } from "../utils/ref-id";

export const shipmentService = {
    create: async (user_id: number, agentCode: string, data: CreateShipmentDTO) => {
        try {
            const shipment = await prisma.shipments.create({
                data: {
                    user_id,
                    pickup_point_id: data.pickup_point_id,
                    shipment_address_id: data.shipment_address_id,
                    service_code: data.service_code,
                    reff_client_id: generateRefId(agentCode),

                    origin_id: data.origin_id,
                    destination_id: data.destination_id,

                    weight: data.weight,
                    qty: data.qty,
                    length: data.length,
                    width: data.width,
                    height: data.height,

                    description: data.description,
                    remarks: data.remarks,
                    is_cod: data.is_cod,
                    item_price: data.price,
                    is_sender_pp: data.is_sender_pp,
                    is_insurance: data.is_insurance,

                    pickup_name: data.pickup_name,
                    pickup_phone: data.pickup_phone,
                    pickup_address: data.pickup_address,
                    pickup_city: data.pickup_city,
                    pickup_postal_code: data.pickup_postal_code,

                    destination_name: data.destination_name,
                    destination_phone: data.destination_phone,
                    destination_address: data.destination_address,
                    destination_city: data.destination_city,
                    destination_postal_code: data.destination_postal_code,

                    pickup_point_code: data.pickup_point_code,
                    fee_cod: data.fee_cod,
                    fee_insurance: data.fee_insurance,
                    fee_total: data.fee_total,
                    fee_courier: data.fee_courier
                },
            });
            return toShipment(shipment);
        } catch (error) {
            winstonLogger.error("Error creating shipment:", error);
            throw error;
        }
    },
};
