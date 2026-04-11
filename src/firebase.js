import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyBB2TvKdfjoqWuxvoRF6xEIRWa9pvSx0aI",
  authDomain: "rail-bites.firebaseapp.com",
  projectId: "rail-bites",
  storageBucket: "rail-bites.firebasestorage.app",
  messagingSenderId: "285966266196",
  appId: "1:285966266196:web:78d02674270147ac3a62c1",
  measurementId: "G-GHTHE0XHJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ THIS IS IMPORTANT
export const auth = getAuth(app);