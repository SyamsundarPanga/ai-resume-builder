import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { FiAlertCircle, FiFileText, FiUploadCloud } from 'react-icons/fi';

const UploadResume: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      validateAndSetFile(selected);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx') {
      toast.error('Only PDF and DOCX documents are supported.');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('Maximum file size is 10MB.');
      return;
    }
    setFile(selectedFile);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await API.post('/api/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Resume uploaded and parsed successfully!');
      setTimeout(() => {
        navigate('/optimize', { state: { resumeId: response.data.id } });
      }, 1000);
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || 'Error occurred while uploading.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Resume</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Upload your existing resume. Our parser will extract structures into a candidate profile.
        </p>
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
          file
            ? 'border-indigo-500 bg-indigo-500/5 dark:bg-indigo-500/10'
            : 'border-slate-300 dark:border-slate-800 hover:border-indigo-400'
        }`}
      >
        {file ? (
          <div className="space-y-4">
            <div className="inline-flex p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <FiFileText size={40} />
            </div>
            <div>
              <p className="font-bold text-lg">{file.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setFile(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm font-semibold"
              >
                Clear File
              </button>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer space-y-4 block">
            <div className="inline-flex p-4 bg-indigo-500/10 text-indigo-500 rounded-2xl">
              <FiUploadCloud size={40} />
            </div>
            <div>
              <p className="font-bold text-lg">Drag & Drop file here</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                or click to browse your local device
              </p>
            </div>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Constraints info alerts */}
      <div className="flex items-start space-x-3 p-4 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-2xl">
        <FiAlertCircle className="text-indigo-500 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-bold text-slate-700 dark:text-slate-300">File Requirement Rules:</p>
          <p>• Supported extensions: PDF and DOCX only.</p>
          <p>• Max File Size limit: 10 MB.</p>
          <p>• Make sure the document is not password-protected.</p>
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm disabled:opacity-40 disabled:pointer-events-none"
      >
        {loading ? (
          <span className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Uploading & Parsing with Gemini AI...</span>
          </span>
        ) : (
          'Upload & Parse Resume'
        )}
      </button>
    </div>
  );
};

export default UploadResume;
