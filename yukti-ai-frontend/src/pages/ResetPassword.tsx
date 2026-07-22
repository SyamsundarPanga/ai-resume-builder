import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import Button from '@components/common/Button';
import Input from '@components/common/Input';

interface ResetForm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ResetForm>({
    defaultValues: {
      token: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setValue('token', token);
    }
  }, [searchParams, setValue]);

  const newPasswordVal = watch('newPassword');

  const onSubmit = async (data: ResetForm) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
        token: data.token,
        newPassword: data.newPassword
      });
      toast.success(response.data.message || 'Password reset successfully.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to reset password.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] dark:bg-[#0A0A09] text-[#1A1A1A] dark:text-[#F7F4ED] flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white dark:bg-[#141311] border border-[#B8860B]/15 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mx-auto">
            <FiCheckCircle size={20} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Set New Password</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Input the recovery token and specify your new account password credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            id="token"
            label="Recovery Token"
            type="text"
            placeholder="Paste your reset token here"
            error={errors.token?.message}
            {...register('token', { required: 'Token is required' })}
          />

          <Input
            id="newPassword"
            label="New Password"
            type="password"
            placeholder="••••••••"
            error={errors.newPassword?.message}
            {...register('newPassword', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (val) => val === newPasswordVal || 'Passwords do not match'
            })}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Resetting...' : 'Change Password'}
          </Button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <Link to="/login" className="inline-flex items-center space-x-2 text-xs text-[#B8860B] font-bold hover:underline">
            <FiArrowLeft />
            <span>Back to Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
