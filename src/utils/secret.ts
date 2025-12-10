import { logger as winstonLogger } from "../config/logger";
import { randomBytes, createHmac, createHash, createDecipheriv } from 'crypto';
/**
 * Generate SHA256 signature
 * @param agentCode Kode agen
 * @param secretKey Secret key (hanya server/native, jangan expose di webview)
 * @param timestamp Unix timestamp (detik)
 * @returns Hex string SHA256 signature
 */
export const generateSignature = (
    agentCode: string,
    secretKey: string,
    timestamp: number | string
): string => {
    const data = `${agentCode}${secretKey}${timestamp}`;
    return createHash('sha256').update(data).digest('hex');
};

/**
 * Generate default password
 * @returns Hex string
 */

export function generateDefaultPassword() {
    const randomPart = randomBytes(3).toString("hex");
    const timestamp = Date.now().toString().slice(-6);
    const rawPassword = `${randomPart}${timestamp}`;
    const hashed = createHmac("sha256", rawPassword).update(rawPassword).digest("hex");
    return hashed
}

/**
 * Decrypt agent code
 * @param encrypted Encrypted agent code
 * @param secretKey Secret key (hanya server/native, jangan expose di webview)
 * @param iv Initialization vector
 * @returns Decrypted agent code
 */

export const decryptAgentCode = (encrypted: string, secretKey: string, iv: string) => {
    try {
    const keyBuffer = Buffer.from(secretKey, "utf8");
    const ivBuffer = Buffer.from(iv, "utf8");

    const decipher = createDecipheriv("aes-256-cbc", keyBuffer, ivBuffer);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
    } catch (err) {
        winstonLogger.error(`Error decrypting agent code: ${err}`);
        throw err;
    }
};

