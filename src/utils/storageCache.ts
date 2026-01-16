/**
 * Storage cache utility for optimizing localStorage operations
 * Provides batching, caching, and debouncing for localStorage access
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

class StorageCache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();
  private writeQueue: Map<string, any> = new Map();
  private writeTimer: number | null = null;
  private readonly BATCH_WRITE_DELAY = 100; // 100ms debounce for writes

  /**
   * Get item from cache or localStorage
   */
  getItem<T>(key: string, ttl?: number): T | null {
    // Check memory cache first
    const cached = this.memoryCache.get(key);
    if (cached) {
      // Check if cache is still valid
      if (!cached.ttl || Date.now() - cached.timestamp < cached.ttl) {
        return cached.value as T;
      }
      // Cache expired, remove it
      this.memoryCache.delete(key);
    }

    // Fall back to localStorage
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;

      const parsed = JSON.parse(item);
      
      // Store in memory cache
      this.memoryCache.set(key, {
        value: parsed,
        timestamp: Date.now(),
        ttl,
      });

      return parsed as T;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set item with batching and caching
   */
  setItem<T>(key: string, value: T, immediate: boolean = false): void {
    // Update memory cache immediately
    this.memoryCache.set(key, {
      value,
      timestamp: Date.now(),
    });

    if (immediate) {
      // Write immediately
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error writing localStorage key "${key}":`, error);
      }
    } else {
      // Add to write queue for batching
      this.writeQueue.set(key, value);
      
      // Debounce writes
      if (this.writeTimer !== null) {
        clearTimeout(this.writeTimer);
      }
      
      this.writeTimer = window.setTimeout(() => {
        this.flush();
      }, this.BATCH_WRITE_DELAY);
    }
  }

  /**
   * Remove item from cache and localStorage
   */
  removeItem(key: string): void {
    this.memoryCache.delete(key);
    this.writeQueue.delete(key);
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }

  /**
   * Flush all pending writes to localStorage
   */
  flush(): void {
    if (this.writeTimer !== null) {
      clearTimeout(this.writeTimer);
      this.writeTimer = null;
    }

    try {
      // Batch write all queued items
      this.writeQueue.forEach((value, key) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
      this.writeQueue.clear();
    } catch (error) {
      console.error('Error flushing localStorage writes:', error);
    }
  }

  /**
   * Clear memory cache (useful for testing or memory management)
   */
  clearCache(): void {
    this.memoryCache.clear();
  }

  /**
   * Get multiple items efficiently
   */
  getMultiple<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    keys.forEach(key => {
      result[key] = this.getItem<T>(key);
    });
    return result;
  }

  /**
   * Set multiple items efficiently (batched)
   */
  setMultiple(items: Record<string, any>, immediate: boolean = false): void {
    Object.entries(items).forEach(([key, value]) => {
      this.setItem(key, value, immediate);
    });
  }
}

// Singleton instance
export const storageCache = new StorageCache();

// Flush on page unload to ensure no data loss
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    storageCache.flush();
  });
}

