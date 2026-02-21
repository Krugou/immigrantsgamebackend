/* eslint-disable */

import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LOCAL_SERVICE_ACCOUNT = path.join(
  __dirname,
  '..',
  'backend',
  'immigrants-game-firebase-adminsdk-fbsvc-da4aa4541e.json',
);

function loadServiceAccount(): any {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
    } catch (e) {
      console.error('FIREBASE_SERVICE_ACCOUNT is not valid JSON');
    }
  }

  if (process.env.FIREBASE_CREDENTIALS_PATH) {
    const p = process.env.FIREBASE_CREDENTIALS_PATH;
    if (fs.existsSync(p)) {
      try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
      } catch (e) {
        console.error('FIREBASE_CREDENTIALS_PATH does not point to valid JSON');
      }
    }
  }

  if (fs.existsSync(LOCAL_SERVICE_ACCOUNT)) {
    try {
      return JSON.parse(fs.readFileSync(LOCAL_SERVICE_ACCOUNT, 'utf8'));
    } catch (e) {
      console.error('Local service account file is not valid JSON');
