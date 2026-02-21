import { Router } from 'express';
import type { Request, Response } from 'express';
import { getDb } from '../firebase.js';

// support bilingual configuration values
interface LocalizedItem {
  key: string;
  en: string;
  fi: string;
}

export type ConfigValue = string[] | LocalizedItem[];

const router = Router();

/**
 * GET /api/admin/config
 * Retrieves the system configuration (metadata) from Firestore.
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const configDoc = await db.collection('config').doc('metadata').get();

    if (!configDoc.exists) {
      // Return default values if doc doesn't exist yet.  Defaults now match
      // the new localized structure so clients can safely consume either
      // plain strings or objects.
      return res.json({
        territoryTypes: [
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
        ],
        eventTypes: [
          { key: 'immigration', en: 'Immigration', fi: 'Maahanmuutto' },
          { key: 'emigration', en: 'Emigration', fi: 'Muutto ulkomaille' },
          { key: 'disaster', en: 'Disaster', fi: 'Kaatastrofi' },
          { key: 'opportunity', en: 'Opportunity', fi: 'Mahdollisuus' },
          { key: 'milestone', en: 'Milestone', fi: 'Virstanpylväs' },
        ],
        categories: [
          { key: 'opportunity', en: 'Opportunity', fi: 'Mahdollisuus' },
          { key: 'disaster', en: 'Disaster', fi: 'Kaatastrofi' },
          { key: 'milestone', en: 'Milestone', fi: 'Virstanpylväs' },
          { key: 'neutral', en: 'Neutral', fi: 'Neutraali' },
        ],
      });
    }

    res.json(configDoc.data());
  } catch (err: unknown) {
    console.error('Error fetching config', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

/**
 * POST /api/admin/config
 * Updates the system configuration in Firestore.
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { territoryTypes, eventTypes, categories } = req.body;
    const db = getDb();

    await db.collection('config').doc('metadata').set({
      territoryTypes,
      eventTypes,
      categories,
      updatedAt: Date.now(),
    });

    res.json({ success: true });
  } catch (err: unknown) {
    console.error('Error updating config', err);
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

export default router;
