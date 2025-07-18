import { ApiService } from './api';
import { ValidationService } from '../utils/validation';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
  bio?: string;
  preferences?: UserPreferences;
  lastLogin?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  emailNotifications: boolean;
  language: string;
  theme: 'light' | 'dark';
  timezone: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'instructor' | 'student';
  avatar?: string;
  bio?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
  bio?: string;
  preferences?: Partial<UserPreferences>;
}

export class UserService {
  private api = ApiService.getInstance().getApi();
  private logger = console;

  async createUser(data: CreateUserDTO): Promise<User> {
    if (!ValidationService.validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    if (!ValidationService.validatePassword(data.password)) {
      throw new Error('Password must be at least 8 characters with letters and numbers');
    }
    const response = await this.api.post('/users', data);
    return response.data;
  }

  async getUserById(id: number): Promise<User | null> {
    const response = await this.api.get(`/users/${id}`);
    return response.data;
  }

  async updateUser(id: number, data: UpdateUserDTO): Promise<User | null> {
    if (data.email && !ValidationService.validateEmail(data.email)) {
      throw new Error('Invalid email format');
    }
    if (data.password && !ValidationService.validatePassword(data.password)) {
      throw new Error('Invalid password format');
    }
    const response = await this.api.put(`/users/${id}`, data);
    return response.data;
  }

  async deleteUser(id: number): Promise<boolean> {
    await this.api.delete(`/users/${id}`);
    return true;
  }

  async changePassword(id: number, currentPassword: string, newPassword: string): Promise<boolean> {
    if (!ValidationService.validatePassword(newPassword)) {
      throw new Error('New password must be at least 8 characters with letters and numbers');
    }
    const response = await this.api.post(`/users/${id}/change-password`, {
      currentPassword,
      newPassword
    });
    return response.data.success;
  }

  async resetPassword(email: string): Promise<boolean> {
    if (!ValidationService.validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    const response = await this.api.post('/users/reset-password', { email });
    return response.data.success;
  }

  async updatePreferences(id: number, preferences: Partial<UserPreferences>): Promise<User> {
    const response = await this.api.patch(`/users/${id}/preferences`, preferences);
    return response.data;
  }

  async uploadAvatar(id: number, file: File): Promise<string> {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await this.api.post(`/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.avatarUrl;
  }

  async getUserActivity(id: number): Promise<any[]> {
    const response = await this.api.get(`/users/${id}/activity`);
    return response.data;
  }

  async searchUsers(query: string, role?: string, page: number = 1, limit: number = 10): Promise<{ users: User[], total: number }> {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString()
    });
    if (role) params.append('role', role);
    
    const response = await this.api.get(`/users/search?${params.toString()}`);
    return response.data;
  }

  async verifyEmail(token: string): Promise<boolean> {
    const response = await this.api.post('/users/verify-email', { token });
    return response.data.success;
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.api.post(`/users/${id}/last-login`);
  }
}
