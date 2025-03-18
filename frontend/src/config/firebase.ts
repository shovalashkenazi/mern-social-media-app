// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC0Qltqfo_8xk9l24PXexGPjTP-jTOh0WA",
  authDomain: "webapp-42165.firebaseapp.com",
  projectId: "webapp-42165",
  storageBucket: "webapp-42165.firebasestorage.app",
  messagingSenderId: "357749908594",
  appId: "1:357749908594:web:d33e93a9a368f989a64eeb",
  measurementId: "G-6KXZK2MH98",
};

export const signInWithGoogle = async (): Promise<string> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // קבלת ה־ID Token מהמשתמש שמזוהה על ידי Firebase
    const idToken = await result.user.getIdToken();
    return idToken;
  } catch (error) {
    console.error("Google sign in error:", error);
    throw error;
  }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase
const auth = getAuth(app);

// signInWithGoogle
