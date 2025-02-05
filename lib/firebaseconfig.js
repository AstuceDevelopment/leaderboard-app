import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBoJ0RoZRCXwiv_qHQhDvDAyV3f0TKVMLg",
  authDomain: "fdg-leaderboard.firebaseapp.com",
  projectId: "fdg-leaderboard",
  storageBucket: "fdg-leaderboard.firebasestorage.app",
  messagingSenderId: "362252193672",
  appId: "1:362252193672:web:26d661aceea863eb0df43d",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
