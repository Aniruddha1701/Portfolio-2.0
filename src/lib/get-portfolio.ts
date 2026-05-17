import dbConnect from '@/lib/db/mongoose';
import Portfolio from '@/models/Portfolio';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { logger } from '@/lib/logger';
import {
  saveLastKnownGood,
  getLastKnownGood,
  COLD_START_FALLBACK,
} from '@/lib/static-fallback';

export async function getPortfolioData() {
  // 1. Check in-memory cache first (zero cost)
  const cached = cache.get(CACHE_KEYS.PORTFOLIO);
  if (cached) {
    logger.debug('Portfolio cache HIT');
    return cached.data;
  }

  try {
    await dbConnect();

    // .lean() already returns a plain JS object — no need for JSON.parse(JSON.stringify())
    const portfolio = await Portfolio.findOne({}).lean();

    if (!portfolio) {
      logger.info('No portfolio found in database');
      return null;
    }

    // 2. Store in cache for subsequent requests
    cache.set(CACHE_KEYS.PORTFOLIO, portfolio, CACHE_TTL.PORTFOLIO);

    // 3. Save as "last known good" for fallback
    saveLastKnownGood(portfolio);

    logger.debug('Portfolio loaded from DB and cached');
    return portfolio;
  } catch (error: any) {
    logger.error('DB fetch failed — attempting fallback', {
      error: error.message,
    });

    // ── Graceful Degradation ──
    // Try last known good data first
    const fallback = getLastKnownGood();
    if (fallback) {
      const ageMinutes = Math.round(fallback.age / 60000);
      logger.warn(`Serving stale data (${ageMinutes}m old) due to DB failure`);
      return fallback.data;
    }

    // Absolute last resort: cold start fallback
    logger.warn('No cached data available — serving cold start fallback');
    return COLD_START_FALLBACK;
  }
}

export async function getPortfolioMetadata() {
  const portfolio = await getPortfolioData();

  if (!portfolio) {
    return {
      title: 'Portfolio',
      description: 'Professional Portfolio Website',
      name: 'Portfolio',
    };
  }

  const name = portfolio.personalInfo?.name || 'Portfolio';
  const title = portfolio.personalInfo?.title || 'Professional';
  const bio = portfolio.personalInfo?.bio || 'Professional Portfolio Website';

  return {
    title: `${name} | ${title}`,
    description: bio,
    name: name,
  };
}
