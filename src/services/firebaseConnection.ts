import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC9QaVOXBJ-S9vEm7HHZm0EWGZtTdSIfa4",
  authDomain: "boardapp-34dc5.firebaseapp.com",
  projectId: "boardapp-34dc5",
  storageBucket: "boardapp-34dc5.appspot.com",
  messagingSenderId: "248885927694",
  appId: "1:248885927694:web:014c598f64fc1ac320015f",
  measurementId: "G-P60SCW2FTG"
};

// Use this to initialize the firebase App
const firebaseApp = !firebase.apps.length ? firebase.initializeApp(firebaseConfig)
: firebase.app()

// Use these for db & auth
const db = firebaseApp.firestore();

export { db };
