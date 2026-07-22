import { useState } from 'react';
import { TemplateService } from '@services/TemplateService';
import toast from 'react-hot-toast';

export const useTemplate = () => {
  const [loading, setLoading] = useState(false);

  const downloadPdf = async (resumeJson: string, templateName: string, versionNumber: string | number) => {
    setLoading(true);
    try {
      const data = await TemplateService.downloadPdf(resumeJson, templateName);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_v${versionNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF download started.');
    } catch (e) {
      toast.error('Failed to generate PDF document.');
    } finally {
      setLoading(false);
    }
  };

  const downloadDocx = async (resumeJson: string, templateName: string, versionNumber: string | number) => {
    setLoading(true);
    try {
      const data = await TemplateService.downloadDocx(resumeJson, templateName);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_v${versionNumber}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Word document download started.');
    } catch (e) {
      toast.error('Failed to generate Word document.');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    downloadPdf,
    downloadDocx,
  };
};

export default useTemplate;
