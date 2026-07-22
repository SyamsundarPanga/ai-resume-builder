import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', data);
      const { token, refreshToken, id, email, name } = response.data;
      login(token, refreshToken, { id, email, name });
      toast.success('Successfully logged in!');
      setTimeout(() => navigate('/'), 800);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Login failed. Verify credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
      <Toaster position="top-right" />
      {/* Background gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-4">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Y</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white">Welcome back</h2>
          <p className="text-slate-400 mt-2 text-sm">Optimize your resume using Google Gemini AI</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600 text-sm"
              placeholder="name@domain.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600 text-sm"
              placeholder="••••••••"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span className="text-red-500 text-xs mt-1 block">{errors.password.message}</span>}
            <div className="text-right mt-1.5">
              <Link to="/forgot-password" className="text-xs text-indigo-400 font-semibold hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-500/20 text-sm disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
