import { FastifyInstance } from "fastify";
import { initSocket } from "../ws/socket";

async function plugin(fastify: FastifyInstance, options, next) {
    const server = fastify.server;
    const io = initSocket(server);

    fastify.decorate("io", io);
    next();
}

export { plugin };
