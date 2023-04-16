import admin, { AppOptions } from "firebase-admin";
import { initializeApp as initializeAdminApp } from "firebase-admin/app";
import { initializeApp } from "firebase/app";

if (!admin.apps.length) {
  const config: AppOptions = {
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  };

  initializeAdminApp(config);
}

const db = admin.firestore();
const adminAuth = admin.auth();

let Firebase: any;

if (!Firebase?.apps?.length) {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_KEY,
    authDomain: "languagemate2.firebaseapp.com",
    projectId: "languagemate2",
    storageBucket: "languagemate2.appspot.com",
    messagingSenderId: "1070506034942",
    appId: "1:1070506034942:web:dca33ace782b1a344b07af",
    measurementId: "G-T0VFRMLYEG",
  };

  Firebase = initializeApp(firebaseConfig);
}

export { db, adminAuth };
