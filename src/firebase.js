import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore,enableNetwork } from 'firebase/firestore';
import {doc,setDoc,getDocs,collection} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
enableNetwork(db);
console.log("Firestore instance:", db);
console.log("Firestore app name:", db.app.name);

/**
 * Ensures user document exists or updates it
 */
export const ensureUserDoc = async (user) => {
  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email,
    },
    { merge: true }
  );
};



export { auth, db, app };
