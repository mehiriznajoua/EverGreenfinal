// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9jcCorXg4SAHIhxWApuVg-L9fLdwOTD8",
  authDomain: "evergreen-4b811.firebaseapp.com",
  projectId: "evergreen-4b811",
  storageBucket: "evergreen-4b811.appspot.com",
  messagingSenderId: "644153701644",
  appId: "1:644153701644:web:b25b8b523204a315b98529"
};

// ✅ Prevent duplicate initialization
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

