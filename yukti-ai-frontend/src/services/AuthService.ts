import API from '@utils/api';

export const AuthService = {
  async register(data: any) {
    const response = await API.post('/api/auth/register', data);
    return response.data;
  },

  async login(data: any) {
    const response = await API.post('/api/auth/login', data);
    return response.data;
  },

  async logout() {
    return API.post('/api/auth/logout');
  }
};
