import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { users } from "../models/users";
import { userApiKeys } from "../models/userApiKeys";

// ✅ Generate Zod schemas from Drizzle models
export const usersSelectSchema = createSelectSchema(users);
export const apiKeysSelectSchema = createSelectSchema(userApiKeys);

/* ==========================================================================
   ✅ USERS SCHEMAS (Zod + Fastify-Compatible JSON Schema)
   ========================================================================== */

// ✅ Users Insert Validation (Zod - Used for `.parse()`)
export const usersInsertSchemaZod = usersSelectSchema.omit({ id: true, createdAt: true, editedAt: true });

// ✅ Users Insert Validation (Fastify-Compatible JSON Schema)
export const usersInsertSchema = {
  type: "object",
  properties: {
    first_name: { type: "string" },
    last_name: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["first_name", "last_name", "email", "password"], // ✅ Explicit required fields
};

// ✅ Users Update Validation (Zod)
export const usersUpdateSchemaZod = usersSelectSchema.omit({ id: true, createdAt: true, editedAt: true });

// ✅ Users Update Validation (Fastify-Compatible JSON Schema)
export const usersUpdateSchema = {
  type: "object",
  properties: {
    first_name: { type: "string" },
    last_name: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
};

// ✅ Users Delete Validation (Zod)
export const usersDeleteSchemaZod = z.object({
  id: z.string().uuid(),
});

// ✅ Users Delete Validation (Fastify-Compatible JSON Schema)
export const usersDeleteSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
  },
  required: ["id"],
};

/* ==========================================================================
   ✅ API KEYS SCHEMAS (Zod + Fastify-Compatible JSON Schema)
   ========================================================================== */

// ✅ API Keys Insert Validation (Zod - Used for `.parse()`)
export const apiKeysInsertSchemaZod = apiKeysSelectSchema.omit({ id: true, createdAt: true, editedAt: true });

// ✅ API Keys Insert Validation (Fastify-Compatible JSON Schema)
export const apiKeysInsertSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    key: { type: "string" },
  },
  required: ["name", "key"],
};

// ✅ API Keys Update Validation (Zod)
export const apiKeysUpdateSchemaZod = apiKeysSelectSchema.omit({ id: true, createdAt: true, editedAt: true });

// ✅ API Keys Update Validation (Fastify-Compatible JSON Schema)
export const apiKeysUpdateSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    key: { type: "string" },
  },
};

// ✅ API Keys Delete Validation (Zod)
export const apiKeysDeleteSchemaZod = z.object({
  id: z.string().uuid(),
});

// ✅ API Keys Delete Validation (Fastify-Compatible JSON Schema)
export const apiKeysDeleteSchema = {
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
  },
  required: ["id"],
};

/* ==========================================================================
   ✅ USER ID & API KEY ID SCHEMAS (Zod + Fastify-Compatible JSON Schema)
   ========================================================================== */

// ✅ Extract `userId` (Zod)
export const userIdSchemaZod = z.object({
  userId: z.string().uuid(),
});

// ✅ Extract `userId` (Fastify-Compatible JSON Schema)
export const userIdSchema = {
  type: "object",
  properties: {
    userId: { type: "string", format: "uuid" },
  },
  required: ["userId"],
};

// ✅ Combine `userId` and `apiKeyId` (Zod)
export const userIdWithApiKeyIdSchemaZod = userIdSchemaZod.merge(apiKeysDeleteSchemaZod);

// ✅ Combine `userId` and `apiKeyId` (Fastify-Compatible JSON Schema)
export const userIdWithApiKeyIdSchema = {
  type: "object",
  properties: {
    userId: { type: "string", format: "uuid" },
    id: { type: "string", format: "uuid" },
  },
  required: ["userId", "id"],
};
