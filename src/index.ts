import fastify, {
  FastifyRequest,
  FastifyReply,
  FastifyInstance,
} from "fastify";

import fastifyPostgres from "@fastify/postgres";
import dbConnector from "./plugins/dbConnector";

// Declaration de l'instance
const server = require("fastify")({
  logger: {
    transport: {
      target: "pino-pretty",
    },
  },
});

// 1ere syntaxe de route
server.get("/", async function () {
  return { message: "Hello World!" };
});

// 2eme syntaxe de route
server.get("/jane", {
  handler: async () => {
    return {
      message: "Hello Jane !",
    };
  },
});

// 3eme syntaxe de route
server.post("/api/users", {
  handler: async (
    request: FastifyRequest<{
      Body: {
        name: string;
        age: number;
      };
    }>,
    reply: FastifyReply
  ) => {
    const body = request.body;
    console.log({ body });
    reply.code(201).send(body);
  },
});

async function userRoutes(fastify: FastifyInstance) {
  fastify.post("/", {
    handler: async (
      request: FastifyRequest<{
        Body: {
          name: string;
          pages: number;
        };
      }>,
      reply: FastifyReply
    ): Promise<void> => {
      const body = request.body;
      console.log({ body });
      reply.code(201).send(body);
    },
  });

  fastify.get("/books", async (req, reply) => {
    const client = await fastify.pg.connect();
    try {
      const result = await client.query(
        `SELECT id, title, "bookDesc", cover, price
        FROM public.book2`
      );
      reply.send(result.rows);
    } catch (error) {
      console.error(error);
      reply.status(500).send(error);
    }

    client.release();
  });
}

async function main() {
  // Attente de la connection avant de poursuivre sur les routes
  await dbConnector(server);

  server.register(userRoutes, { prefix: "/api/maps" });

  await server.listen({
    port: 3000,
    host: "0.0.0.0",
  });
}

["SIGINT", "SIGTERM"].forEach((signal) => {
  process.on(signal, async () => {
    await server.close();

    process.exit(0);
  });
});

main();
