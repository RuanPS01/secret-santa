// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcdKfEr44UoKI4XDGeUlIqzMIwaRGzwpQ",
  authDomain: "secret-santa-a6f6b.firebaseapp.com",
  projectId: "secret-santa-a6f6b",
  storageBucket: "secret-santa-a6f6b.firebasestorage.app",
  messagingSenderId: "629508151873",
  appId: "1:629508151873:web:acd3509d115e80651684c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
