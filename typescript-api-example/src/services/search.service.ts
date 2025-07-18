import { ApiService } from './api';

export interface SearchResult {
  id: number;
  type: 'course' | 'lesson' | 'quiz' | 'user' | 'resource';
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  highlights: string[];
  relevanceScore: number;
  metadata: {
    [key: string]: any;
  };
}

export interface SearchFilters {
  type?: ('course' | 'lesson' | 'quiz' | 'user' | 'resource')[];
  category?: string[];
  level?: ('beginner' | 'intermediate' | 'advanced')[];
  duration?: {
    min?: number;
    max?: number;
  };
  rating?: number;
  price?: {
    min?: number;
    max?: number;
  };
  language?: string[];
  date?: {
    start?: Date;
    end?: Date;
  };
  tags?: string[];
}

export interface SearchSuggestion {
  text: string;
  type: string;
  frequency: number;
}

export class SearchService {
  private api = ApiService.getInstance().getApi();

  async search(query: string, filters?: SearchFilters, page: number = 1, limit: number = 20): Promise<{
    results: SearchResult[];
    total: number;
    suggestions: string[];
    facets: {
      types: { [key: string]: number };
      categories: { [key: string]: number };
      levels: { [key: string]: number };
      tags: { [key: string]: number };
    };
  }> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...filters && { filters: JSON.stringify(filters) }
    });

    const response = await this.api.get(`/search?${params.toString()}`);
    return response.data;
  }

  async getAutocompleteSuggestions(query: string): Promise<string[]> {
    const response = await this.api.get(`/search/autocomplete?q=${query}`);
    return response.data.suggestions;
  }

  async getPopularSearches(): Promise<SearchSuggestion[]> {
    const response = await this.api.get('/search/popular');
    return response.data;
  }

  async getRelatedSearches(query: string): Promise<string[]> {
    const response = await this.api.get(`/search/related?q=${query}`);
    return response.data.related;
  }

  async searchByImage(image: File): Promise<SearchResult[]> {
    const formData = new FormData();
    formData.append('image', image);

    const response = await this.api.post('/search/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.results;
  }

  async searchByVoice(audioBlob: Blob): Promise<{
    query: string;
    results: SearchResult[];
  }> {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await this.api.post('/search/voice', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async saveSearch(query: string, filters?: SearchFilters): Promise<void> {
    await this.api.post('/search/save', { query, filters });
  }

  async getSavedSearches(): Promise<Array<{
    id: number;
    query: string;
    filters?: SearchFilters;
    lastRun: Date;
    resultCount: number;
  }>> {
    const response = await this.api.get('/search/saved');
    return response.data;
  }

  async deleteSavedSearch(id: number): Promise<void> {
    await this.api.delete(`/search/saved/${id}`);
  }

  async getSearchHistory(): Promise<Array<{
    query: string;
    timestamp: Date;
    resultCount: number;
  }>> {
    const response = await this.api.get('/search/history');
    return response.data;
  }

  async clearSearchHistory(): Promise<void> {
    await this.api.delete('/search/history');
  }

  async exportSearchResults(query: string, filters?: SearchFilters, format: 'csv' | 'pdf' = 'csv'): Promise<string> {
    const params = new URLSearchParams({
      q: query,
      format,
      ...filters && { filters: JSON.stringify(filters) }
    });

    const response = await this.api.get(`/search/export?${params.toString()}`);
    return response.data.exportUrl;
  }

  // Recherche avancée avec agrégations
  async advancedSearch(options: {
    query: string;
    filters?: SearchFilters;
    aggregations?: {
      fields: string[];
      type: 'terms' | 'range' | 'date_histogram';
      interval?: string;
    }[];
    page?: number;
    limit?: number;
  }): Promise<{
    results: SearchResult[];
    total: number;
    aggregations: { [key: string]: any };
  }> {
    const response = await this.api.post('/search/advanced', options);
    return response.data;
  }

  // Recherche sémantique
  async semanticSearch(query: string, options?: {
    threshold?: number;
    contextSize?: number;
    filters?: SearchFilters;
  }): Promise<{
    results: SearchResult[];
    concepts: { [key: string]: number };
  }> {
    const response = await this.api.post('/search/semantic', {
      query,
      ...options
    });
    return response.data;
  }
}
