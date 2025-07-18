export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  role?: 'admin' | 'user';
}
