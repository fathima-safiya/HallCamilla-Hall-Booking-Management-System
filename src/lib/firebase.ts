import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import exampleConfig from '../../firebase.config.example.json';

/** Paste your Firebase web app config here (copy firebase.config.example.json → firebase.config.json) */
export interface FirebaseFileConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
  adminEmails?: string | string[];
  demoPassword?: string;
}

const userConfigModules = import.meta.glob<FirebaseFileConfig>('../../firebase.config.json', {
  eager: true,
  import: 'default',
});

const fileConfig: FirebaseFileConfig =
  Object.values(userConfigModules)[0] ?? exampleConfig;

const firebaseConfig = {
  apiKey: fileConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: fileConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: fileConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: fileConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: fileConfig.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: fileConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID,
};

const placeholderValues = new Set([
  '',
  'YOUR_API_KEY',
  'YOUR_PROJECT_ID',
  'YOUR_MESSAGING_SENDER_ID',
  'YOUR_APP_ID',
]);

function isRealValue(value: string | undefined): boolean {
  return Boolean(value && !placeholderValues.has(value) && !value.includes('YOUR_'));
}

export const isFirebaseConfigured = Boolean(
  isRealValue(firebaseConfig.apiKey) &&
  isRealValue(firebaseConfig.authDomain) &&
  isRealValue(firebaseConfig.projectId) &&
  isRealValue(firebaseConfig.appId)
);

let app = null as unknown as FirebaseApp;
let auth = null as unknown as Auth;
let db = null as unknown as Firestore;
let storage = null as unknown as FirebaseStorage;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else if (import.meta.env.DEV) {
  console.warn(
    '[Camilla] Firebase is not configured. Copy firebase.config.example.json to firebase.config.json and paste your Firebase web config — or use .env. Until then, data uses browser localStorage.'
  );
}

export { app, auth, db, storage };

const adminFromFile = fileConfig.adminEmails;
const adminFromEnv = import.meta.env.VITE_ADMIN_EMAILS;

export const ADMIN_EMAILS = (
  adminFromFile
    ? Array.isArray(adminFromFile)
      ? adminFromFile
      : adminFromFile.split(',')
    : adminFromEnv
      ? adminFromEnv.split(',')
      : ['admincamillahotel@gmail.com']
)
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const DEMO_PASSWORD =
  fileConfig.demoPassword || import.meta.env.VITE_DEMO_PASSWORD || 'admin123';
