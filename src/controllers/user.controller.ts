import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../db"; // Import the Drizzle database instance
import { users } from "../models/users";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";
import {
  usersInsertSchemaZod, // ✅ Use Zod schema for parsing
  usersUpdateSchemaZod, // ✅ Use Zod schema for parsing
  usersDeleteSchemaZod, // ✅ Use Zod schema for parsing
} from "../utils/validationSchemas"; // ✅ Import the correct validation schemas

// ✅ Get All Users
export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = await db.select().from(users);
    return reply.send(result);
  } catch (error) {
    return reply.status(500).send({ error: "Failed to fetch users" });
  }
};

// ✅ Get User by ID
export const getUserById = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const parsedId = usersDeleteSchemaZod.parse({ id: req.params.id });

    const user = await db.select().from(users).where(eq(users.id, parsedId.id));

    if (!user || user.length === 0) {
      return reply.status(404).send({ error: "User not found" });
    }

    return reply.send(user[0]);
  } catch (error) {
    return reply.status(400).send({ error: "Invalid request", details: error });
  }
};

// ✅ Create New User
export const createUser = async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
  try {
    const parsedBody = usersInsertSchemaZod.parse(req.body); // ✅ Validate request body with Zod

    // TODO: look into the proper type instead of type casting
    // ✅ Explicitly cast parsedBody to Drizzle insert type
    const [newUser] = await db
      .insert(users)
      .values(parsedBody as unknown as typeof users.$inferInsert)
      .returning();
    return reply.status(201).send(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({ error: "Invalid request data", details: error.errors });
    }
    // ✅ Check if it's a unique constraint violation (duplicate email)
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "23505" // ✅ PostgreSQL unique violation code
    ) {
      return reply.status(409).send({ error: "Email already exists" });
    }
    console.error("Unexpected error:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};

// ✅ Update User
export const updateUser = async (req: FastifyRequest<{ Params: { id: string }; Body: any }>, reply: FastifyReply) => {
  try {
    const parsedId = usersDeleteSchemaZod.parse({ id: req.params.id }); // ✅ Validate ID
    const parsedBody = usersUpdateSchemaZod.parse(req.body); // ✅ Validate body with Zod

    const updatedUser = await db
      .update(users)
      .set({ ...parsedBody, editedAt: new Date() }) // 🚀 Automatically update `editedAt`
      .where(eq(users.id, parsedId.id))
      .returning();

    if (updatedUser.length === 0) {
      return reply.status(404).send({ error: "User not found" });
    }

    return reply.send(updatedUser[0]);
  } catch (error) {
    if (error instanceof ZodError) {
      return reply.status(400).send({ error: "Invalid request data", details: error.errors });
    }
    console.error("Unexpected error:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};

// ✅ Delete User
export const deleteUser = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
  try {
    const parsedId = usersDeleteSchemaZod.parse({ id: req.params.id }); // ✅ Validate ID

    const deletedUser = await db.delete(users).where(eq(users.id, parsedId.id)).returning();

    if (deletedUser.length === 0) {
      return reply.status(404).send({ error: "User not found" });
    }

    return reply.send({ message: "User deleted successfully", user: deletedUser[0] });
  } catch (error) {
    return reply.status(400).send({ error: "Invalid request" });
  }
};
