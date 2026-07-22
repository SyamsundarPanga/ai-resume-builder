import API from '@utils/api';

export const TemplateService = {
  async downloadPdf(resumeJson: string, templateName: string) {
    const response = await API.post('/api/resume/download/pdf', {
      resumeJson,
      templateName
    }, { responseType: 'blob' });
    return response.data;
  },

  async downloadDocx(resumeJson: string, templateName: string) {
    const response = await API.post('/api/resume/download/docx', {
      resumeJson,
      templateName
    }, { responseType: 'blob' });
    return response.data;
  }
};
