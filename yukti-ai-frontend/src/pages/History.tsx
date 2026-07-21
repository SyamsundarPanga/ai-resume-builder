import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiAward,
  FiDownloadCloud,
  FiFileText,
  FiSliders,
  FiTrash2,
  FiRefreshCw
} from 'react-icons/fi';

const History: React.FC = () => {
  const [history, setHistory] = useState<any>(null);
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await API.get('/api/history');
      setHistory(response.data);
      if (response.data.resumes?.length > 0 && selectedResumeId === null) {
        setSelectedResumeId(response.data.resumes[0].id);
      }
    } catch (error) {
      console.error('Failed to load history', error);
      toast.error('Failed to load history records.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVersions = async (resumeId: number) => {
    try {
      const response = await API.get(`/api/resume/history/${resumeId}`);
      setVersions(response.data);
    } catch (error) {
      console.error('Failed to fetch versions', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (selectedResumeId !== null) {
      fetchVersions(selectedResumeId);
    }
  }, [selectedResumeId]);

  const handleDeleteResume = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this resume? This deletes all associated parsed data and optimized versions.')) {
      return;
    }
    try {
      await API.delete(`/api/resumes/${id}`);
      toast.success('Resume deleted successfully.');
      setSelectedResumeId(null);
      fetchHistory();
    } catch (error) {
      console.error(error);
      toast.error('Delete action failed.');
    }
  };

  const handleRestoreVersion = async (versionId: number) => {
    try {
      await API.post(`/api/resume/version/restore/${versionId}`);
      toast.success('Version restored as active resume successfully!');
      fetchHistory();
    } catch (e) {
      toast.error('Failed to restore version.');
    }
  };

  const handleDeleteVersion = async (versionId: number) => {
    if (!window.confirm('Are you sure you want to delete this version?')) {
      return;
    }
    try {
      await API.delete(`/api/resume/version/${versionId}`);
      toast.success('Version deleted.');
      if (selectedResumeId) fetchVersions(selectedResumeId);
    } catch (e) {
      toast.error('Failed to delete version.');
    }
  };

  const handleDownloadDocx = async (version: any) => {
    try {
      const response = await API.post('/api/resume/download/docx', {
        resumeJson: version.optimizedJson,
        templateName: version.templateName
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_v${version.versionNumber}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      toast.error('Failed to generate Word document.');
    }
  };

  const handleDownloadPdf = async (version: any) => {
    try {
      const response = await API.post('/api/resume/download/pdf', {
        resumeJson: version.optimizedJson,
        templateName: version.templateName
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume_v${version.versionNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      toast.error('Failed to generate PDF document.');
    }
  };

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#B8860B]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">History & Versions</h1>
        <p className="text-slate-500 mt-1">
          Access historical versions, restore active states, and download files in PDF or DOCX formats.
        </p>
      </div>

      {/* Select Resume contextual tab */}
      {history?.resumes?.length > 0 && (
        <div className="flex space-x-3 bg-white dark:bg-[#161512] p-2 rounded-2xl border border-[#B8860B]/10 w-fit">
          {history.resumes.map((r: any) => (
            <button
              key={r.id}
              onClick={() => setSelectedResumeId(r.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedResumeId === r.id
                  ? 'bg-gradient-to-r from-[#B8860B] to-[#7A4E1D] text-white'
                  : 'text-slate-500 hover:text-[#B8860B]'
              }`}
            >
              {r.originalFileName}
            </button>
          ))}
        </div>
      )}

      {/* Version Logs for selected resume */}
      {selectedResumeId !== null && (
        <div className="bg-white dark:bg-[#161512] border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center space-x-2">
            <FiSliders className="text-[#B8860B]" />
            <span>Optimization Versions Log</span>
          </h2>
          {versions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="pb-3">Version</th>
                    <th className="pb-3">Template</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {versions.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10">
                      <td className="py-4 font-bold text-slate-900 dark:text-white">v{v.versionNumber}</td>
                      <td className="py-4">{v.templateName}</td>
                      <td className="py-4">{new Date(v.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 text-right flex justify-end space-x-2">
                        <button
                          onClick={() => handleDownloadPdf(v)}
                          className="px-3 py-1.5 border border-[#B8860B]/20 text-[#B8860B] text-xs font-bold rounded-lg hover:bg-[#B8860B]/5 transition flex items-center space-x-1"
                        >
                          <FiDownloadCloud />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => handleDownloadDocx(v)}
                          className="px-3 py-1.5 border border-[#B8860B]/20 text-[#B8860B] text-xs font-bold rounded-lg hover:bg-[#B8860B]/5 transition flex items-center space-x-1"
                        >
                          <FiDownloadCloud />
                          <span>DOCX</span>
                        </button>
                        <button
                          onClick={() => handleRestoreVersion(v.id)}
                          className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition"
                          title="Restore version as active resume"
                        >
                          <FiRefreshCw size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteVersion(v.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition"
                          title="Delete Version"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-6 text-sm">No historical version states for this resume.</p>
          )}
        </div>
      )}

      {/* Uploaded Resumes */}
      <div className="bg-white dark:bg-[#161512] border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center space-x-2">
          <FiFileText className="text-[#B8860B]" />
          <span>Uploaded Resumes</span>
        </h2>
        {history?.resumes?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3">File Name</th>
                  <th className="pb-3">Format</th>
                  <th className="pb-3">Uploaded On</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {history.resumes.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10">
                    <td className="py-4 font-semibold text-slate-900 dark:text-white">{r.originalFileName}</td>
                    <td className="py-4">{r.fileType}</td>
                    <td className="py-4">{new Date(r.uploadedAt).toLocaleDateString()}</td>
                    <td className="py-4 text-right flex justify-end space-x-3">
                      <a
                        href={r.cloudinaryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 text-indigo-500 hover:bg-[#B8860B]/10 rounded-xl transition"
                        title="Download Original"
                      >
                        <FiDownloadCloud size={18} />
                      </a>
                      <button
                        onClick={() => handleDeleteResume(r.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition"
                        title="Delete Resume"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-500 py-6 text-sm">No uploaded resumes found.</p>
        )}
      </div>

      {/* ATS Scores */}
      <div className="bg-white dark:bg-[#161512] border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center space-x-2">
          <FiAward className="text-[#B8860B]" />
          <span>ATS Scores Evaluation Log</span>
        </h2>
        {history?.atsScores?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="pb-3">Job Description</th>
                  <th className="pb-3">Overall</th>
                  <th className="pb-3">Skills</th>
                  <th className="pb-3">Experience</th>
                  <th className="pb-3">Projects</th>
                  <th className="pb-3">Formatting</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {history.atsScores.map((score: any) => (
                  <tr key={score.id} className="hover:bg-slate-50/20 dark:hover:bg-slate-800/10">
                    <td className="py-4 font-semibold text-slate-900 dark:text-white">
                      {score.jobDescription?.title}
                    </td>
                    <td className="py-4 text-[#B8860B] font-bold">{score.overallScore}%</td>
                    <td className="py-4">{score.skillsScore}%</td>
                    <td className="py-4">{score.experienceScore}%</td>
                    <td className="py-4">{score.projectsScore}%</td>
                    <td className="py-4">{score.formattingScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-slate-500 py-6 text-sm">No scores logs computed.</p>
        )}
      </div>
    </div>
  );
};

export default History;
