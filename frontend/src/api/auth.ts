import api from './client';
import { User, LoginForm, RegisterForm } from '../types';

interface AuthResponse {
  success: boolean;
  data: { token: string; user: User };
}

export const authApi = {
  register: async (data: RegisterForm): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginForm): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get<{ success: boolean; data: User }>('/auth/me');
    return res.data.data;
  },
};
