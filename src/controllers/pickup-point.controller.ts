import { pickupPointService } from "../service/pickup-point.service";
import { Context } from "hono";
import { success, badRequest } from "../utils/response";

export const getPickupPoints = async (c: Context) => {
    try {
        const page = Number(c.req.query('page') ?? 1);
        const limit = Number(c.req.query('limit') ?? 10);
        const search = c.req.query('search');
        const user_id = c.get("user_id");

        const result = await pickupPointService.getAllPickupPoints(page, limit, search, user_id);

        return success(c, result, 'Pickup points successfully fetched');
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        return badRequest(c, `Failed to fetch pickup points: ${errMsg}`);
    }
}

export const getPickupPointFavorite = async (c: Context) => {
    try {
        const user_id = c.get("user_id");
        const point = await pickupPointService.findFavorite(user_id);
        return success(c, point, "Pickup point favorited successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};

export const getPickupPointById = async (c: Context) => {
    try {
        const { id } = c.get("validatedParams");
        const point = await pickupPointService.getPickupPointById(id);
        return success(c, point, "Pickup point fetched successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};

export const createPickupPoint = async (c: Context) => {
    try {
        const body = c.get("validatedBody");
        const user_id = c.get("user_id");

        const point = await pickupPointService.create(user_id, body);
        return success(c, point, "Pickup point created successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};

export const updatePickupPoint = async (c: Context) => {
    try {
        const { id } = c.get("validatedParams");
        const body = c.get("validatedBody");

        const point = await pickupPointService.update(id, body);
        return success(c, point, "Pickup point updated successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};

export const setFavorite = async (c: Context) => {
    try {
        const { id } = c.get("validatedParams"); 
        const user_id = c.get("user_id");

        const point = await pickupPointService.setFavorite(user_id, id);
        return success(c, point, "Pickup point favorited successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};

export const deletePickupPoint = async (c: Context) => {
    try {
        const { id } = c.get("validatedParams");
        const body = c.get("validatedBody");
        const point = await pickupPointService.delete(id, body);
        return success(c, point, "Pickup point deleted successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};
