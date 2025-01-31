import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv-safe";
dotenv.config();

import { PORT, ENV, ALLOWED_ORIGINS, LOCALHOST_ORIGIN } from "./utils/constants";
import userRoutes from "./routes/user.routes";
import apiKeyRoutes from "./routes/apiKey.routes";

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      // no origin may be a postman or server to server cal
      // handle it later
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});
// Register routes
fastify.register(userRoutes, { prefix: "/api/v1/users" });
fastify.register(apiKeyRoutes, { prefix: "/api/v1/api-keys" });

// Start the server
const start = async () => {
  try {
    await fastify.listen({
      port: PORT,
      // TODO: handle env variable later for production
      host: LOCALHOST_ORIGIN,
    });

    const serverAddress = fastify.server.address();
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const addy =
      typeof serverAddress === "string"
        ? serverAddress
        : !serverAddress
        ? ""
        : serverAddress?.address === "::" || serverAddress.address === LOCALHOST_ORIGIN
        ? "localhost"
        : serverAddress.address;

    const origin = `${protocol}://${addy}:${PORT}`;

    if (ENV === "development") {
      console.log(`Server is running on ${origin}`);
    } else {
      console.log(`Server is running on ${origin}`);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
