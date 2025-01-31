import { FastifyReply, FastifyRequest } from "fastify";

// ✅ Auth Middleware to check access_token cookie
export const authMiddleware = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // 🔹 Get access_token from cookies
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return reply.status(401).send({ error: "Unauthorized: No access token" });
    }

    // 🔹 Set Authorization header for downstream handlers
    req.headers["authorization"] = `Bearer ${accessToken}`;
  } catch (error) {
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};
