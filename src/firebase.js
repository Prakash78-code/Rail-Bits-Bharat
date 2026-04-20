import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"; // ✅ add

const firebaseConfig = {
  apiKey: "AIzaSyBB2TvKdfjoqWuxvoRF6xEIRWa9pvSx0aI",
  authDomain: "rail-bites.firebaseapp.com",
  projectId: "rail-bites",
  storageBucket: "rail-bites.firebasestorage.app",
  messagingSenderId: "285966266196",
  appId: "1:285966266196:web:78d02674270147ac3a62c1",
  measurementId: "G-GHTHE0XHJ4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// 🔥 ADD THIS (Google login ke liye)
export const provider = new GoogleAuthProvider();