import { ApiService } from './api';

export type CacheLevel = 'memory' | 'local' | 'session' | 'redis';

export interface CacheOptions {
  level?: CacheLevel;
  ttl?: number;
  tags?: string[];
  compress?: boolean;
  encryption?: {
    enabled: boolean;
    algorithm?: string;
  };
  versioning?: boolean;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  lastUpdated?: Date;
}

export interface CacheEntry<T = any> {
  key: string;
  value: T;
  level: CacheLevel;
  createdAt: Date;
  expiresAt?: Date;
  tags?: string[];
  version?: number;
}

export class CacheService {
  private api = ApiService.getInstance().getApi();
  private memoryCache: Map<string, CacheEntry> = new Map();
  private static instance: CacheService;

  private constructor() {
    // Nettoyage périodique du cache mémoire
    setInterval(() => this.cleanupMemoryCache(), 60000);
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private cleanupMemoryCache() {
    const now = new Date();
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.expiresAt && entry.expiresAt < now) {
        this.memoryCache.delete(key);
      }
    }
  }

  // Opérations CRUD basiques
  async get<T>(key: string, options?: {
    level?: CacheLevel;
    fallback?: () => Promise<T>;
  }): Promise<T | null> {
    // Vérifier d'abord le cache mémoire
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key)!;
      if (!entry.expiresAt || entry.expiresAt > new Date()) {
        return entry.value as T;
      }
      this.memoryCache.delete(key);
    }

    try {
      const response = await this.api.get(`/cache/${encodeURIComponent(key)}`, {
        params: { level: options?.level }
      });
      const value = response.data.value;

      // Mettre en cache mémoire si approprié
      if (options?.level === 'memory' || !options?.level) {
        this.memoryCache.set(key, {
          key,
          value,
          level: 'memory',
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 300000) // 5 minutes par défaut
        });
      }

      return value as T;
    } catch (error) {
      if (options?.fallback) {
        const value = await options.fallback();
        await this.set(key, value, { level: options.level });
        return value;
      }
      return null;
    }
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    if (options?.level === 'memory' || !options?.level) {
      this.memoryCache.set(key, {
        key,
        value,
        level: 'memory',
        createdAt: new Date(),
        expiresAt: options?.ttl ? new Date(Date.now() + options.ttl) : undefined,
        tags: options?.tags
      });
    }

    await this.api.put(`/cache/${encodeURIComponent(key)}`, {
      value,
      options
    });
  }

  async delete(key: string, options?: { level?: CacheLevel }): Promise<void> {
    this.memoryCache.delete(key);
    await this.api.delete(`/cache/${encodeURIComponent(key)}`, {
      params: options
    });
  }

  // Opérations par lots
  async mget<T>(keys: string[], options?: {
    level?: CacheLevel;
  }): Promise<Array<T | null>> {
    const response = await this.api.post('/cache/mget', {
      keys,
      options
    });
    return response.data.values;
  }

  async mset(entries: Array<{ key: string; value: any }>, options?: CacheOptions): Promise<void> {
    await this.api.post('/cache/mset', {
      entries,
      options
    });
  }

  // Gestion des tags
  async deleteByTag(tag: string): Promise<void> {
    // Nettoyer le cache mémoire
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.tags?.includes(tag)) {
        this.memoryCache.delete(key);
      }
    }

    await this.api.delete(`/cache/tag/${encodeURIComponent(tag)}`);
  }

  async getByTag<T>(tag: string): Promise<Array<CacheEntry<T>>> {
    const response = await this.api.get(`/cache/tag/${encodeURIComponent(tag)}`);
    return response.data.entries;
  }

  // Gestion des versions
  async getVersion<T>(key: string, version: number): Promise<T | null> {
    const response = await this.api.get(`/cache/${encodeURIComponent(key)}/version/${version}`);
    return response.data.value;
  }

  async getAllVersions<T>(key: string): Promise<Array<CacheEntry<T>>> {
    const response = await this.api.get(`/cache/${encodeURIComponent(key)}/versions`);
    return response.data.versions;
  }

  // Statistiques et maintenance
  async getStats(options?: {
    level?: CacheLevel;
    tag?: string;
  }): Promise<{
    [key in CacheLevel]?: CacheStats;
  }> {
    const response = await this.api.get('/cache/stats', {
      params: options
    });
    return response.data;
  }

  async clear(options?: {
    level?: CacheLevel;
    olderThan?: Date;
  }): Promise<void> {
    if (!options?.level || options.level === 'memory') {
      this.memoryCache.clear();
    }
    await this.api.post('/cache/clear', options);
  }

  async optimize(): Promise<void> {
    await this.api.post('/cache/optimize');
  }

  // Utilitaires
  async remember<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>,
    options?: Omit<CacheOptions, 'ttl'>
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await callback();
    await this.set(key, value, { ...options, ttl });
    return value;
  }

  async tags(tags: string[]): CacheTagChain {
    return new CacheTagChain(this, tags);
  }
}

class CacheTagChain {
  constructor(
    private cache: CacheService,
    private currentTags: string[]
  ) {}

  async remember<T>(
    key: string,
    ttl: number,
    callback: () => Promise<T>,
    options?: Omit<CacheOptions, 'ttl' | 'tags'>
  ): Promise<T> {
    return this.cache.remember(key, ttl, callback, {
      ...options,
      tags: this.currentTags
    });
  }

  async flush(): Promise<void> {
    for (const tag of this.currentTags) {
      await this.cache.deleteByTag(tag);
    }
  }
}
