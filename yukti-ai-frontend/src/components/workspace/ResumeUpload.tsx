import React, { useState } from 'react';
import { useWorkspace } from '@contexts/WorkspaceContext';
import { useResume } from '@hooks/useResume';
import Card from '@components/common/Card';
import Loader from '@components/common/Loader';
import { FiUploadCloud, FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const ResumeUpload: React.FC = () => {
  const { resumes, setResumes, activeResumeId, setActiveResumeId } = useWorkspace();
  const { uploadResume, loading } = useResume();
  const [file, setFile] = useState<File | null>(null);

  const validateAndSetFile = (selectedFile: File) => {
    const allowed = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(selectedFile.type)) {
      toast.error('Only PDF or DOCX file formats are allowed.');
      return;
    }
    setFile(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSetFile(dropped);
  };

  const executeUpload = async () => {
    if (!file) return;
    try {
      const data = await uploadResume(file);
      // Update resumes list
      setResumes((prev) => [data, ...prev]);
      setActiveResumeId(data.id.toString());
      setFile(null);
    } catch (e) {
      // toast notification already displayed by useResume hook
    }
  };

  return (
    <Card className="text-left space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-[#F7F4ED] flex items-center space-x-2">
          <FiUploadCloud className="text-[#B8860B]" />
          <span>Upload Resume</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Upload your base resume in PDF or DOCX format to analyze matches.
        </p>
      </div>

      {/* Select active resume dropdown if user has uploaded resumes */}
      {resumes.length > 0 && (
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Resume Selected
          </label>
          <select
            value={activeResumeId}
            onChange={(e) => setActiveResumeId(e.target.value)}
            className="w-full px-4 py-3 bg-white dark:bg-[#1A1916] border border-[#B8860B]/15 dark:border-[#B8860B]/30 rounded-xl focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] focus:outline-none transition text-sm"
          >
            {resumes.map((r) => (
              <option key={r.id} value={r.id.toString()}>
                {r.originalFileName} (Uploaded {new Date(r.uploadedAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-[#B8860B]/20 rounded-2xl p-8 text-center hover:border-[#B8860B]/50 transition cursor-pointer flex flex-col items-center justify-center space-y-3 bg-[#F7F4ED]/20 dark:bg-slate-900/10"
      >
        <input
          type="file"
          id="resumeFile"
          accept=".pdf,.docx"
          onChange={handleFileChange}
          className="hidden"
        />
        <label htmlFor="resumeFile" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
          <FiUploadCloud size={40} className="text-[#B8860B]" />
          <span className="text-sm font-semibold">
            {file ? file.name : 'Drag & drop your resume file or click to browse'}
          </span>
          <span className="text-[10px] text-slate-400">PDF, DOCX formats supported</span>
        </label>
      </div>

      {file && (
        <div className="flex items-center justify-between p-3 bg-[#B8860B]/5 border border-[#B8860B]/10 rounded-xl">
          <div className="flex items-center space-x-2 text-xs">
            <FiFileText className="text-[#B8860B]" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{file.name}</span>
          </div>
          <button
            onClick={executeUpload}
            disabled={loading}
            className="px-4 py-2 bg-[#B8860B] hover:bg-[#7A4E1D] text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
          >
            {loading ? <Loader variant="spinner" className="h-4 w-4 p-0 border-white" /> : 'Upload & Parse'}
          </button>
        </div>
      )}
    </Card>
  );
};

export default ResumeUpload;
