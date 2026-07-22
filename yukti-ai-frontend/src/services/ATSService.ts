import API from '@utils/api';

export const ATSService = {
  async analyzeJobDescription(data: { title: string; description: string }) {
    const response = await API.post('/api/job-description/analyze', data);
    return response.data;
  },

  async matchResume(data: { resumeId: number; jobDescriptionId: number }) {
    const response = await API.post('/api/resume/match', data);
    return response.data;
  },

  async optimizeResume(data: {
    resumeId: number;
    jobDescriptionId: number;
    templateName: string;
    confirmedSkills: string[];
    additionalExperiences: Record<string, string>;
  }) {
    const response = await API.post('/api/resume/optimize', data);
    return response.data;
  }
};
