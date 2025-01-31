import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../db"; // Import the Drizzle database instance
import { userApiKeys } from "../models/userApiKeys";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";
import {
  apiKeysInsertSchemaZod, // ✅ Use the Zod version
  apiKeysUpdateSchemaZod, // ✅ Use the Zod version
  apiKeysDeleteSchemaZod, // ✅ Use the Zod version
  userIdSchemaZod, // ✅ Use the Zod version
} from "../utils/validationSchemas"; // ✅ Import the correct validation schemas

// ✅ Get All API Keys
export const getAllApiKeys = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await db.select().from(userApiKeys);
    return reply.send(result);
  } catch (error) {
    return reply.status(500).send({ error: "Failed to fetch API keys" });
  }
};

// ✅ Get API Key by ID
export const getApiKeyById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const parsedId = apiKeysDeleteSchemaZod.parse({ id: req.params.id }); // ✅ Validate API Key ID

    const result = await db.select().from(userApiKeys).where(eq(userApiKeys.id, parsedId.id));

    if (result.length === 0) {
      return reply.status(404).send({ error: "API Key not found" });
    }

    return reply.send(result[0]);
  } catch (error) {
    return reply.status(400).send({ error: "Invalid request", details: error });
  }
};

// ✅ Get All API Keys for a User
export const getAllApiKeysForUser = async (req: FastifyRequest<{ Params: { userId: string } }>, reply: FastifyReply) => {
  try {
    const parsedUserId = userIdSchemaZod.parse({ userId: req.params.userId }); // ✅ Validate userId

    const result = await db.select().from(userApiKeys).where(eq(userApiKeys.user_id, parsedUserId.userId));

    return reply.send(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({ error: "Invalid request params", details: error.errors });
    }
    return reply.status(500).send({ error: "Failed to fetch API keys for user" });
  }
};

// ✅ Create New API Key
export const createApiKey = async (req: FastifyRequest<{ Params: { userId: string }; Body: any }>, reply: FastifyReply) => {
  try {
    const parsedUserId = userIdSchemaZod.parse({ userId: req.params.userId }); // ✅ Validate userId
    const parsedBody = apiKeysInsertSchemaZod.parse({
      ...(typeof req.body === "object" ? req.body : {}),
      user_id: parsedUserId.userId, // ✅ Ensure correct user_id assignment
    });

    // TODO: look into the proper type instead of type casting
    // ✅ Explicitly cast parsedBody to Drizzle insert type
    const [newApiKey] = await db
      .insert(userApiKeys)
      .values(parsedBody as unknown as typeof userApiKeys.$inferInsert)
      .returning();

    return reply.status(201).send(newApiKey);
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({ error: "Invalid request data", details: error.errors });
    }
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};

// ✅ Update API Key
export const updateApiKey = async (req: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) => {
  try {
    const parsedId = apiKeysDeleteSchemaZod.parse({ id: req.params.id }); // ✅ Validate API Key ID
    const parsedBody = apiKeysUpdateSchemaZod.parse(req.body); // ✅ Validate request body

    const updatedApiKey = await db
      .update(userApiKeys)
      .set({ ...parsedBody, editedAt: new Date() }) // 🚀 Automatically update `editedAt`
      .where(eq(userApiKeys.id, parsedId.id))
      .returning();

    if (updatedApiKey.length === 0) {
      return reply.status(404).send({ error: "API Key not found" });
    }

    return reply.send(updatedApiKey[0]);
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({ error: "Invalid request data", details: error.errors });
    }
    console.error("Unexpected error:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};

// ✅ Delete API Key
export const deleteApiKey = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const parsedId = apiKeysDeleteSchemaZod.parse({ id: req.params.id }); // ✅ Validate API Key ID

    const deletedApiKey = await db.delete(userApiKeys).where(eq(userApiKeys.id, parsedId.id)).returning();

    if (deletedApiKey.length === 0) {
      return reply.status(404).send({ error: "API Key not found" });
    }

    return reply.send({ message: "API Key deleted successfully", apiKey: deletedApiKey[0] });
  } catch (error) {
    return reply.status(400).send({ error: "Invalid request" });
  }
};
