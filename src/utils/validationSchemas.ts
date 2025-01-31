import { z } from "zod";
import { createSelectSchema } from "drizzle-zod";
import { zodToJsonSchema } from "zod-to-json-schema"; // ✅ Convert Zod to JSON Schema
import { users } from "@models/users";
import { userApiKeys } from "@models/userApiKeys";

// ✅ Generate Zod schemas from Drizzle models
export const usersSelectSchema = createSelectSchema(users);
export const apiKeysSelectSchema = createSelectSchema(userApiKeys);

// AUTH

// ✅ Users Sign-In Validation (Zod)
export const authSignInSchemaZod = usersSelectSchema.pick({ email: true, password: true });
export const authSignInRequestSchema = zodToJsonSchema(authSignInSchemaZod, { name: "authSignInRequestSchema" });

/* ==========================================================================
   ✅ USERS SCHEMAS (Zod + Auto-Generated Fastify-Compatible JSON Schema)
   ========================================================================== */

// ✅ Users Insert Validation (Zod - Used for `.parse()`)
export const usersInsertSchemaZod = usersSelectSchema.omit({ id: true, createdAt: true, editedAt: true });

// ✅ Auto-Generate Fastify-Compatible JSON Schema from Zod
export const usersInsertSchema = zodToJsonSchema(usersInsertSchemaZod, { name: "usersInsertSchema" });

// ✅ Users Update Validation (Zod)
export const usersUpdateSchemaZod = usersSelectSchema.omit({ id: true, createdAt: true, editedAt: true });

// ✅ Auto-Generate Fastify-Compatible JSON Schema from Zod
export const usersUpdateSchema = zodToJsonSchema(usersUpdateSchemaZod, { name: "usersUpdateSchema" });

// ✅ Users Delete Validation (Zod)
export const usersDeleteSchemaZod = z.object({ id: z.string().uuid() });

// ✅ Auto-Generate Fastify-Compatible JSON Schema
export const usersDeleteSchema = zodToJsonSchema(usersDeleteSchemaZod, { name: "usersDeleteSchema" });

/* ==========================================================================
   ✅ API KEYS SCHEMAS (Zod + Auto-Generated Fastify-Compatible JSON Schema)
   ========================================================================== */

// ✅ API Keys Insert Validation (Zod)
export const apiKeysInsertPayloadSchemaZod = apiKeysSelectSchema.omit({
  id: true,
  createdAt: true,
  editedAt: true,
});
export const apiKeysInsertRequestSchemaZod = apiKeysSelectSchema.omit({
  id: true,
  createdAt: true,
  editedAt: true,
  user_id: true, // the path is /:userId/api-keys/:id
});

// ✅ Auto-Generate Fastify-Compatible JSON Schema
export const apiKeysInsertSchema = zodToJsonSchema(apiKeysInsertRequestSchemaZod, { name: "apiKeysInsertSchema" });

// ✅ API Keys Update Validation (Zod)
export const apiKeysUpdatePayloadSchemaZod = apiKeysSelectSchema.omit({
  id: true, // the path is /:userId/api-keys/:id
  createdAt: true,
  editedAt: true,
  user_id: true, // the path is /:userId/api-keys/:id
});

export const apiKeysUpdateRequestSchemaZod = apiKeysSelectSchema.omit({
  id: true,
  createdAt: true,
  editedAt: true,
  user_id: true, // the path is /:userId/api-keys/:id
});

// ✅ Auto-Generate Fastify-Compatible JSON Schema
export const apiKeysUpdateSchema = zodToJsonSchema(apiKeysUpdateRequestSchemaZod, { name: "apiKeysUpdateSchema" });

// ✅ API Keys Delete Validation (Zod)
export const apiKeysDeleteSchemaZod = z.object({ id: z.string().uuid() });

// ✅ Auto-Generate Fastify-Compatible JSON Schema
export const apiKeysDeleteSchema = zodToJsonSchema(apiKeysDeleteSchemaZod, { name: "apiKeysDeleteSchema" });

/* ==========================================================================
   ✅ USER ID & API KEY ID SCHEMAS (Zod + Auto-Generated Fastify-Compatible JSON Schema)
   ========================================================================== */

// ✅ Extract `userId` (Zod)
export const userIdSchemaZod = z.object({
  userId: z.string().uuid(),
});

// ✅ Auto-Generate Fastify-Compatible JSON Schema
export const userIdSchema = zodToJsonSchema(userIdSchemaZod, { name: "userIdSchema" });

// ✅ Combine `userId` and `apiKeyId` (Zod)
export const userIdWithApiKeyIdSchemaZod = userIdSchemaZod.merge(apiKeysDeleteSchemaZod);

// ✅ Auto-Generate Fastify-Compatible JSON Schema
export const userIdWithApiKeyIdSchema = zodToJsonSchema(userIdWithApiKeyIdSchemaZod, { name: "userIdWithApiKeyIdSchema" });
