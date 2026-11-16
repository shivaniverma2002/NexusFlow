import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut
} from "firebase/auth";

import { auth, googleProvider } from "../config/firebase.js";

// Register with email and password
export const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

// Login with email and password
export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

// Login with Google
export const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
};

// Logout user
export const logoutUser = () => {
    return signOut(auth);
};