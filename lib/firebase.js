import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Nilai diambil dari env var ber-prefix NEXT_PUBLIC_ (di-inline oleh Next.js saat build).
// JANGAN hardcode kredensial di sini — isi lewat .env (lokal) atau Environment Variables (Vercel).
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // opsional: hanya dipakai Firebase Analytics (measurementId dari Firebase Console)
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// measurementId tidak ikut diwajibkan karena opsional.
const REQUIRED_KEYS = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
];

const isFilled = (value) =>
  typeof value === 'string' && value.trim().length > 0 && !/^your[_-]/i.test(value.trim());

export const isFirebaseConfigured = REQUIRED_KEYS.every((key) => isFilled(firebaseConfig[key]));

// Dipakai kalau mau nampilkan field mana yang belum keisi (mis. di halaman debug).
export const missingFirebaseKeys = REQUIRED_KEYS.filter(
  (key) => !isFilled(firebaseConfig[key])
);

let cachedApp = null;
let cachedDb = null;

// Aman dipanggil berkali-kali (Strict Mode, hot reload, beberapa komponen).
// Guard ini perlu karena `initializeApp` melempar
// "Firebase App named '[DEFAULT]' already exists with different options or config"
// (app/duplicate-app) kalau dipanggil ulang dengan opsi yang berbeda, dan
// sekalian memastikan app + Firestore cuma dibikin sekali (di-cache).
export function getFirebaseApp() {
  if (!isFirebaseConfigured) return null;
  if (!cachedApp) {
    cachedApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }
  return cachedApp;
}

export function initFirebase() {
  if (!isFirebaseConfigured) return null;
  if (!cachedDb) {
    const app = getFirebaseApp();
    if (!app) return null;
    cachedDb = getFirestore(app);
  }
  return cachedDb;
}

// Analytics cuma jalan di browser, dan tidak didukung di semua environment
// (mis. beberapa embedded browser). Makanya di-import secara dinamis dan
// di-null-kan saja kalau tidak didukung, supaya tidak merusak SSR/build.
let analyticsPromise = null;

export function getAnalyticsClient() {
  if (typeof window === 'undefined') return Promise.resolve(null);
  if (!isFirebaseConfigured || !isFilled(firebaseConfig.measurementId)) {
    return Promise.resolve(null);
  }
  if (!analyticsPromise) {
    const app = getFirebaseApp();
    if (!app) return Promise.resolve(null);
    analyticsPromise = import('firebase/analytics').then(({ getAnalytics, isSupported }) =>
      isSupported().then((supported) => (supported ? getAnalytics(app) : null))
    );
  }
  return analyticsPromise;
}

export { firebaseConfig };
export default initFirebase;
