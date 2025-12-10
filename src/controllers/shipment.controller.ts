import { shipmentService } from "../service/shipment.service";
import { Context } from "hono";
import { success, badRequest } from "../utils/response";

export const createShipment = async (c: Context) => {
    try {
        const body = c.get("validatedBody");
        const user_id = c.get("user_id");
        const agentCode = c.get("agent_code");
        const shipment = await shipmentService.create(user_id, agentCode, body);
        return success(c, shipment, "Shipment created successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};
