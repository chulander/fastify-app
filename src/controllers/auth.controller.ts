import { FastifyRequest, FastifyReply } from "fastify";
import { comparePassword } from "@utils/hash"; // Import compare function
import { authSignInSchemaZod } from "@utils/validationSchemas";
import { users } from "@models/users";
import { db } from "@db";
import { eq } from "drizzle-orm";

export const signInUser = async (req: FastifyRequest<{ Body: { email: string; password: string } }>, reply: FastifyReply) => {
  try {
    const parsedBody = authSignInSchemaZod.parse(req.body); // ✅ Validate request body with Zod
    const { email, password } = parsedBody;

    // ✅ Find user by email
    const user = await db.select().from(users).where(eq(users.email, email));

    if (!user.length) return reply.status(401).send({ error: "Invalid credentials" });

    // ✅ Compare stored hash with user-provided password
    const isMatch = await comparePassword(password, user[0].password);
    if (!isMatch) return reply.status(401).send({ error: "Invalid credentials" });

    return reply.send({ message: "Login successful", userId: user[0].id });
  } catch (error) {
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
