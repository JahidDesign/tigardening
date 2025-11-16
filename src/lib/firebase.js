// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider 
} from "firebase/auth";
import { 
  getAnalytics, 
  isSupported 
} from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// ------------------------------------
//  🔥 Your REAL Firebase Project Config
// ------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBhrfktz0uhzG71ixXm--Bm1a_0y4UBY3M",
  authDomain: "nittosodai-55fe2.firebaseapp.com",
  projectId: "nittosodai-55fe2",
  storageBucket: "nittosodai-55fe2.firebasestorage.app",
  messagingSenderId: "523509085734",
  appId: "1:523509085734:web:926d894d660cd2441758e7",
  measurementId: "G-P2Y2MKWFDK",
};

// ------------------------------------
//  Initialize Firebase
// ------------------------------------
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

// Analytics (Browser Only)
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}
