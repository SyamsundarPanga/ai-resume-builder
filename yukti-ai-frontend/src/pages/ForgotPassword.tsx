import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import Button from '@components/common/Button';
import Input from '@components/common/Input';

interface ForgotForm {
  email: string;
}

export const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotForm>();

  const onSubmit = async (data: ForgotForm) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', data);
      toast.success(response.data.message || 'Password reset token generated.');
      if (response.data.token) {
        setResetToken(response.data.token);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to request reset token.';
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
          <div className="w-12 h-12 rounded-2xl bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center text-[#B8860B] mx-auto">
            <FiLock size={20} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Forgot Password</h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Enter your candidate email address to request a secure password recovery token.
          </p>
        </div>

        {resetToken ? (
          <div className="space-y-4 bg-[#B8860B]/5 border border-[#B8860B]/15 p-4 rounded-xl text-center text-xs">
            <p className="font-bold text-[#B8860B]">Recovery Token Generated (Simulated)</p>
            <p className="text-[10px] text-slate-500 break-all select-all font-mono py-1.5 px-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
              {resetToken}
            </p>
            <p className="text-[10px] text-slate-400">
              Copy this token and use the link below to set your new password.
            </p>
            <Link
              to={`/reset-password?token=${resetToken}`}
              className="block w-full py-2 bg-[#B8860B] text-white rounded-lg font-bold text-xs hover:bg-[#7A4E1D] transition"
            >
              Reset My Password
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="candidate@example.com"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Requesting...' : 'Send Recovery Token'}
            </Button>
          </form>
        )}

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

export default ForgotPassword;
