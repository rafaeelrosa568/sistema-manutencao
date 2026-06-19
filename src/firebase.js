import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBfzjtAix-QyafEWPUowKe8_puQ8TNetEw",
  authDomain: "sistema-manutencao-c027e.firebaseapp.com",
  projectId: "sistema-manutencao-c027e",
  storageBucket: "sistema-manutencao-c027e.firebasestorage.app",
  messagingSenderId: "493600150897",
  appId: "1:493600150897:web:443fa37a37373da37fd2d0"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);