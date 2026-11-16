import { createRequire } from "node:module";

import {
    initializeApp,
    cert,
    getApps
} from "firebase-admin/app";

import { getAuth } from "firebase-admin/auth";

// Load Firebase service account credentials
const require = createRequire(import.meta.url);

const serviceAccount = require("../../firebase-service-account.json");

// Initialize Firebase Admin only once
const firebaseApp = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount)
    });

// Export Firebase authentication
export const auth = getAuth(firebaseApp);