// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPfAtmsSawW5OND7C3eiZSOwkNbq1DngU",
  authDomain: "nexusflow-ai-7bceb.firebaseapp.com",
  projectId: "nexusflow-ai-7bceb",
  storageBucket: "nexusflow-ai-7bceb.firebasestorage.app",
  messagingSenderId: "697061849127",
  appId: "1:697061849127:web:452462bf10e94b1d213602",
  measurementId: "G-K5MP0469HC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
