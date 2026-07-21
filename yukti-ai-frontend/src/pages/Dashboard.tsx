import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../utils/api';
import {
  FiArrowRight,
  FiAward,
  FiClock,
  FiFileText,
  FiSliders,
  FiUploadCloud,
  FiLayers,
  FiBriefcase
} from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get('/api/history');
        setData(response.data);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const latestScore = data?.atsScores?.[0];
  const recentResume = data?.resumes?.[0];

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#B8860B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Candidate Portal</h1>
        <p className="text-slate-500 mt-1">
          Upload resumes, ethically optimize contents, and boost your ATS compliance instantly.
        </p>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Latest ATS Score Card */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-[#161512] p-6 rounded-3xl border border-[#B8860B]/15 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Latest ATS Score</span>
            <div className="p-2 bg-[#B8860B]/10 rounded-xl text-[#B8860B]">
              <FiAward size={20} />
            </div>
          </div>
          <div className="flex items-end space-x-3">
            <span className="text-5xl font-black tracking-tight text-[#B8860B]">
              {latestScore ? `${latestScore.overallScore}%` : 'N/A'}
            </span>
            <span className="text-slate-400 text-sm mb-1">overall match score</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <FiClock />
            <span>Last calculated {latestScore ? new Date(latestScore.createdAt).toLocaleDateString() : 'never'}</span>
          </div>
        </motion.div>

        {/* Uploaded Resumes Count */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-[#161512] p-6 rounded-3xl border border-[#B8860B]/15 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">Uploaded Resumes</span>
            <div className="p-2 bg-[#B8860B]/10 rounded-xl text-[#B8860B]">
              <FiFileText size={20} />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black tracking-tight">
              {data?.resumes?.length || 0}
            </span>
            <span className="text-slate-400 text-sm ml-2">documents</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <FiClock />
            <span>Recent file: {recentResume ? recentResume.originalFileName : 'None'}</span>
          </div>
        </motion.div>

        {/* Optimizations */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-[#161512] p-6 rounded-3xl border border-[#B8860B]/15 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">ATS Optimizations</span>
            <div className="p-2 bg-[#B8860B]/10 rounded-xl text-[#B8860B]">
              <FiSliders size={20} />
            </div>
          </div>
          <div>
            <span className="text-5xl font-black tracking-tight">
              {data?.optimizedResumes?.length || 0}
            </span>
            <span className="text-slate-400 text-sm ml-2">optimizations</span>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <FiClock />
            <span>Keep optimizing for target JDs to boost visibility</span>
          </div>
        </motion.div>
      </div>

      {/* Quick Action Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Link
            to="/upload"
            className="flex items-center justify-between p-5 bg-gradient-to-br from-[#B8860B] to-[#7A4E1D] text-white rounded-3xl hover:opacity-95 shadow-md shadow-[#B8860B]/10 hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <FiUploadCloud size={22} />
              </div>
              <div>
                <p className="font-semibold text-sm">Upload Resume</p>
                <p className="text-[10px] text-white/80">PDF/DOCX support</p>
              </div>
            </div>
            <FiArrowRight size={18} />
          </Link>

          <Link
            to="/optimize"
            className="flex items-center justify-between p-5 bg-gradient-to-br from-[#B8860B] to-[#7A4E1D] text-white rounded-3xl hover:opacity-95 shadow-md shadow-[#B8860B]/10 hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <FiSliders size={22} />
              </div>
              <div>
                <p className="font-semibold text-sm">Optimize ATS</p>
                <p className="text-[10px] text-white/80">Compare & verify skills</p>
              </div>
            </div>
            <FiArrowRight size={18} />
          </Link>

          <Link
            to="/future"
            className="flex items-center justify-between p-5 bg-gradient-to-br from-[#B8860B] to-[#7A4E1D] text-white rounded-3xl hover:opacity-95 shadow-md shadow-[#B8860B]/10 hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <FiLayers size={22} />
              </div>
              <div>
                <p className="font-semibold text-sm">AI Toolkit</p>
                <p className="text-[10px] text-white/80">V2 Cover letter/Questions</p>
              </div>
            </div>
            <FiArrowRight size={18} />
          </Link>

          <Link
            to="/profile"
            className="flex items-center justify-between p-5 bg-gradient-to-br from-[#161512] to-slate-900 border border-[#B8860B]/20 text-white rounded-3xl hover:opacity-95 shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-2xl">
                <FiBriefcase size={22} />
              </div>
              <div>
                <p className="font-semibold text-sm">Profile Details</p>
                <p className="text-[10px] text-white/80">Manage target roles</p>
              </div>
            </div>
            <FiArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* History table preview */}
      <div className="bg-white dark:bg-[#161512] border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight mb-4">Recent Resume Optimizations</h2>
        {data?.optimizedResumes?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3">Original File</th>
                  <th className="pb-3">Template</th>
                  <th className="pb-3">Optimization Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {data.optimizedResumes.slice(0, 5).map((opt: any) => (
                  <tr key={opt.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10">
                    <td className="py-4 font-medium text-slate-900 dark:text-white flex items-center space-x-2">
                      <FiFileText className="text-slate-400" />
                      <span>{opt.resume?.originalFileName}</span>
                    </td>
                    <td className="py-4">{opt.templateName}</td>
                    <td className="py-4">{new Date(opt.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 text-right">
                      <a
                        href={opt.cloudinaryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-[#B8860B] font-semibold hover:underline"
                      >
                        <span>Download PDF</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            No optimization records found. Upload a resume and paste a JD to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
