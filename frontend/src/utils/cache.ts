// In-memory cache storage for API lookups
const memoryCache = new Map<string, { data: any; expiry: number }>();

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds (default: 5 minutes / 300000ms)
}

/**
 * Wraps an async function with an in-memory caching layer.
 * If the cache is valid and not expired, returns the cached data immediately.
 * Otherwise, executes the fetcher, updates the cache, and returns the data.
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const ttl = options.ttl ?? 5 * 60 * 1000; // 5 minutes default
  const now = Date.now();
  const cached = memoryCache.get(key);

  if (cached && cached.expiry > now) {
    return cached.data as T;
  }

  // Fetch new data
  const data = await fetcher();

  // Save to cache
  memoryCache.set(key, {
    data,
    expiry: Date.now() + ttl,
  });

  return data;
}

/**
 * Clears the cache. If a prefix is provided, clears all keys starting with that prefix.
 * Otherwise, clears the entire cache.
 */
export function clearCache(prefix?: string) {
  if (prefix) {
    for (const key of memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        memoryCache.delete(key);
      }
    }
  } else {
    memoryCache.clear();
  }
}
