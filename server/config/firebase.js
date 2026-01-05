import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var", e);
    }
} else {
    try {
        serviceAccount = require('../serviceAccountKey.json');
    } catch (e) {
        console.warn("Service account key not found. Firebase Admin may fail if not in Google Cloud environment.");
    }
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    // Fallback for when running on GCP infrastructure automagically or just to prevent crash on build
    if (admin.apps.length === 0) {
        admin.initializeApp();
    }
}

const db = admin.firestore();

export { db };
