import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv-safe";
dotenv.config();

import exampleRoutes from "./routes/example";
const env = process.env.NODE_ENV || "development";
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const allowedOrigins = process.env.ALLOWED_ORIGINS;
const origins = !allowedOrigins
  ? []
  : allowedOrigins?.split(",").map((origin) => origin.trim());

const fastify = Fastify({
  logger: true,
});

fastify.register(cors, {
  origin: (origin, callback) => {
    if (!origin || origins.includes(origin)) {
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
fastify.register(exampleRoutes);

// Start the server
const localhostOrigin = "0.0.0.0";
const start = async () => {
  try {
    await fastify.listen({
      port: PORT,
      // TODO: handle env variable later for production
      host: "0.0.0.0",
    });

    const serverAddress = fastify.server.address();
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const addy =
      typeof serverAddress === "string"
        ? serverAddress
        : !serverAddress
        ? ""
        : serverAddress?.address === "::" ||
          serverAddress.address === localhostOrigin
        ? "localhost"
        : serverAddress.address;

    const origin = `${protocol}://${addy}:${PORT}`;

    if (env === "development") {
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
