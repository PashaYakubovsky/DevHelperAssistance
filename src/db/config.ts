// Import the functions you need from the SDKs you need
import * as admin from "firebase-admin";
import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
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

export const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

var db = admin.firestore();

export default db;

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
