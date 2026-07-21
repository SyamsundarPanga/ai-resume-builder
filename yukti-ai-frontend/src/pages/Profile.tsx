import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import API from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiUser } from 'react-icons/fi';

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      location: '',
      targetJobRole: '',
      yearsOfExperience: 0,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get('/api/profile');
        const p = response.data;
        setValue('name', p.name || '');
        setValue('email', p.email || '');
        setValue('phone', p.phone || '');
        setValue('linkedin', p.linkedin || '');
        setValue('github', p.github || '');
        setValue('portfolio', p.portfolio || '');
        setValue('location', p.location || '');
        setValue('targetJobRole', p.targetJobRole || '');
        setValue('yearsOfExperience', p.yearsOfExperience || 0);
      } catch (error) {
        console.error('Failed to load profile', error);
        toast.error('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data: any) => {
    setSaving(true);
    try {
      await API.put('/api/profile', data);
      toast.success('Profile details saved successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save profile changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidate Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Provide your target career information and professional social links.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-bold text-2xl border border-indigo-500/20">
            <FiUser />
          </div>
          <div>
            <h2 className="text-lg font-bold">Personal & Professional Info</h2>
            <p className="text-xs text-slate-500">This helps align the matching engines metrics.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Full Name</label>
            <input
              type="text"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
              placeholder="Your Name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              disabled
              className="w-full bg-slate-100 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
              placeholder="email@example.com"
              {...register('email')}
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Phone Number</label>
            <input
              type="text"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
              placeholder="+1-234-567-890"
              {...register('phone')}
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Location</label>
            <input
              type="text"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
              placeholder="San Francisco, CA"
              {...register('location')}
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Target Job Role</label>
            <input
              type="text"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
              placeholder="Staff Software Engineer"
              {...register('targetJobRole')}
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Years of Experience</label>
            <input
              type="number"
              step="0.5"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
              placeholder="5"
              {...register('yearsOfExperience')}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-6">
          <h3 className="font-bold text-base">Links & Portfolio</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">LinkedIn URL</label>
              <input
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
                placeholder="https://linkedin.com/in/username"
                {...register('linkedin')}
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">GitHub URL</label>
              <input
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
                placeholder="https://github.com/username"
                {...register('github')}
              />
            </div>
            <div>
              <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Portfolio Website</label>
              <input
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition"
                placeholder="https://portfolio.com"
                {...register('portfolio')}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm disabled:opacity-50"
        >
          {saving ? 'Saving changes...' : 'Save Profile Details'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
