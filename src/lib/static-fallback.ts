/**
 * Static Fallback Data
 *
 * When MongoDB is unreachable, the site serves this cached snapshot
 * instead of showing an error page. This ensures the portfolio is
 * ALWAYS available, even during database outages.
 *
 * Strategy: After every successful DB read, we store the latest data
 * in `lastKnownGoodData`. If DB fails, we serve that snapshot.
 * On a fresh cold start with no DB, we serve this minimal fallback.
 */

import { logger } from '@/lib/logger';

// In-memory "last known good" snapshot — survives within the process lifetime
let lastKnownGoodData: any = null;
let lastKnownGoodTimestamp: number = 0;

/**
 * Save a snapshot of good data (called after every successful DB read).
 */
export function saveLastKnownGood(data: any): void {
  if (data) {
    lastKnownGoodData = data;
    lastKnownGoodTimestamp = Date.now();
    logger.debug('Static fallback updated', {
      timestamp: new Date(lastKnownGoodTimestamp).toISOString(),
    });
  }
}

/**
 * Get the last known good data. Returns null if nothing has been saved yet.
 */
export function getLastKnownGood(): { data: any; age: number } | null {
  if (!lastKnownGoodData) return null;
  return {
    data: lastKnownGoodData,
    age: Date.now() - lastKnownGoodTimestamp,
  };
}

/**
 * Minimal fallback for when there's absolutely no cached data
 * (cold start + DB down). Shows a bare-bones but functional page
 * rather than an error screen.
 */
export const COLD_START_FALLBACK = {
  personalInfo: {
    name: 'Portfolio',
    title: 'Developer',
    bio: 'This portfolio is temporarily loading offline data. Please refresh in a moment.',
    email: '',
    location: '',
  },
  socialLinks: {},
  skills: [],
  projects: [],
  education: [],
  experience: [],
  achievements: [],
  settings: {
    openToWork: false,
  },
};
