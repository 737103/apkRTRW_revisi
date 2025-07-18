// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { getDatabase, type Database } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // This is a placeholder. In a real application, these should be loaded from environment variables
  // or a secure configuration file, not directly from firebase.json client-side.
  // For this example, I'm hardcoding the values based on a typical firebase.json structure
  // that would be present in a Firebase project.
  // Replace with your actual project configuration
  apiKey: "AIzaSyBkfrvAGcJvLdhVNlHw8wOhuCrjgX1Pfyk",
  authDomain: "aplikasirtrw-nuwr3.web.app",
  projectId: "aplikasirtrw-nuwr3",
  storageBucket: "aplikasirtrw-nuwr3.appspot.com",
  messagingSenderId: "64245177816",
  appId: "1:64245177816:web:724c026756f4b2c6a0e6ad",
  measurementId: "YOUR_MEASUREMENT_ID",
  databaseURL: "https://aplikasirtrw-nuwr3-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);
const rtdb: Database = getDatabase(app);

export { app, auth, storage, rtdb };
