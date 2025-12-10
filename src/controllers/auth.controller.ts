import { registerService } from "../service/auth.service";
import { Context } from "hono";
import { success, badRequest, notFound } from "../utils/response";

export const register = async (c: Context) => {
    try {
        const body = c.get("validatedBody");
        const agentCode = c.get("agent_code");
        const result = await registerService.register(body, agentCode);
        return success(c, result, "Registered successfully");
    } catch (err: any) {
        return badRequest(c, err.message);
    }
};

export const isRegistered = async (c: Context) => {
    try {
        const body = c.get("validatedBody");
        const result = await registerService.isRegistered(body);
        return success(c, result, "The agent code is registered");
    } catch (err: any) {
        if(err.message === "Agent code not found"){
            return notFound(c, err.message);
        }
        return badRequest(c, err.message);
    }
};