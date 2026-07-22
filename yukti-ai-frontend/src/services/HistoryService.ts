import API from '@utils/api';

export const HistoryService = {
  async getVersions(resumeId: number) {
    const response = await API.get(`/api/resume/history/${resumeId}`);
    return response.data;
  },

  async restoreVersion(versionId: number) {
    const response = await API.post(`/api/resume/version/restore/${versionId}`);
    return response.data;
  },

  async deleteVersion(versionId: number) {
    const response = await API.delete(`/api/resume/version/${versionId}`);
    return response.data;
  },

  async getAuditHistory() {
    const response = await API.get('/api/history');
    return response.data;
  }
};
