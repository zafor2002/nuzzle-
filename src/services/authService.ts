import { apiClient } from './apiClient';
import type { UserRole } from '../types';

export interface SignupPayload {
  email: string;
  password: string;
  username: string;
  displayName: string;
  role?: UserRole;
  storeCategory?: string;
  clinicName?: string;
}

export interface LoginPayload {
  email?: string;
  password?: string;
  role?: UserRole;
}

export const authService = {
  async signup(payload: SignupPayload) {
    const res = await apiClient.post('/auth/signup', payload);
    if (res.success && res.data?.token) {
      apiClient.setToken(res.data.token);
    }
    return res;
  },

  async login(payload: LoginPayload) {
    const res = await apiClient.post('/auth/login', payload);
    if (res.success && res.data?.token) {
      apiClient.setToken(res.data.token);
    }
    return res;
  },

  async getCurrentUser() {
    return apiClient.get('/auth/me');
  },

  logout() {
    apiClient.setToken(null);
  },
};
