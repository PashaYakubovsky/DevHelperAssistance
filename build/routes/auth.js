"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../db/config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
function routes(fastify, options) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.post("/api/v1/auth/login", { schema: { body: userSchema } }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                if (body.password && body.name) {
                    const querySnapshot = yield config_1.default
                        .collection("Users")
                        .where("name", "==", body.name)
                        .where("password", "==", body.password)
                        .get();
                    if (querySnapshot.empty) {
                        return res.status(400).send("No matching documents");
                    }
                    else {
                        const user = querySnapshot.docs[0].data();
                        const token = jsonwebtoken_1.default.sign(user, process.env.TOKEN_KEY, {
                            expiresIn: "24h",
                        });
                        return res.send(token);
                    }
                }
            }
            catch (err) {
                console.log(err);
                return res.status(400).send(err.message);
            }
        }));
    });
}
exports.default = routes;
