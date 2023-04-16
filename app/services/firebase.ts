import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqUOhATNBI_6MTCavtjLvCecp1enuSl7g",
  authDomain: "languagemate2.firebaseapp.com",
  projectId: "languagemate2",
  storageBucket: "languagemate2.appspot.com",
  messagingSenderId: "1070506034942",
  appId: "1:1070506034942:web:dca33ace782b1a344b07af",
  measurementId: "G-T0VFRMLYEG",
};

const app = initializeApp(firebaseConfig);
const clientAuth = getAuth(app);

export { clientAuth };
