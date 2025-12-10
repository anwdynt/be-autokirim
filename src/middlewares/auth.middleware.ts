import { Context, Next } from 'hono';
import { generateSignature, decryptAgentCode } from '../utils/secret';
import { unauthorized } from '../utils/response';
import { prisma } from "../config/prisma";

const SECRET_KEY = process.env.SECRET_KEY!;
const SECRET_KEY_AGEN_AES = process.env.SECRET_KEY_AGEN_AES!;
const IV = process.env.IV!;
const MODE = process.env.MODE!;

export const authMiddleware = async (c: Context, next: Next) => {
    const agentCode = c.req.header('X-Agent-Code');
    const signature = c.req.header('Authorization')?.replace('Bearer ', '');
    const timestamp = c.req.header('Timestamp');

    if (!agentCode || !signature || !timestamp) {
        return unauthorized(c, 'Missing authentication headers');
    }

    // Cek timestamp ±5 menit
    if (MODE === "PRODUCTION") {
        const ts = parseInt(timestamp);
        const now = Math.floor(Date.now() / 1000);
        if (Math.abs(now - ts) > 300) {
            return unauthorized(c, 'Timestamp expired');
        }
    }

    const agentCodeDecrypted = decryptAgentCode(agentCode, SECRET_KEY_AGEN_AES, IV);
    if (!agentCodeDecrypted) {
        return unauthorized(c, 'Invalid agent code');
    }

    const user = await prisma.users.findUnique({
        where: { agent_code: agentCodeDecrypted }
    });
    const expectedSignature = generateSignature(user?.password_hash as string, SECRET_KEY, timestamp);
    if (expectedSignature !== signature) {
        return unauthorized(c, 'Invalid signature');
    }

     // 🔥 Ambil user berdasarkan agent_code

    if (!user) {
        return unauthorized(c, "Invalid Agent-Code");
    }
    // Simpan user ke context
    c.set("agent_code", agentCodeDecrypted);
    c.set("user_id", user.id);
    await next();
};
