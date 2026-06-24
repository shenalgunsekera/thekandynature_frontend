// Lazily initialise Firebase Admin from env. Returns a Firestore instance, or
// null if the env vars aren't set (so the app falls back to local JSON storage).
import admin from "firebase-admin";

let db = null;
let tried = false;

export function getDb() {
  if (db) return db;
  if (tried) return null;
  tried = true;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) return null;

  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          // env stores newlines escaped as \n
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    }
    db = admin.firestore();
    return db;
  } catch (err) {
    console.error("[firebaseAdmin] init failed:", err.message);
    return null;
  }
}
