import { FastifyInstance } from "fastify";
import * as userApiKeyController from "@controllers/userApiKey.controller";

export default async function routes(fastify: FastifyInstance) {
  fastify.get("/", userApiKeyController.getAllApiKeys);
}
