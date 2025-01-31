import { FastifyInstance } from "fastify";
import * as userController from "../controllers/user.controller";
import * as apiKeyController from "../controllers/userApiKey.controller";
import {
  usersInsertSchema,
  usersUpdateSchema,
  usersDeleteSchema,
  apiKeysInsertSchema,
  apiKeysUpdateSchema,
  userIdSchema,
  userIdWithApiKeyIdSchema,
} from "../utils/validationSchemas";

export default async function routes(fastify: FastifyInstance) {
  // ✅ User Routes
  fastify.get("/:id", { schema: { params: usersDeleteSchema } }, userController.getUserById);
  fastify.post("/", { schema: { body: usersInsertSchema } }, userController.createUser);
  fastify.put("/:id", { schema: { params: usersDeleteSchema, body: usersUpdateSchema } }, userController.updateUser);
  fastify.delete("/:id", { schema: { params: usersDeleteSchema } }, userController.deleteUser);

  // ✅ User API Key Routes (Scoped Under Users)
  fastify.get("/:userId/api-keys", { schema: { params: userIdSchema } }, apiKeyController.getAllApiKeysForUser);
  fastify.get("/:userId/api-keys/:id", { schema: { params: userIdWithApiKeyIdSchema } }, apiKeyController.getApiKeyById);
  fastify.post("/:userId/api-keys", { schema: { params: userIdSchema, body: apiKeysInsertSchema } }, apiKeyController.createApiKey);
  fastify.put("/:userId/api-keys/:id", { schema: { params: userIdWithApiKeyIdSchema, body: apiKeysUpdateSchema } }, apiKeyController.updateApiKey);
  fastify.delete("/:userId/api-keys/:id", { schema: { params: userIdWithApiKeyIdSchema } }, apiKeyController.deleteApiKey);
}
