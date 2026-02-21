import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SERVICE_ACCOUNT_PATH = path.join(
  __dirname,
  'immigrants-game-firebase-adminsdk-fbsvc-da4aa4541e.json',
);

export const initFirebase = () => {
  if (admin.apps.length) return;

  // emulator override (does not require credentials)
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    const projectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      'local-emulator';
    admin.initializeApp({ projectId });
    console.log(
      `Firebase admin initialized against emulator (${process.env.FIRESTORE_EMULATOR_HOST}) with projectId=${projectId}`,
    );
    return;
  }

  // 1. Try local service account file in backend/
  console.log(`Looking for service account at ${SERVICE_ACCOUNT_PATH}`);
  if (fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.log('Service account file found, attempting to load');
    try {
      const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8')) as Record<
        string,
        unknown
      >;
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      console.log('Firebase admin initialized with local service account');
      return;
    } catch (e) {
      console.error('Failed to parse or initialize with local service account', e);
    }
  } else {
    console.warn('Service account file not found at expected path');
  }

  // 2. Try env-based service account
  let serviceAccount: Record<string, unknown> | undefined;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch {
      console.error('FIREBASE_SERVICE_ACCOUNT is not valid JSON');
    }
  }

  const credPath = process.env.FIREBASE_CREDENTIALS_PATH;
  if (!serviceAccount && credPath && fs.existsSync(credPath)) {
    try {
      serviceAccount = JSON.parse(fs.readFileSync(credPath, 'utf8')) as Record<string, unknown>;
    } catch {
      console.error('FIREBASE_CREDENTIALS_PATH does not point to valid JSON');
    }
  }

  if (serviceAccount) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    console.log('Firebase admin initialized with service account from env');
  } else {
    const projectId =
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    if (projectId) {
      try {
        admin.initializeApp({ projectId });
        console.warn(`Firebase admin initialized with projectId: ${projectId}`);
      } catch (err) {
        console.error(
          'Failed to initialize Firebase admin with projectId, credentials may be missing',
          err,
        );
      }
    } else {
      try {
        admin.initializeApp();
        console.warn('Firebase admin initialized with default credentials');
      } catch (err) {
        console.error('Firebase admin default initialization failed, credentials unavailable', err);
      }
    }
  }
};

export const getDb = () => {
  initFirebase();
  try {
    return admin.firestore();
  } catch (err) {
    console.warn('Firestore client creation failed, returning no-op stub', err);
    // stub that satisfies minimal interface used by routes
    return {
      collection: () => ({
        doc: () => ({
          get: async () => ({ exists: false, data: () => ({}) }),
          set: async () => {},
        }),
      }),
    } as any;
  }
};

export default admin;
