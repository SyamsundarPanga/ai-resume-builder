import { useState } from 'react';
import { HistoryService } from '@services/HistoryService';
import toast from 'react-hot-toast';

export const useSettings = () => {
  const [loading, setLoading] = useState(false);

  const restoreVersion = async (versionId: number) => {
    setLoading(true);
    try {
      await HistoryService.restoreVersion(versionId);
      toast.success('Version restored as active resume successfully!');
    } catch (e) {
      toast.error('Failed to restore version.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const deleteVersion = async (versionId: number) => {
    setLoading(true);
    try {
      await HistoryService.deleteVersion(versionId);
      toast.success('Version deleted.');
    } catch (e) {
      toast.error('Failed to delete version.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    restoreVersion,
    deleteVersion,
  };
};

export default useSettings;
