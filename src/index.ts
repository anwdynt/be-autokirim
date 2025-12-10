import { Hono } from "hono";
import { requestLogger } from "./middlewares/logger.middleware";
import { logger } from "./config/logger";
import routes from "./routes/index.route";
import { badRequest } from "./utils/response";
import { cors } from "hono/cors";

const app = new Hono();

// Global middleware
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
  requestLogger
);

// Error handler
app.onError((err, c) => {
  logger.error(`Error: ${err.message}`);
  return badRequest(c, err.message);
});

// Mount routes
app.get('/', (c) => c.text('Hello, World!'))
app.route('/api', routes)

export default {
    fetch: app.fetch,
    port: Number(process.env.PORT) || 3000
}
