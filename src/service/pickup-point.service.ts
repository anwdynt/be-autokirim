import { prisma } from "../config/prisma";
import { CreatePickupPointDTO, UpdatePickupPointDTO, DeletePickupPointDTO } from "../model/pickup-point.model";
import { logger as winstonLogger } from "../config/logger";
import { paginateResponse } from "../utils/pagination";
import { toPickupPoints, toPickupPoint } from "../model/pickup-point.model";
import { fetchPickupPointCode, fetchUpdatePickupPoint, fetchDeletePickupPoint } from "../utils/autokirim/pickup-point";

export const pickupPointService = {
    getAllPickupPoints: async (page = 1, limit = 10, search: string = "", user_id: number) => {
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
                prisma.pickup_points.findMany({
                    skip,
                    take: limit,
                    where,
                    orderBy: { id: "asc" }
                }),
                prisma.pickup_points.count({ where })
            ]);

            const formatted = toPickupPoints(rows);

            return paginateResponse(formatted, page, limit, total, { search });

        } catch (err) {
            winstonLogger.error(`Error fetching pickup points paginated: ${err}`);
            throw err;
        }
    },
    getPickupPointById: async (id: number) => {
        try {
            const pickupPoints = await prisma.pickup_points.findFirst({
                where: { id },
            });
            if (!pickupPoints) {
                throw new Error("Pickup point not found");
            }
            return toPickupPoint(pickupPoints);
        } catch (err) {
            winstonLogger.error(`Error fetching pickup points by id: ${err}`);
            throw err;
        }
    },
    findFavorite: async (user_id: number) => {
        console.log("findFavorite");
        try {
            const pickupPoints = await prisma.pickup_points.findFirst({
                where: { user_id, is_default: 1 },
            });

            if (!pickupPoints) {
                throw new Error("No favorite pickup point found");
            }

            const pickupPoint = toPickupPoint(pickupPoints);
            return pickupPoint;
        } catch (err) {
            winstonLogger.error(`Error fetching pickup points favorite: ${err}`);
            throw err;
        }
    },
    create: async (user_id: number, data: CreatePickupPointDTO) => { 
        const pickupPointCode = await fetchPickupPointCode({
            name: data.name,
            phone: data.phone_number,
            address: data.address,
            email: data.email ?? "",
            longitude: data.longitude as string ?? "",
            latitude: data.latitude as string ?? "",
            district_id: Number(data.district_id),
        });
        const result = await prisma.pickup_points.create({
            data: {
                user_id,
                name: data.name,
                phone_number: data.phone_number,
                address: data.address,
                city: data.city,
                postal_code: data.postal_code ?? null,
                latitude: data.latitude ? Number(data.latitude) : null,
                longitude: data.longitude ? Number(data.longitude) : null,
                is_default: data.is_default ?? 0,
                pickup_point_code: pickupPointCode,
                email: data.email ?? "",
                district_id: data.district_id,
            },
        });
        return toPickupPoint(result);
    },

    update: async (id: number, data: UpdatePickupPointDTO) => {
        const isDeleted = await prisma.pickup_points.findFirst({
            where: { id, is_deleted: 0 },
        });

        if (!isDeleted) {
            throw new Error("Pickup point not found or already deleted");
        }
        await fetchUpdatePickupPoint({
            name: data.name as string,
            phone: data.phone_number as string,
            address: data.address as string,
            email: data.email ?? "",
            longitude: data.longitude as string ,
            latitude: data.latitude as string,
            district_id: Number(data.district_id),
            pickup_point_code: data.pickup_point_code,
        });
        const result = await prisma.pickup_points.update({
            where: { id },
            data: {
                ...data,
                latitude: data.latitude ? Number(data.latitude) : undefined,
                longitude: data.longitude ? Number(data.longitude) : undefined,
                district_id: data.district_id!,
                updated_at: new Date(),
            },
        });

        return toPickupPoint(result);
    },

    setFavorite: async (user_id: number, id: number) => {
        const isDeleted = await prisma.pickup_points.findFirst({
            where: { id, is_deleted: 0 },
        });

        if (!isDeleted) {
            throw new Error("Pickup point not found or already deleted");
        }
        return await prisma.$transaction(async (tx) => {
            // pastikan pickup point milik user
            const target = await tx.pickup_points.findFirst({
                where: { id, user_id, is_deleted: 0 }
            });

            if (!target) {
                throw new Error("Pickup point not found");
            }

            // reset default lain
            await tx.pickup_points.updateMany({
                where: { user_id, NOT: { id } },
                data: { is_default: 0 }
            });

            // set default
            const updated = await tx.pickup_points.update({
                where: { id },
                data: { is_default: 1 }
            });
            return toPickupPoint(updated);
        });
    },

    delete: async (id: number, data : DeletePickupPointDTO) => {
        const isDeleted = await prisma.pickup_points.findFirst({
            where: { id, is_deleted: 0 },
        });

        if (!isDeleted) {
            throw new Error("Pickup point not found or already deleted");
        }

        await fetchDeletePickupPoint({
            pickup_point_code: data.pickup_point_code,
        });
        const result = await prisma.pickup_points.update({
            where: { id },
            data: {
                is_deleted: 1,
                updated_at: new Date(),
            },
        });

        return toPickupPoint(result);
    }
}
