import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import Portfolio from '@/models/Portfolio';
import { requireAdmin } from '@/middleware/auth';
import { successResponse, errorResponse, serverError, forbiddenResponse, notFoundResponse } from '@/lib/api-response';
import { logAudit, logAuditAsync } from '@/lib/audit';
import { cache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { logger } from '@/lib/logger';
import { saveLastKnownGood, getLastKnownGood, COLD_START_FALLBACK } from '@/lib/static-fallback';

// Allow Next.js to use ISR-style caching for the GET endpoint
// Admin mutations will invalidate the cache manually
export const dynamic = 'force-dynamic';

// ─── GET - Fetch portfolio data (Public) ────────────────────────────
// This is the most-called endpoint. Every visitor hits it.
// Optimizations: in-memory cache, ETag support, Cache-Control headers.
export async function GET(request: NextRequest) {
  try {
    // 1. Check If-None-Match (ETag) — return 304 if nothing changed
    const clientETag = request.headers.get('if-none-match');

    // 2. Try in-memory cache first (zero DB cost)
    const cached = cache.get(CACHE_KEYS.PORTFOLIO);

    if (cached) {
      // Client already has this version? Return 304 Not Modified (no body)
      if (clientETag && clientETag === cached.etag) {
        return new NextResponse(null, {
          status: 304,
          headers: {
            'ETag': cached.etag,
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        });
      }

      // Serve from cache with proper headers
      return NextResponse.json(
        { success: true, data: cached.data },
        {
          status: 200,
          headers: {
            'ETag': cached.etag,
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            'X-Cache': 'HIT',
          },
        }
      );
    }

    // 3. Cache miss — fetch from DB
    await dbConnect();
    const portfolio = await Portfolio.findOne({}).lean();

    if (!portfolio) {
      return notFoundResponse('Portfolio not found');
    }

    // 4. Populate cache
    const etag = cache.set(CACHE_KEYS.PORTFOLIO, portfolio, CACHE_TTL.PORTFOLIO);

    // 5. Save as fallback for DB outages
    saveLastKnownGood(portfolio);
    logger.debug('Portfolio fetched from DB', { source: 'mongodb' });

    // 6. Check ETag against freshly computed value
    if (clientETag && clientETag === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    }

    return NextResponse.json(
      { success: true, data: portfolio },
      {
        status: 200,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          'X-Cache': 'MISS',
        },
      }
    );
  } catch (error: any) {
    // ── Graceful Degradation: serve fallback data on DB failure ──
    logger.error('Portfolio GET failed', { error: error.message });

    const fallback = getLastKnownGood();
    if (fallback) {
      const ageMinutes = Math.round(fallback.age / 60000);
      logger.warn(`Serving stale portfolio data (${ageMinutes}m old)`);
      return NextResponse.json(
        { success: true, data: fallback.data, degraded: true, staleAge: ageMinutes },
        {
          status: 200,
          headers: {
            'X-Cache': 'FALLBACK',
            'X-Data-Age': `${ageMinutes}m`,
            'Cache-Control': 'private, max-age=30',
          },
        }
      );
    }

    // Cold start + DB down: serve minimal data
    logger.warn('No fallback data — serving cold start fallback');
    return NextResponse.json(
      { success: true, data: COLD_START_FALLBACK, degraded: true, coldStart: true },
      {
        status: 200,
        headers: {
          'X-Cache': 'COLD-FALLBACK',
          'Cache-Control': 'private, max-age=10',
        },
      }
    );
  }
}

// ─── POST - Create portfolio (Admin only) ───────────────────────────
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  try {
    const authUser = await requireAdmin(request);
    if (!authUser) {
      return forbiddenResponse('Admin access required');
    }

    await dbConnect();

    const data = await request.json();
    const existingPortfolio = await Portfolio.findOne({}).lean();

    if (existingPortfolio) {
      return errorResponse('Portfolio already exists. Use PUT to update.', 400);
    }

    const portfolio = await Portfolio.create(data);

    // Invalidate cache so next GET reflects the new data
    cache.invalidate(CACHE_KEYS.PORTFOLIO);

    // Fire-and-forget audit — don't block the response
    logAuditAsync({
      action: 'PORTFOLIO_UPDATE',
      userId: authUser.userId,
      email: authUser.email,
      status: 'success',
      details: 'Created new portfolio',
      ip
    });

    return successResponse(portfolio, 'Portfolio created successfully', 201);

  } catch (error: any) {
    return serverError(error);
  }
}

