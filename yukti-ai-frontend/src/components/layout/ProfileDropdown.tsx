import React, { useEffect, useState } from 'react';
import { useDropdown } from '@hooks/useDropdown';
import { useProfile } from '@hooks/useProfile';
import { useForm } from 'react-hook-form';
import { FiUser, FiPhone, FiCompass, FiBriefcase, FiGithub, FiLinkedin, FiGlobe, FiX } from 'react-icons/fi';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import useUnsavedChanges from '@hooks/useUnsavedChanges';
import RouteLeaveGuard from '../../guards/RouteLeaveGuard';

interface ProfileDropdownProps {
  onClose: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onClose }) => {
  const { profile, fetchProfile, updateProfile, loading } = useProfile();
  const dropdownRef = useDropdown(onClose);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, setValue, formState: { isDirty } } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      location: '',
      targetJobRole: '',
      yearsOfExperience: 0,
    }
  });

  // Unsaved changes hooks
  const { hasUnsavedChanges } = useUnsavedChanges(isDirty && isEditing);

  useEffect(() => {
    fetchProfile().then((data) => {
      if (data) {
        setValue('name', data.name || '');
        setValue('phone', data.phone || '');
        setValue('linkedin', data.linkedin || '');
        setValue('github', data.github || '');
        setValue('portfolio', data.portfolio || '');
        setValue('location', data.location || '');
        setValue('targetJobRole', data.targetJobRole || '');
        setValue('yearsOfExperience', data.yearsOfExperience || 0);
      }
    });
  }, [setValue]);

  const onSubmit = async (data: any) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
    } catch (e) {
      // toast is already fired inside useProfile
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#141311] border border-[#B8860B]/15 rounded-3xl shadow-xl z-50 p-6 text-left text-slate-800 dark:text-[#F7F4ED] max-h-[85vh] overflow-y-auto"
    >
      <RouteLeaveGuard when={hasUnsavedChanges} />
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-extrabold text-sm uppercase tracking-wider text-[#B8860B]">Profile Overview</h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
          <FiX size={16} />
        </button>
      </div>

      {loading && !profile ? (
        <div className="py-6 text-center text-xs text-slate-400">Loading details...</div>
      ) : isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input id="name" label="Full Name" {...register('name', { required: true })} />
          <Input id="phone" label="Phone" {...register('phone')} />
          <Input id="location" label="Location" {...register('location')} />
          <Input id="targetJobRole" label="Target Job Role" {...register('targetJobRole')} />
          <Input id="yearsOfExperience" label="Experience (Years)" type="number" step="0.5" {...register('yearsOfExperience')} />
          <Input id="linkedin" label="LinkedIn URL" {...register('linkedin')} />
          <Input id="github" label="GitHub URL" {...register('github')} />
          <Input id="portfolio" label="Portfolio URL" {...register('portfolio')} />
          
          <div className="flex space-x-2 pt-2">
            <Button size="sm" variant="ghost" type="button" className="flex-1" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit" className="flex-1">
              Save
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {/* Avatar and Header */}
          <div className="flex items-center space-x-3 pb-3 border-b border-[#B8860B]/10">
            <div className="w-12 h-12 rounded-2xl bg-[#B8860B]/10 flex items-center justify-center text-[#B8860B] font-bold text-lg border border-[#B8860B]/20">
              {profile?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="font-bold text-sm text-[#1A1A1A] dark:text-[#F7F4ED]">{profile?.name || 'User'}</p>
              <p className="text-[10px] text-slate-500">{profile?.email}</p>
            </div>
          </div>

          {/* Profile Completeness Metrics */}
          {(() => {
            const fieldsList = [
              { key: 'name', label: 'Name', weight: 15 },
              { key: 'phone', label: 'Phone', weight: 15 },
              { key: 'location', label: 'Location', weight: 15 },
              { key: 'targetJobRole', label: 'Target Job Role', weight: 15 },
              { key: 'yearsOfExperience', label: 'Years of Experience', weight: 10 },
              { key: 'linkedin', label: 'LinkedIn URL', weight: 10 },
              { key: 'github', label: 'GitHub URL', weight: 10 },
              { key: 'portfolio', label: 'Portfolio URL', weight: 10 }
            ];

            let completedWeight = 0;
            const missingLabels: string[] = [];

            fieldsList.forEach(f => {
              const val = profile ? (profile as any)[f.key] : null;
              if (val !== null && val !== undefined && val !== '' && val !== 0) {
                completedWeight += f.weight;
              } else {
                missingLabels.push(f.label);
              }
            });

            return (
              <div className="space-y-2 bg-[#B8860B]/5 border border-[#B8860B]/10 p-3 rounded-xl">
                <div className="flex justify-between items-center text-[10px] font-bold text-[#B8860B]">
                  <span>PROFILE COMPLETENESS</span>
                  <span>{completedWeight}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#B8860B] h-full transition-all duration-500" style={{ width: `${completedWeight}%` }} />
                </div>
                {missingLabels.length > 0 && (
                  <p className="text-[9px] text-slate-400">
                    Missing: {missingLabels.slice(0, 3).join(', ')}{missingLabels.length > 3 ? '...' : ''}
                  </p>
                )}
              </div>
            );
          })()}

          {/* Details list */}
          <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            {profile?.phone && (
              <div className="flex items-center space-x-2">
                <FiPhone className="text-slate-400 shrink-0" />
                <span>{profile.phone}</span>
              </div>
            )}
            {profile?.location && (
              <div className="flex items-center space-x-2">
                <FiCompass className="text-slate-400 shrink-0" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.targetJobRole && (
              <div className="flex items-center space-x-2">
                <FiBriefcase className="text-slate-400 shrink-0" />
                <span>{profile.targetJobRole}</span>
              </div>
            )}
            {profile?.yearsOfExperience !== undefined && (
              <div className="flex items-center space-x-2">
                <FiUser className="text-slate-400 shrink-0" />
                <span>{profile.yearsOfExperience} Years Experience</span>
              </div>
            )}
          </div>

          {/* Social icons */}
          <div className="flex space-x-3 pt-2 border-t border-[#B8860B]/10 justify-center">
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:text-[#B8860B] transition">
                <FiLinkedin size={16} />
              </a>
            )}
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:text-[#B8860B] transition">
                <FiGithub size={16} />
              </a>
            )}
            {profile?.portfolio && (
              <a href={profile.portfolio} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl hover:text-[#B8860B] transition">
                <FiGlobe size={16} />
              </a>
            )}
          </div>

          <Button size="sm" fullWidth onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
