// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config for Dra. Lidia Casasola project
const firebaseConfig = {
    apiKey: "AIzaSyArvoaEjaJpGNwkUbg3I5Cd68WovHOQGgo",
    authDomain: "dra-casasola-web.firebaseapp.com",
    projectId: "dra-casasola-web",
    storageBucket: "dra-casasola-web.firebasestorage.app",
    messagingSenderId: "787477542103",
    appId: "1:787477542103:web:a69baa95716a38227dac92"
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
