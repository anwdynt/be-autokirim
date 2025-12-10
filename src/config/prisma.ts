import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

const prisma = new PrismaClient({
    log: [
        { level: "query", emit: "event" },
        { level: "error", emit: "event" },
        { level: "info", emit: "event" },
        { level: "warn", emit: "event" },
    ],
    });

prisma.$on("query", (e) => {
    logger.debug(`Query: ${e.query}`);
});

prisma.$on("error", (e) => {
    logger.error(`DB Error: ${e.message}`);
});

export { prisma };
