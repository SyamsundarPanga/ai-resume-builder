import { useState } from 'react';
import { ResumeService } from '@services/ResumeService';
import toast from 'react-hot-toast';

export const useResume = () => {
  const [loading, setLoading] = useState(false);

  const uploadResume = async (file: File) => {
    setLoading(true);
    try {
      const data = await ResumeService.upload(file);
      toast.success('Resume uploaded and parsed successfully.');
      return data;
    } catch (e: any) {
      const errorMsg = e.response?.data?.message || 'Failed to upload resume.';
      toast.error(errorMsg);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id: number) => {
    setLoading(true);
    try {
      await ResumeService.delete(id);
      toast.success('Resume deleted.');
    } catch (e) {
      toast.error('Failed to delete resume.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    uploadResume,
    deleteResume,
  };
};

export default useResume;
