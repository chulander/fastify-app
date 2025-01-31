import { FastifyInstance } from "fastify";
import { usersInsertSchema, authSignInRequestSchema } from "@utils/validationSchemas";
import * as userController from "@controllers/user.controller";
import * as authController from "@controllers/auth.controller";

export default async function routes(fastify: FastifyInstance) {
  fastify.post(
    "/signup",
    {
      schema: { body: usersInsertSchema },
    },
    userController.createUser
  );
  fastify.post(
    "/signin",
    {
      schema: { body: authSignInRequestSchema },
    },
    authController.signInUser
  );
}
