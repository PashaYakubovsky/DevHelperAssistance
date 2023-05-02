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
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../db/config"));
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const querySnapshot = yield config_1.default.collection("Users").where("userId", "==", id).get();
        if (querySnapshot.empty) {
            return res.status(400).send("No matching documents");
        }
        else {
            const user = querySnapshot.docs[0].data();
            return res.send(user);
        }
    }
    catch (err) {
        console.log(err);
    }
    return res.send(400);
}));
router.post("/user/create", auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const body = req.body;
        if (body.userId && body.name && body.password) {
            const newUser = Object.assign(Object.assign({}, body), { createDate: new Date().toISOString(), avatarUrl: (_a = body === null || body === void 0 ? void 0 : body.avatarUrl) !== null && _a !== void 0 ? _a : "" });
            const querySnapshot = yield config_1.default
                .collection("Users")
                .where("userId", "==", body.userId)
                .get();
            if (querySnapshot.empty) {
                yield config_1.default.collection("Users").add(newUser);
                return res.send(body);
            }
            else {
                return res.status(409).send("User already created");
            }
        }
    }
    catch (err) {
        console.log(err);
    }
    return res.send(400);
}));
router.put("/user/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        if (body.userId) {
            const user = yield config_1.default.collection("Users").where("userId", "==", body.userId).get();
            const doc = user.docs[0];
            const id = doc.id;
            const newUser = Object.assign(Object.assign(Object.assign({}, user.docs[0].data()), body), { updatedDate: new Date().toISOString() });
            yield config_1.default.collection("Users").doc(id).set(newUser);
            return res.status(201).send(body);
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
}));
router.delete("/user/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (id) {
            const docId = (yield config_1.default.collection("Users").where("userId", "==", id).get()).docs[0].id;
            yield config_1.default.collection("Users").doc(docId).delete();
            return res.send(204);
        }
    }
    catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
}));
exports.default = router;
