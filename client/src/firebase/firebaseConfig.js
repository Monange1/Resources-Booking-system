// client/src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBvMNSYdRhzVIEyt6BQU5WYeABXtvQ2B2c",
    authDomain: "booking-system-b425d.firebaseapp.com",
    projectId: "booking-system-b425d",
    storageBucket: "booking-system-b425d.firebasestorage.app",
    messagingSenderId: "610966982841",
    appId: "1:610966982841:web:ff0da014aeded2b2788b68",
    measurementId: "G-4WT0FJ2P0E"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Export initialized auth instance
export const auth = getAuth(app);
