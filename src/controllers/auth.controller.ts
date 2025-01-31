import { FastifyRequest, FastifyReply } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "@db";
import { users } from "@models/users";
import { comparePassword } from "@utils/hash"; // Import compare function
import { authSignInSchemaZod } from "@utils/validationSchemas";
import { generateAccessToken, generateIdToken, generateRefreshToken } from "@utils/jwt";
import { ENV } from "@utils/constants";

export const signInUser = async (req: FastifyRequest<{ Body: { email: string; password: string } }>, reply: FastifyReply) => {
  try {
    const parsedBody = authSignInSchemaZod.parse(req.body); // ✅ Validate request body with Zod
    const { email, password } = parsedBody;

    // ✅ Find user by email
    const userResults = await db.select().from(users).where(eq(users.email, email));

    if (!userResults.length) return reply.status(401).send({ error: "Invalid credentials" });

    // ✅ Compare stored hash with user-provided password
    const isMatch = await comparePassword(password, userResults[0].password);
    if (!isMatch) return reply.status(401).send({ error: "Invalid credentials" });

    const user = userResults[0];
    // ✅ Generate Tokens
    const accessToken = generateAccessToken(user.id, "consumer", [
      "read:api_keys",
      "write:api_keys",
      "delete:api_keys",
      "read:users",
      "write:users",
      "delete:users",
    ]);
    const idToken = generateIdToken(user.id, user.email, `${user.first_name} ${user.last_name}`);
    const refreshToken = generateRefreshToken(user.id);

    // ✅ Set Secure Cookies (HttpOnly)
    const secure = ENV === "development" ? false : true;
    const sameSite = "none";
    reply
      .setCookie("id_token", idToken, {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: 4 * 60 * 60, // 4 hours
      })
      .setCookie("access_token", accessToken, {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: 4 * 60 * 60, // 4 hours
      })
      .setCookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure,
        sameSite,
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })
      .send({
        message: "Login successful",
        accessToken,
        idToken,
        userId: userResults[0].id,
      });
  } catch (error) {
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
