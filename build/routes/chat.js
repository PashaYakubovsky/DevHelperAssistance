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
const auth_1 = __importDefault(require("../middleware/auth"));
function routes(fastify, object) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get("/api/v1/chat/messages", { preHandler: auth_1.default }, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const limit = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.limit) ? Number.parseInt(req.query.limit) : null;
                // const startAt = Number.parseInt(req.query?.startAt ?? '0')
                const startAt = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.startAt) ? Number.parseInt(req.query.startAt) : null;
                const querySnapshot = yield config_1.default
                    .collection("Messages")
                    .orderBy("dateCreate", "desc")
                    .limit(100000)
                    .get();
                // if (Number.isInteger(limit) && Number.isInteger(startAt)) {
                //     querySnapshot = await db
                //         .collection("Messages")
                //         .orderBy("dateCreate", "desc")
                //         .limit(100000)
                //         .get();
                // } else {
                //     querySnapshot = await db.collection("Messages").get();
                // }
                if (querySnapshot.empty) {
                    return res.status(400).send("No matching documents");
                }
                else {
                    const messages = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        data.user.password = null;
                        data.id = doc.id;
                        return data;
                    });
                    return res.send(messages);
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).send("Something went wrong");
            }
        }));
    });
}
exports.default = routes;
