import { prisma } from "../config/prisma";
import { logger as winstonLogger } from "../config/logger";
import { paginateResponse } from "../utils/pagination";
import { toShipmentAddresses, toShipmentAddress } from "../model/shipment-address.model";
import { CreateShipmentAddressDTO, UpdateShipmentAddressDTO } from "../model/shipment-address.model";

export const shipmentAddressService = {
    getAllShipmentAddresses: async (page = 1, limit = 10, search: string = "", user_id: number) => {
        try {
            const skip = (page - 1) * limit;

            const where: any = { is_deleted: 0, user_id };

            if (search.trim() !== "") {
                where.OR = [
                    { name: { contains: search.toLowerCase() } },
                    { address: { contains: search.toLowerCase() } },
                    { city: { contains: search.toLowerCase() } },
                ];
            }

            const [rows, total] = await Promise.all([
                prisma.shipment_addresses.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy: { id: "asc" }
                }),
                prisma.shipment_addresses.count({ where })
            ]);

            const formatted = toShipmentAddresses(rows);

            return paginateResponse(formatted, page, limit, total, { search });

        } catch (err) {
            winstonLogger.error(`Error fetching shipment addresses paginated: ${err}`);
            throw err;
        }
    },
    getShipmentAddressById: async (id: number) => {
        try {
            const result = await prisma.shipment_addresses.findUnique({
                where: {
                    id
                }
            });
            if (!result) {
                throw new Error("Shipment address not found");
            }
            return result;
        } catch (err) {
            winstonLogger.error(`Error fetching shipment address by id: ${err}`);
            throw err;
        }
    },
    create: async (user_id: number, data: CreateShipmentAddressDTO) => {
        const result = await prisma.shipment_addresses.create({
            data: {
                user_id,
                name: data.name,
                phone_number: data.phone_number,
                address: data.address,
                city: data.city,
                postal_code: data.postal_code ?? null,
                latitude: data.latitude ? Number(data.latitude) : null,
                longitude: data.longitude ? Number(data.longitude) : null,
                district_id : data.district_id,
            },
        });

        return toShipmentAddress(result);
    },

    update: async (id: number, data: UpdateShipmentAddressDTO) => {
        const isDeleted = await prisma.shipment_addresses.findFirst({
            where: { id, is_deleted: 0 },
        });

        if (!isDeleted) {
            throw new Error("Shipment address not found or already deleted");
        }
        
        const result = await prisma.shipment_addresses.update({
            where: { id },
            data: {
                ...data,
                latitude: data.latitude ? Number(data.latitude) : undefined,
                longitude: data.longitude ? Number(data.longitude) : undefined,
                updated_at: new Date(),
            },
        });

        return toShipmentAddress(result);
    },

    delete: async (id: number) => {
        const isDeleted = await prisma.shipment_addresses.findFirst({
            where: { id, is_deleted: 0 },
        });

        if (!isDeleted) {
            throw new Error("Shipment address not found or already deleted");
        }
        const result = await prisma.shipment_addresses.update({
            where: { id },
            data: {
                is_deleted: 1,
                updated_at: new Date(),
            },
        });
        return toShipmentAddress(result);
    }
}

