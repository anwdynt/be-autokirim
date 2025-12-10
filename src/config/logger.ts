import winston from "winston";
import path from "path";
import fs from "fs";

const logDir = path.join(process.cwd(), "logs");

// Pastikan folder logs ada
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error" }),
        new winston.transports.File({ filename: path.join(logDir, "combined.log") }),
    ],
});

// Tampilkan log di console juga jika bukan di production
if (process.env.NODE_ENV !== "production") {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}
