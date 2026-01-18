import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase config for Dra. Lidia Casasola project
const firebaseConfig = {
    apiKey: "AIzaSyArvoaEjaJpGNwkUbg3I5Cd68WovHOQGgo",
    authDomain: "dra-casasola-web.firebaseapp.com",
    projectId: "dra-casasola-web",
    storageBucket: "dra-casasola-web.firebasestorage.app",
    messagingSenderId: "787477542103",
    appId: "1:787477542103:web:a69baa95716a38227dac92"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics disabled temporarily (enable when app is more stable)
let analytics = null;
// if (typeof window !== 'undefined') {
//     isSupported().then(yes => yes && (analytics = getAnalytics(app)));
// }

export { app, auth, db, storage, analytics };
