import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDI06_Y4iwIVsdv8xGjEaa58Hhm8zKCdko",
  authDomain: "taquito-website.firebaseapp.com",
  projectId: "taquito-website",
  storageBucket: "taquito-website.appspot.com",
  messagingSenderId: "1012224568506",
  appId: "1:1012224568506:web:4f002127ca5befe0606683",
  measurementId: "G-10XDH1C93H"
};

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export {db}