// ─── PUT - Update portfolio (Admin only) ────────────────────────────
// Optimized: single findOneAndUpdate with upsert instead of findOne + findByIdAndUpdate
export async function PUT(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  try {
    const authUser = await requireAdmin(request);
    if (!authUser) {
      return forbiddenResponse('Admin access required');
    }

    await dbConnect();

    const data = await request.json();
    const { _id, ...updateData } = data;

    // Normalize data (ensure structure is correct)
    if (updateData.education) {
      updateData.education = updateData.education.map((edu: any) => ({
        institution: edu.institution || '',
        degree: edu.degree || '',
        field: edu.field || '',
        location: edu.location || '',
        duration: edu.duration || '',
        startDate: edu.startDate || null,
        endDate: edu.endDate || null,
        current: edu.current || false,
        gpa: edu.gpa || '',
        achievements: edu.achievements || [],
        iconType: edu.iconType || 'university'
      }));
    }

    if (updateData.experience) {
      updateData.experience = updateData.experience.map((exp: any) => ({
        company: exp.company || exp.institution || '',
        position: exp.position || exp.degree || '',
        institution: exp.institution || exp.company || '',
        degree: exp.degree || exp.position || '',
        location: exp.location || '',
        duration: exp.duration || '',
        startDate: exp.startDate || null,
        endDate: exp.endDate || null,
        current: exp.current || false,
        description: exp.description || exp.highlights || [],
        highlights: exp.highlights || exp.description || [],
        iconType: exp.iconType || 'briefcase'
      }));
    }

    // Single atomic operation: update if exists, create if not
    const portfolio = await Portfolio.findOneAndUpdate(
      {},
      { $set: updateData },
      {
        new: true,          // Return the updated document
        upsert: true,       // Create if doesn't exist
        runValidators: true, // Validate the update
        lean: true,         // Return plain JS object (faster)
      }
    );

    if (!portfolio) {
      return notFoundResponse('Failed to update/create portfolio');
    }

    // Invalidate cache so next GET reflects updates
    cache.invalidate(CACHE_KEYS.PORTFOLIO);

    // Fire-and-forget audit
    logAuditAsync({
      action: 'PORTFOLIO_UPDATE',
      userId: authUser.userId,
      email: authUser.email,
      status: 'success',
      details: 'Updated portfolio data',
      ip
    });

    return successResponse(portfolio, 'Portfolio updated successfully');

  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return errorResponse(`Validation error: ${error.message}`, 400);
    }
    return serverError(error);
  }
}

// ─── DELETE - Delete portfolio (Admin only) ─────────────────────────
export async function DELETE(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';

  try {
    const authUser = await requireAdmin(request);
    if (!authUser) {
      return forbiddenResponse('Admin access required');
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return errorResponse('Portfolio ID required', 400);

    const portfolio = await Portfolio.findByIdAndDelete(id);

    if (!portfolio) {
      return notFoundResponse('Portfolio not found');
    }

    // Invalidate cache
    cache.invalidate(CACHE_KEYS.PORTFOLIO);

    // Fire-and-forget audit
    logAuditAsync({
      action: 'PORTFOLIO_UPDATE',
      userId: authUser.userId,
      email: authUser.email,
      status: 'success',
      details: `Deleted portfolio: ${id}`,
      ip
    });

    return successResponse(null, 'Portfolio deleted successfully');

  } catch (error: any) {
    return serverError(error);
  }
}
