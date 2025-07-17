
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Lazily initialize Firebase services
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (typeof window !== 'undefined') {
  try {
    fetch('/firebase.json')
      .then(response => response.json())
      .then(firebaseConfig => {
        app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
      })
      .catch(error => {
        console.error("Could not load or initialize Firebase from config file.", error);
      });
  } catch (error) {
    console.error("Firebase initialization error", error);
    // You might want to handle this error more gracefully
  }
}


export { app, auth, db, storage };
