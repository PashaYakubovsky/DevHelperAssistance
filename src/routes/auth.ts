import express from "express";
import { Request, Response } from "express";
import db from "../db/config";
import jwt from "jsonwebtoken";
import { FastifyInstance } from "fastify";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

// const router = express.Router();

const userSchema = {
    type: "object",
    properties: {
        userId: { type: "string" },
        name: { type: "string" },
        password: { type: "string" },
        avatarUrl: { type: "string" },
    },
    required: ["name", "password"],
};

interface IAuthProps {
    userId?: string;
    name: string;
    password: string;
    avatarUrl?: string;
}

async function routes(fastify: FastifyInstance, options) {
    fastify.post<{ Body: IAuthProps }>(
        "/api/v1/auth/login",
        { schema: { body: userSchema } },
        async (req, res) => {
            try {
                const body = req.body;

                if (body.password && body.name) {
                    const querySnapshot = await db
                        .collection("Users")
                        .where("name", "==", body.name)
                        .where("password", "==", body.password)
                        .get();

                    if (querySnapshot.empty) {
                        return res.status(400).send("No matching documents");
                    } else {
                        const user = querySnapshot.docs[0].data();
                        const token = jwt.sign(user, process.env.TOKEN_KEY, {
                            expiresIn: "24h",
                        });

                        return res.send(token);
                    }
                }
            } catch (err) {
                console.log(err);
                return res.status(400).send(err.message);
            }
        }
    );
}

export default routes;
