// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Add other Firebase services as needed, e.g. auth, firestore
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Replace the below config object with your own from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCuf3ICl0pDwaCoujmRdC0F_y2oYOp1tv4",
  authDomain: "qbl-question-based-learning.firebaseapp.com",
  projectId: "qbl-question-based-learning",
  storageBucket: "qbl-question-based-learning.firebasestorage.app",
  messagingSenderId: "257229498358",
  appId: "1:257229498358:web:89191af1d1a2c4b19489d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export initialized services as needed
// export const auth = getAuth(app);
// export const db = getFirestore(app);

export default app;
