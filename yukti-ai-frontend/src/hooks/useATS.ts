import { useState } from 'react';
import { ATSService } from '@services/ATSService';
import toast from 'react-hot-toast';

export const useATS = () => {
  const [loading, setLoading] = useState(false);

  const analyzeJD = async (title: string, description: string) => {
    setLoading(true);
    try {
      const data = await ATSService.analyzeJobDescription({ title, description });
      return data;
    } catch (e: any) {
      toast.error('Failed to parse Job Description details.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const matchResume = async (resumeId: number, jobDescriptionId: number) => {
    setLoading(true);
    try {
      const data = await ATSService.matchResume({ resumeId, jobDescriptionId });
      return data;
    } catch (e) {
      toast.error('Failed to perform ATS matching comparison.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const optimizeResume = async (payload: {
    resumeId: number;
    jobDescriptionId: number;
    templateName: string;
    confirmedSkills: string[];
    additionalExperiences: Record<string, string>;
  }) => {
    setLoading(true);
    try {
      const data = await ATSService.optimizeResume(payload);
      toast.success('Resume optimized successfully!');
      return data;
    } catch (e) {
      toast.error('Failed to perform AI optimization.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    analyzeJD,
    matchResume,
    optimizeResume,
  };
};

export default useATS;
