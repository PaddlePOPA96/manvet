// Konfigurasi Firebase (gunakan kredensial Web, BUKAN file service-account JSON)
// Buka Firebase Console -> Project settings -> Your apps -> SDK setup and configuration
// Lalu isi nilai-nilai di bawah ini, atau gunakan variabel environment Vite (VITE_*)

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app = null;
let dbInstance = null;
let authInstance = null;

if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  dbInstance = getFirestore(app);
  authInstance = getAuth(app);
}

export const db = dbInstance;
export const auth = authInstance;

export const collections = {
  products: (db = dbInstance) => (db ? collection(db, "products") : null),
  transactions: (db = dbInstance) =>
    db ? collection(db, "transactions") : null,
  users: (db = dbInstance) => (db ? collection(db, "users") : null),
  packages: (db = dbInstance) => (db ? collection(db, "packages") : null),
  promotions: (db = dbInstance) => (db ? collection(db, "promotions") : null)
};

export {
  addDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
};
