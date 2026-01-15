// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA3pNpCpesmqghB80o_jcE7_MMO9DdbtXQ",
    authDomain: "lla-landding.firebaseapp.com",
    projectId: "lla-landding",
    storageBucket: "lla-landding.firebasestorage.app",
    messagingSenderId: "262584332366",
    appId: "1:262584332366:web:0256a8bfdfc917e411931f",
    measurementId: "G-PB7H228XTZ"
};

// Verificar que la configuración sea válida
if (
    !firebaseConfig.apiKey ||
    !firebaseConfig.authDomain ||
    !firebaseConfig.projectId
) {
    throw new Error('Firebase configuration is missing required fields');
}

// Initialize Firebase (singleton pattern)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics solo en el cliente
export const analytics =
    typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export default app;
