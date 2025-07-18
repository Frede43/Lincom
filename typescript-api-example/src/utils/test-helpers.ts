import { ApiService } from '../services/api';

export async function setupTestEnvironment() {
  const api = ApiService.getInstance().getApi();
  
  // Configure test environment
  api.defaults.baseURL = process.env.TEST_API_URL || 'http://localhost:8000';
  
  // Add test authentication token if needed
  if (process.env.TEST_AUTH_TOKEN) {
    api.defaults.headers.common['Authorization'] = `Bearer ${process.env.TEST_AUTH_TOKEN}`;
  }
}

export async function cleanupTestData() {
  const api = ApiService.getInstance().getApi();
  
  try {
    // Add any cleanup logic here
    await api.post('/test/cleanup');
  } catch (error) {
    console.error('Error cleaning up test data:', error);
  }
}

export function generateUniqueId() {
  return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function mockApiResponse(data: any) {
  return Promise.resolve({
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  });
}

export class TestError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public response?: any
  ) {
    super(message);
    this.name = 'TestError';
  }
}
