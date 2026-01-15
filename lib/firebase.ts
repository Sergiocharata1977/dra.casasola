import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
    apiKey: "AIzaSyA3pNpCpesmqghB80o_jcE7_MMO9DdbtXQ",
    authDomain: "lla-landding.firebaseapp.com",
    projectId: "lla-landding",
    storageBucket: "lla-landding.firebasestorage.app",
    messagingSenderId: "262584332366",
    appId: "1:262584332366:web:0256a8bfdfc917e411931f",
    measurementId: "G-PB7H228XTZ"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Analytics disabled temporarily (enable when app is more stable)
// To enable: uncomment the code below and enable Analytics in Firebase Console
let analytics = null;
// if (typeof window !== 'undefined') {
//     isSupported().then(yes => yes && (analytics = getAnalytics(app)));
// }

export { app, auth, db, analytics };
