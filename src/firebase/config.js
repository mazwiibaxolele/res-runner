import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Check if all necessary Firebase config keys are present
const firebaseConfig = {
  apiKey: "AIzaSyAIfzBkA65MP6j4Objge-ClJtlkMFKsmxI",
  authDomain: "resrunner-d3f76.firebaseapp.com",
  projectId: "resrunner-d3f76",
  storageBucket: "resrunner-d3f76.firebasestorage.app",
  messagingSenderId: "716599779870",
  appId: "1:716599779870:web:07e07c15d2b31232a8c40f"
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
