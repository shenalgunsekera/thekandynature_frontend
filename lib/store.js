// Storage adapter. Uses Firestore when Firebase is configured, otherwise falls
// back to local JSON files in /data so everything works during development.
import { promises as fs } from "node:fs";
import path from "node:path";
import { getDb } from "./firebaseAdmin";

const DATA_DIR = path.join(process.cwd(), "data");
const LEADS = path.join(DATA_DIR, "leads.json");
const SUBS = path.join(DATA_DIR, "subscribers.json");
const BOOKINGS = path.join(DATA_DIR, "bookings.json");

async function readJson(file) {
  try {
    const arr = JSON.parse(await fs.readFile(file, "utf8"));
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
async function writeJson(file, arr) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(arr, null, 2), "utf8");
}

export function storageMode() {
  return getDb() ? "firestore" : "local-json";
}

export async function saveLead(lead) {
  const record = { ...lead, createdAt: new Date().toISOString() };
  const db = getDb();
  if (db) {
    const ref = await db.collection("leads").add(record);
    return ref.id;
  }
  const arr = await readJson(LEADS);
  arr.push(record);
  await writeJson(LEADS, arr);
  return record.id;
}

export async function saveSubscriber(email, meta = {}) {
  const lower = String(email).toLowerCase().trim();
  if (!lower) return;
  const db = getDb();
  if (db) {
    const docId = lower.replace(/[^a-z0-9]/g, "_");
    await db
      .collection("subscribers")
      .doc(docId)
      .set({ email: lower, ...meta, subscribedAt: new Date().toISOString() }, { merge: true });
    return;
  }
  const arr = await readJson(SUBS);
  if (!arr.some((s) => s.email === lower)) {
    arr.push({ email: lower, ...meta, subscribedAt: new Date().toISOString() });
    await writeJson(SUBS, arr);
  }
}

export async function listLeads(limit = 500) {
  const db = getDb();
  if (db) {
    const snap = await db.collection("leads").orderBy("createdAt", "desc").limit(limit).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return (await readJson(LEADS)).slice().reverse();
}

export async function listSubscribers(limit = 2000) {
  const db = getDb();
  if (db) {
    const snap = await db.collection("subscribers").orderBy("subscribedAt", "desc").limit(limit).get();
    return snap.docs.map((d) => d.data());
  }
  return (await readJson(SUBS)).slice().reverse();
}

// ── Bookings (admin calendar) ──
export async function listBookings() {
  const db = getDb();
  if (db) {
    const snap = await db.collection("bookings").orderBy("date", "asc").get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return await readJson(BOOKINGS);
}

export async function saveBooking(b) {
  const record = { ...b, createdAt: new Date().toISOString() };
  const db = getDb();
  if (db) {
    const ref = await db.collection("bookings").add(record);
    return { id: ref.id, ...record };
  }
  const arr = await readJson(BOOKINGS);
  const withId = { id: `bk_${Date.now().toString(36)}${Math.floor(Math.random() * 1e3)}`, ...record };
  arr.push(withId);
  await writeJson(BOOKINGS, arr);
  return withId;
}

export async function updateBooking(id, patch) {
  const db = getDb();
  if (db) {
    await db.collection("bookings").doc(id).set(patch, { merge: true });
    return;
  }
  const arr = await readJson(BOOKINGS);
  const i = arr.findIndex((b) => b.id === id);
  if (i >= 0) {
    arr[i] = { ...arr[i], ...patch };
    await writeJson(BOOKINGS, arr);
  }
}

export async function deleteBooking(id) {
  const db = getDb();
  if (db) {
    await db.collection("bookings").doc(id).delete();
    return;
  }
  const arr = await readJson(BOOKINGS);
  await writeJson(BOOKINGS, arr.filter((b) => b.id !== id));
}
