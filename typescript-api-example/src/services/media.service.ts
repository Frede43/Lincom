import { ApiService } from './api';

export type MediaType = 'image' | 'video' | 'audio' | 'document' | 'archive';

export interface MediaMetadata {
  filename: string;
  size: number;
  mimeType: string;
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number;
  thumbnails?: {
    small: string;
    medium: string;
    large: string;
  };
}

export interface MediaUploadOptions {
  type: MediaType;
  folder?: string;
  tags?: string[];
  description?: string;
  isPublic?: boolean;
  generateThumbnails?: boolean;
  optimizeForWeb?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface MediaTransformOptions {
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill';
  };
  rotate?: number;
  flip?: 'horizontal' | 'vertical';
  crop?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  format?: 'jpeg' | 'png' | 'webp' | 'gif';
  quality?: number;
  blur?: number;
  sharpen?: number;
  brightness?: number;
  contrast?: number;
  grayscale?: boolean;
}

export class MediaService {
  private api = ApiService.getInstance().getApi();

  // Upload de fichiers
  async upload(file: File, options?: MediaUploadOptions): Promise<{
    id: string;
    url: string;
    metadata: MediaMetadata;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await this.api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  async uploadMultiple(files: File[], options?: MediaUploadOptions): Promise<Array<{
    id: string;
    url: string;
    metadata: MediaMetadata;
  }>> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    if (options) {
      formData.append('options', JSON.stringify(options));
    }

    const response = await this.api.post('/media/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  // Gestion des fichiers
  async getMediaInfo(mediaId: string): Promise<{
    id: string;
    url: string;
    metadata: MediaMetadata;
    usage: {
      courses: number[];
      lessons: number[];
      quizzes: number[];
    };
  }> {
    const response = await this.api.get(`/media/${mediaId}`);
    return response.data;
  }

  async updateMediaInfo(mediaId: string, updates: {
    filename?: string;
    description?: string;
    tags?: string[];
    isPublic?: boolean;
  }): Promise<void> {
    await this.api.patch(`/media/${mediaId}`, updates);
  }

  async deleteMedia(mediaId: string): Promise<void> {
    await this.api.delete(`/media/${mediaId}`);
  }

  async moveMedia(mediaId: string, newFolder: string): Promise<void> {
    await this.api.post(`/media/${mediaId}/move`, { folder: newFolder });
  }

  // Transformation d'images
  async transformImage(mediaId: string, options: MediaTransformOptions): Promise<{
    id: string;
    url: string;
    metadata: MediaMetadata;
  }> {
    const response = await this.api.post(`/media/${mediaId}/transform`, options);
    return response.data;
  }

  // Gestion des dossiers
  async createFolder(path: string): Promise<void> {
    await this.api.post('/media/folders', { path });
  }

  async listFolder(path: string = '/'): Promise<{
    folders: string[];
    files: Array<{
      id: string;
      name: string;
      type: MediaType;
      size: number;
      modified: Date;
    }>;
  }> {
    const response = await this.api.get(`/media/folders?path=${encodeURIComponent(path)}`);
    return response.data;
  }

  async deleteFolder(path: string): Promise<void> {
    await this.api.delete(`/media/folders?path=${encodeURIComponent(path)}`);
  }

  // Recherche de médias
  async searchMedia(query: string, options?: {
    type?: MediaType[];
    folder?: string;
    tags?: string[];
    startDate?: Date;
    endDate?: Date;
    page?: number;
    limit?: number;
  }): Promise<{
    items: Array<{
      id: string;
      url: string;
      metadata: MediaMetadata;
    }>;
    total: number;
  }> {
    const response = await this.api.get('/media/search', { params: {
      q: query,
      ...options
    }});
    return response.data;
  }

  // Optimisation et traitement par lots
  async optimizeMedia(mediaIds: string[], options: {
    quality?: number;
    format?: string;
    maxWidth?: number;
    maxHeight?: number;
  }): Promise<void> {
    await this.api.post('/media/optimize', {
      mediaIds,
      options
    });
  }

  async generateThumbnails(mediaId: string, sizes: Array<{
    width: number;
    height: number;
    quality?: number;
  }>): Promise<{
    [key: string]: string;
  }> {
    const response = await this.api.post(`/media/${mediaId}/thumbnails`, { sizes });
    return response.data.thumbnails;
  }

  // Streaming et téléchargement
  getStreamUrl(mediaId: string, options?: {
    quality?: 'auto' | 'low' | 'medium' | 'high';
    format?: string;
  }): string {
    const params = new URLSearchParams(options).toString();
    return `${this.api.defaults.baseURL}/media/${mediaId}/stream?${params}`;
  }

  async getDownloadUrl(mediaId: string, options?: {
    filename?: string;
    expiresIn?: number;
  }): Promise<string> {
    const response = await this.api.get(`/media/${mediaId}/download-url`, {
      params: options
    });
    return response.data.url;
  }

  // Analyse de médias
  async analyzeMedia(mediaId: string): Promise<{
    contentType: string;
    fileFormat: string;
    colorProfile?: {
      dominant: string;
      palette: string[];
    };
    metadata: {
      exif?: any;
      iptc?: any;
    };
    contentAnalysis?: {
      labels: string[];
      objects: string[];
      text?: string;
      nsfw?: boolean;
    };
  }> {
    const response = await this.api.get(`/media/${mediaId}/analyze`);
    return response.data;
  }
}
