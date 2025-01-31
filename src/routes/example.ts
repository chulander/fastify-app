import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function exampleRoutes(fastify: FastifyInstance) {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    return { message: "Hello, Fastify with TypeScript!" };
  });
}
