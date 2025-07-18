import { setupTestEnvironment, cleanupTestData } from './test-helpers';

beforeAll(async () => {
  await setupTestEnvironment();
});

afterAll(async () => {
  await cleanupTestData();
});

// Increase timeout for integration tests
jest.setTimeout(30000);
