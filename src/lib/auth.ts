import api from './api';
import axios from 'axios';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  phone_number: string | null;
  is_active: boolean;
  created_at: string;
  last_login: string | null;
}

interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        if (errorData && typeof errorData === 'object' && 'message' in errorData) {
          throw new Error(String(errorData.message));
        }
      }
      // Default error message
      throw new Error('Đăng nhập không thành công. Vui lòng thử lại.');
    }
  },

  async getUserInfo(): Promise<User> {
    try {
      const response = await api.get<User>('/users/me');
      return response.data;
    } catch (error) {
      throw new Error('Không thể lấy thông tin người dùng.');
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};