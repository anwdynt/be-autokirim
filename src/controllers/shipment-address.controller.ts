import { shipmentAddressService } from "../service/shipment-address.service";
import { Context } from "hono";
import { success, badRequest } from "../utils/response";   


export const getShipmentAddresses = async (c: Context) => {
    try {
        const page = Number(c.req.query('page') ?? 1);
        const limit = Number(c.req.query('limit') ?? 10);
        const search = c.req.query('search');
        const user_id = c.get("user_id");
        const result = await shipmentAddressService.getAllShipmentAddresses(page, limit, search, user_id);
        return success(c, result, 'Shipment addresses successfully fetched');
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        return badRequest(c, `Failed to fetch shipment addresses: ${errMsg}`);
    }
}

export const createShipmentAddress = async (c: Context) => {
    try {
        const body = c.get("validatedBody");
        const user_id = c.get("user_id");

        const point = await shipmentAddressService.create(user_id, body);
        return success(c, point, "Shipment address created successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};


export const getShipmentAddressById = async (c: Context) => {
    try {
        const { id } = c.get("validatedParams");
        const point = await shipmentAddressService.getShipmentAddressById(id);
        return success(c, point, "Shipment address fetched successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};

export const updateShipmentAddress = async (c: Context) => {
    try {
        const { id } = c.get("validatedParams");
        const body = c.get("validatedBody");

        const point = await shipmentAddressService.update(id, body);
        return success(c, point, "Shipment address updated successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};

export const deleteShipmentAddress = async (c: Context) => {
    try {
        const { id } = c.get("validatedParams");

        const point = await shipmentAddressService.delete(id);
        return success(c, point, "Shipment address deleted successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};
