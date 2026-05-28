import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Check if all necessary Firebase config keys are present
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasConfig = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  firebaseConfig.authDomain && 
  firebaseConfig.projectId;

let app = null;
let auth = null;
let db = null;
let storage = null;
let isFirebaseEnabled = false;

if (hasConfig) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    isFirebaseEnabled = true;
    console.log('🟢 Firebase initialized successfully in Cloud Mode.');
  } catch (error) {
    console.error('🔴 Error initializing Firebase:', error);
    isFirebaseEnabled = false;
  }
} else {
  console.log('🟡 Running in Local Simulation Mode. Provide .env config to connect live Firebase.');
}

export { isFirebaseEnabled, app, auth, db, storage };
