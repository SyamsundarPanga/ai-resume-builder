import { useState } from 'react';
import { ProfileService } from '@services/ProfileService';
import toast from 'react-hot-toast';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await ProfileService.getProfile();
      setProfile(data);
      return data;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: any) => {
    setLoading(true);
    try {
      const updated = await ProfileService.updateProfile(data);
      setProfile(updated);
      toast.success('Profile updated successfully.');
      return updated;
    } catch (e) {
      toast.error('Failed to update profile.');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    profile,
    fetchProfile,
    updateProfile,
  };
};

export default useProfile;
