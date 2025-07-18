# TypeScript API Example

This project demonstrates how to create a well-structured TypeScript application that interacts with a REST API using axios.

## Project Structure

```
typescript-api-example/
├── src/
│   ├── types/
│   │   └── user.ts         # Type definitions for User
│   ├── services/
│   │   ├── api.ts          # Base API service with axios configuration
│   │   └── user.service.ts # User-specific API methods
│   └── index.ts            # Main application entry point
├── package.json
└── tsconfig.json
```

## Features

- TypeScript with strict type checking
- Axios for HTTP requests
- API service with interceptors for authentication
- Error handling
- Type definitions for API requests and responses
- Singleton pattern for API service

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Run the example:
   ```bash
   npm start
   ```

## API Service Features

- Automatic token handling
- Request/response interceptors
- Error handling
- Type-safe requests and responses
- Centralized API configuration

## Usage Example

```typescript
import { UserService } from './services/user.service';

async function example() {
  const userService = new UserService();
  
  // Get all users
  const users = await userService.getUsers();
  
  // Create a new user
  const newUser = await userService.createUser({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  });
}
```
