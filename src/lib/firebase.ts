import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBD8pHCfAFB9v5CVld1xJ68PsF02Bk83g4",
  authDomain: "electric-tesla-497514-r1.firebaseapp.com",
  projectId: "electric-tesla-497514-r1",
  storageBucket: "electric-tesla-497514-r1.firebasestorage.app",
  messagingSenderId: "612717024838",
  appId: "1:612717024838:web:7455548b2871888d269c47"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup, signOut };
