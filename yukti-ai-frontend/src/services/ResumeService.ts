import API from '@utils/api';

export const ResumeService = {
  async upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await API.post('/api/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getAll() {
    const response = await API.get('/api/resumes');
    return response.data;
  },

  async delete(id: number) {
    const response = await API.delete(`/api/resumes/${id}`);
    return response.data;
  }
};
