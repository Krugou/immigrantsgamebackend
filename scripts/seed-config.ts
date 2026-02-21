import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

// Load Service Account
// Based on backend/firebase.ts investigation:
const serviceAccountPath = path.resolve(
  process.cwd(),
  'backend',
  'immigrants-game-firebase-adminsdk-fbsvc-da4aa4541e.json',
);

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`Service account file not found at: ${serviceAccountPath}`);
  process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// localized items include an English and Finnish label
interface LocalizedItem {
  key: string;
  en: string;
  fi: string;
}

const TERRITORY_TYPES: LocalizedItem[] = [
  { key: 'rural', en: 'Rural', fi: 'Maaseutu' },
  { key: 'suburbs', en: 'Suburbs', fi: 'Esikaupunkialue' },
  { key: 'urban', en: 'Urban Center', fi: 'Keskusta' },
  { key: 'metropolis', en: 'Metropolis', fi: 'Metropoli' },
  { key: 'border', en: 'Border Town', fi: 'Rajakaupunki' },
  { key: 'coastal', en: 'Coastal Port', fi: 'Rannikkosatama' },
  { key: 'caves', en: 'Cave Network', fi: 'Luolaverkosto' },
  { key: 'underground', en: 'Underground City', fi: 'Maanalainen kaupunki' },
  { key: 'mountains', en: 'Mountain Settlement', fi: 'Vuoristokylä' },
  { key: 'desert', en: 'Desert Outpost', fi: 'Aavikkopartioasema' },
  { key: 'arctic', en: 'Arctic Base', fi: 'Arktinen tukikohta' },
  { key: 'moon', en: 'Lunar Colony', fi: 'Kuun siirtokunta' },
  { key: 'orbital', en: 'Orbital Platform', fi: 'Maanlentoalusta' },
  { key: 'spaceStation', en: 'Space Station Alpha', fi: 'Avaruusasema Alfa' },
  { key: 'interstellar', en: 'Interstellar Ark', fi: 'Tähtienvälinen arkki' },
  { key: 'milestone', en: 'Milestone', fi: 'Virstanpylväs' },
];

const EVENT_TYPES: LocalizedItem[] = [
  { key: 'immigration', en: 'Immigration', fi: 'Maahanmuutto' },
  { key: 'emigration', en: 'Emigration', fi: 'Muutto ulkomaille' },
  { key: 'disaster', en: 'Disaster', fi: 'Kaatastrofi' },
  { key: 'opportunity', en: 'Opportunity', fi: 'Mahdollisuus' },
  { key: 'milestone', en: 'Milestone', fi: 'Virstanpylväs' },
];
const CATEGORIES: LocalizedItem[] = [
  { key: 'opportunity', en: 'Opportunity', fi: 'Mahdollisuus' },
  { key: 'disaster', en: 'Disaster', fi: 'Kaatastrofi' },
  { key: 'milestone', en: 'Milestone', fi: 'Virstanpylväs' },
  { key: 'neutral', en: 'Neutral', fi: 'Neutraali' },
];

const seed = async () => {
  console.log('Seeding system configuration...');
  try {
    await db.collection('config').doc('metadata').set({
      territoryTypes: TERRITORY_TYPES,
      eventTypes: EVENT_TYPES,
      categories: CATEGORIES,
      updatedAt: Date.now(),
      seededAt: Date.now(),
    });
    console.log('✅ Configuration seeded successfully.');
  } catch (error) {
    console.error('❌ Error seeding config:', error);
  } finally {
    process.exit();
  }
};

seed();
