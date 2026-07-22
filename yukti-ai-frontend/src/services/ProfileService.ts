import API from '@utils/api';

export const ProfileService = {
  async getProfile() {
    const response = await API.get('/api/profile');
    return response.data;
  },

  async updateProfile(data: {
    name?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
    location?: string;
    targetJobRole?: string;
    yearsOfExperience?: number;
  }) {
    const response = await API.put('/api/profile', data);
    return response.data;
  }
};
