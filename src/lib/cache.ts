/**
 * Lightweight in-memory cache with TTL.
 * Perfect for a single-instance portfolio site where data changes infrequently.
 * Avoids hitting MongoDB on every visitor request.
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  etag: string;
}

class MemoryCache {
  private store = new Map<string, CacheEntry<any>>();

  /**
   * Get a cached value. Returns null if expired or missing.
   */
  get<T>(key: string): { data: T; etag: string } | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return { data: entry.data, etag: entry.etag };
  }

  /**
   * Store a value with a TTL in seconds.
   */
  set<T>(key: string, data: T, ttlSeconds: number): string {
    const etag = this.generateETag(data);
    this.store.set(key, {
      data,
      expiresAt: Date.now() + ttlSeconds * 1000,
      etag,
    });
    return etag;
  }

  /**
   * Invalidate a specific key (call after admin writes).
   */
  invalidate(key: string): void {
    this.store.delete(key);
  }

  /**
   * Invalidate all keys matching a prefix.
   */
  invalidatePrefix(prefix: string): void {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Generate a simple ETag from data for HTTP cache validation.
   */
  private generateETag(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return `"${Math.abs(hash).toString(36)}"`;
  }
}

// Singleton — survives hot reloads via global
const globalCache = (global as any).__memoryCache || new MemoryCache();
if (!(global as any).__memoryCache) {
  (global as any).__memoryCache = globalCache;
}

export const cache = globalCache as MemoryCache;

// Cache keys
export const CACHE_KEYS = {
  PORTFOLIO: 'portfolio:data',
} as const;

// TTL values in seconds
export const CACHE_TTL = {
  PORTFOLIO: 5 * 60, // 5 minutes — portfolio data rarely changes
} as const;
