import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCobpp5InglWI-q9WRmXTx0c2If5ZRwez0",
  authDomain: "login-8ea0d.firebaseapp.com",
  projectId: "login-8ea0d",
  storageBucket: "login-8ea0d.firebasestorage.app",
  messagingSenderId: "1024219579126",
  appId: "1:1024219579126:web:e9b30b4541c8241711a2d7",
  measurementId: "G-FBRN9Y4RFC"
};

const app = initializeApp(firebaseConfig);
16
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();