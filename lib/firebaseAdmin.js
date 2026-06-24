// Lazily initialise Firebase Admin (Firestore). Returns a Firestore instance,
// or null if no service-account credential is available (then the app falls
// back to local JSON storage in /data).
//
// Provide the credential EITHER way:
//   A) env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY
//   B) drop the downloaded service-account JSON as ./serviceAccountKey.json
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let db = null;
let tried = false;

function loadCert() {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env;
  if (FIREBASE_PROJECT_ID && FIREBASE_CLIENT_EMAIL && FIREBASE_PRIVATE_KEY) {
    return cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"), // env stores \n escaped
    });
  }

  const file = path.join(process.cwd(), "serviceAccountKey.json");
  if (existsSync(file)) {
    try {
      const json = JSON.parse(readFileSync(file, "utf8"));
      if (json.project_id && json.client_email && json.private_key) {
        return cert({
          projectId: json.project_id,
          clientEmail: json.client_email,
          privateKey: json.private_key,
        });
      }
    } catch (err) {
      console.error("[firebaseAdmin] invalid serviceAccountKey.json:", err.message);
    }
  }
  return null;
}

export function getDb() {
  if (db) return db;
  if (tried) return null;
  tried = true;

  const credential = loadCert();
  if (!credential) return null;

  try {
    if (!getApps().length) initializeApp({ credential });
    db = getFirestore();
    return db;
  } catch (err) {
    console.error("[firebaseAdmin] init failed:", err.message);
    return null;
  }
}
