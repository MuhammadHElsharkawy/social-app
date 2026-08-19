import { IUser } from '../../../core/interfaces/user.interface';

export interface RegisterREQ {
  name: string;
  username?: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  password: string;
  rePassword: string;
}

export interface LoginREQ {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

export interface AuthData {
  token: string;
  tokenType: string;
  expiresIn: string;
  user: IUser;
}
