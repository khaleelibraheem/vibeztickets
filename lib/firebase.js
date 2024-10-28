import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGSY_ytL1CPV1aa0notPgK48Lal-8RHZ4",
  authDomain: "vibefusion-tickets.firebaseapp.com",
  projectId: "vibefusion-tickets",
  storageBucket: "vibefusion-tickets.appspot.com",
  messagingSenderId: "91601002725",
  appId: "1:91601002725:web:dd046fac384aeb5576f40c",
  measurementId: "G-G57104RYV7",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
