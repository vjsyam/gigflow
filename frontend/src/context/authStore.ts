import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const storedUser = localStorage.getItem('gf_user');
const storedToken = localStorage.getItem('gf_token');

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token: storedToken || null,
  isAuthenticated: !!storedToken,

  setAuth: (user: User, token: string) => {
    localStorage.setItem('gf_token', token);
    localStorage.setItem('gf_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('gf_token');
    localStorage.removeItem('gf_user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
