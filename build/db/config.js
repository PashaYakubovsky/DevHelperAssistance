"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// Import the functions you need from the SDKs you need
const admin = __importStar(require("firebase-admin"));
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyBuLSusMcn0CTH6NqpVYNQauf1HqJLDc8o",
//     authDomain: "devhelperassistance.firebaseapp.com",
//     projectId: "devhelperassistance",
//     storageBucket: "devhelperassistance.appspot.com",
//     messagingSenderId: "319602203916",
//     appId: "1:319602203916:web:f611552dda1cc105d8bd29",
// };
// initializeApp({
//     credential: applicationDefault(),
// });
// const db = getFirestore();
// Initialize Firebase
// export const app = initializeApp(firebaseConfig);
var serviceAccount = require("./devhelperassistance-firebase-adminsdk-lw8n5-ced7c5d94f.json");
exports.app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
var db = admin.firestore();
exports.default = db;
// export const db = firebase.firestore();
// export const Users = db.collection("Users");
// tslint:disable-next-line:no-var-requires
// admin.initializeApp({
//     credential: admin.credential.cert(firebaseConfig.apiKey),
//     databaseURL: firebaseConfig.authDomain,
// });
// const db: FirebaseFirestore.Firestore = admin.firestore();
// db.settings({ timestampsInSnapshots: true });
// export default db;
