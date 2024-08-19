// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use - Authentication, Firestore Database
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAf3c8AiE87OA6MmlBLLoQuD2e2zjje5vs",
  authDomain: "financely-b4fae.firebaseapp.com",
  projectId: "financely-b4fae",
  storageBucket: "financely-b4fae.appspot.com",
  messagingSenderId: "786897272655",
  appId: "1:786897272655:web:1b06cceba52747ac5a4f3a",
  measurementId: "G-ZZHDM2ETZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {db, auth, provider, doc, setDoc};