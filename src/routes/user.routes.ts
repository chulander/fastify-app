import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import * as userController from "@controllers/user.controller";
import * as apiKeyController from "@controllers/userApiKey.controller";
import {
  usersInsertSchema,
  usersUpdateSchema,
  usersDeleteSchema,
  apiKeysInsertSchema,
  apiKeysUpdateSchema,
  userIdSchema,
  userIdWithApiKeyIdSchema,
} from "@utils/validationSchemas";
import { authMiddleware } from "@middlewares/auth.middleware";

export default async function routes(fastify: FastifyInstance) {
  // ✅ User Routes

  fastify.get("/", userController.getAllUsers);
  fastify.get("/:id", { schema: { params: usersDeleteSchema } }, userController.getUserById);
  fastify.post("/", { schema: { body: usersInsertSchema } }, userController.createUser);
  fastify.put("/:id", { schema: { params: usersDeleteSchema, body: usersUpdateSchema } }, userController.updateUser);
  fastify.delete("/:id", { schema: { params: usersDeleteSchema } }, userController.deleteUser);

  // ✅ User API Key Routes (Scoped Under Users)
  fastify.get("/:userId/api-keys", { schema: { params: userIdSchema } }, apiKeyController.getAllApiKeysForUser);

  fastify.get(
    "/:userId/api-keys/:id",
    {
      schema: { params: userIdWithApiKeyIdSchema },
    },
    apiKeyController.getApiKeyById
  );
  // this has auth middleware
  // fastify.get<{ Params: { userId: string; id: string } }>(
  //   "/:userId/api-keys/:id",
  //   {
  //     preHandler: authMiddleware,
  //     schema: { params: userIdWithApiKeyIdSchema },
  //   },
  //   apiKeyController.getApiKeyById // ✅ No need for explicit wrapper
  // );
  fastify.post("/:userId/api-keys", { schema: { params: userIdSchema, body: apiKeysInsertSchema } }, apiKeyController.createApiKeyByUserId);
  // makes no sense to allow user to update an api key
  // let them delete it and create a new one
  // fastify.put("/:userId/api-keys/:id", { schema: { params: userIdWithApiKeyIdSchema, body: apiKeysUpdateSchema } }, apiKeyController.updateApiKey);
  fastify.delete("/:userId/api-keys/:id", { schema: { params: userIdWithApiKeyIdSchema } }, apiKeyController.deleteApiKey);
}
