import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDZBV6_ouNvCstQThpMyhwZiJtaRDp0OpU",
    authDomain: "prop-pulse-crm.firebaseapp.com",
    projectId: "prop-pulse-crm",
    storageBucket: "prop-pulse-crm.firebasestorage.app",
    messagingSenderId: "106915974646",
    appId: "1:106915974646:web:dfe18c537a9fec1fff0bd7",
    measurementId: "G-J5V6P56V07"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
