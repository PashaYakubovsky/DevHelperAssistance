// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
const firebase = require("firebase");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBuLSusMcn0CTH6NqpVYNQauf1HqJLDc8o",
    authDomain: "devhelperassistance.firebaseapp.com",
    projectId: "devhelperassistance",
    storageBucket: "devhelperassistance.appspot.com",
    messagingSenderId: "319602203916",
    appId: "1:319602203916:web:f611552dda1cc105d8bd29",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const db = firebase.firestore();

export const Users = db.collection("Users");
