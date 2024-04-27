// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "demoisa-fe861.firebaseapp.com",
  projectId: "demoisa-fe861",
  storageBucket: "demoisa-fe861.appspot.com",
  messagingSenderId: "184754082572",
  appId: "1:184754082572:web:4961bc05b37d79a650af29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app)