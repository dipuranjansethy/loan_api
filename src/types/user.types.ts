import { UserRole } from '../models/User';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserDTO;
  token: string;
}