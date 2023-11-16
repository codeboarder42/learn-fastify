import fastify, { FastifyInstance } from "fastify";
import fastifyPostgres from "@fastify/postgres";

// Enregistrement asynchrone du plugin PostgreSQL
async function dbConnector(fastify: FastifyInstance) {
  try {
    // Attente du register avant de poursuivre
    await fastify.register(fastifyPostgres, {
      connectionString: "postgres://blabla",
    });
    fastify.log.info("Connected to Neon");
  } catch (error) {
    fastify.log.error("Connection error", error);
  }
}

export default dbConnector;
