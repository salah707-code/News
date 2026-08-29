// Client-side image caching system using Cache Storage API & Object URLs
// Reduces data usage, enables instant offline image access, and speeds up article loading

const IMAGE_CACHE_NAME = 'pulse-news-images-cache-v1';

// In-memory lookup map from source URL to Object URL
const memoryObjectUrlMap = new Map<string, string>();
const inflightRequests = new Map<string, Promise<string>>();

/**
 * Checks if Cache Storage API is supported in the current environment
 */
export function isCacheStorageAvailable(): boolean {
  return typeof window !== 'undefined' && 'caches' in window;
}

/**
 * Retrieves a cached version of the image or fetches and caches it.
 * Returns an Object URL for instant, zero-network re-rendering.
 */
export async function getCachedImageUrl(url: string): Promise<string> {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return url || '';
  }

  // 1. Check in-memory cache
  if (memoryObjectUrlMap.has(url)) {
    return memoryObjectUrlMap.get(url)!;
  }

  // 2. Return inflight promise if already fetching
  if (inflightRequests.has(url)) {
    return inflightRequests.get(url)!;
  }

  const fetchPromise = (async () => {
    try {
      if (!isCacheStorageAvailable()) {
        return url;
      }

      const cache = await caches.open(IMAGE_CACHE_NAME);
      const match = await cache.match(url);

      if (match) {
        const blob = await match.blob();
        const objectUrl = URL.createObjectURL(blob);
        memoryObjectUrlMap.set(url, objectUrl);
        return objectUrl;
      }

      // Fetch from network with CORS mode
      const response = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
        cache: 'force-cache',
      });

      if (response && response.ok) {
        // Cache clone
        try {
          await cache.put(url, response.clone());
        } catch {
          // Ignore cache quota or put errors
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        memoryObjectUrlMap.set(url, objectUrl);
        return objectUrl;
      }

      return url;
    } catch {
      // Fallback gracefully to original url on any fetch/CORS errors
      return url;
    } finally {
      inflightRequests.delete(url);
    }
  })();

  inflightRequests.set(url, fetchPromise);
  return fetchPromise;
}

/**
 * Preloads a list of image URLs in the background to warm the cache
 */
export async function preloadImages(urls: string[]): Promise<void> {
  if (!urls || urls.length === 0) return;
  const uniqueUrls = Array.from(new Set(urls.filter(u => u && u.startsWith('http'))));

  // Process in small parallel chunks to avoid network congestion
  const CHUNK_SIZE = 4;
  for (let i = 0; i < uniqueUrls.length; i += CHUNK_SIZE) {
    const chunk = uniqueUrls.slice(i, i + CHUNK_SIZE);
    await Promise.allSettled(chunk.map(u => getCachedImageUrl(u)));
  }
}

/**
 * Computes current cache metrics (number of stored images and estimated megabytes)
 */
export async function getImageCacheMetrics(): Promise<{ count: number; estimatedMb: number }> {
  try {
    if (!isCacheStorageAvailable()) {
      return { count: memoryObjectUrlMap.size, estimatedMb: Number((memoryObjectUrlMap.size * 0.25).toFixed(1)) };
    }

    const cache = await caches.open(IMAGE_CACHE_NAME);
    const keys = await cache.keys();
    const count = keys.length;
    // Estimate ~280KB per high-res news image
    const estimatedMb = Number(((count * 280) / 1024).toFixed(1));
    return { count, estimatedMb };
  } catch {
    return { count: memoryObjectUrlMap.size, estimatedMb: 0 };
  }
}

/**
 * Completely clears all cached images and revokes Object URLs to free memory and disk space
 */
export async function clearAllImageCache(): Promise<boolean> {
  try {
    // 1. Revoke memory object URLs
    for (const objectUrl of memoryObjectUrlMap.values()) {
      try {
        URL.revokeObjectURL(objectUrl);
      } catch {
        // Ignore
      }
    }
    memoryObjectUrlMap.clear();
    inflightRequests.clear();

    // 2. Delete cache from Cache Storage API
    if (isCacheStorageAvailable()) {
      await caches.delete(IMAGE_CACHE_NAME);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('news-image-cache-cleared'));
    }

    return true;
  } catch {
    return false;
  }
}
