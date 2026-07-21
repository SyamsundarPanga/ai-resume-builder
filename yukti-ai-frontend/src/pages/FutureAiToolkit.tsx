import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiBookOpen,
  FiFileText,
  FiHelpCircle,
  FiLinkedin,
  FiTrendingUp,
  FiLayers
} from 'react-icons/fi';

const FutureAiToolkit: React.FC = () => {
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [jdText, setJdText] = useState('');
  const [activeTab, setActiveTab] = useState<'cover' | 'linkedin' | 'questions' | 'skillgap'>('cover');
  const [loading, setLoading] = useState(false);

  // Outputs
  const [coverLetter, setCoverLetter] = useState('');
  const [linkedinSummary, setLinkedinSummary] = useState('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [skillGap, setSkillGap] = useState<any>(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await API.get('/api/resumes');
        setResumes(response.data);
        if (response.data.length > 0) {
          setSelectedResumeId(response.data[0].id.toString());
        }
      } catch (error) {
        console.error('Failed to fetch resumes', error);
      }
    };
    fetchResumes();
  }, []);

  const handleGenerateCoverLetter = async () => {
    if (!selectedResumeId || !jdText.trim()) {
      toast.error('Select a resume and paste target Job Description.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/api/future/cover-letter', {
        resumeId: selectedResumeId,
        jdText
      });
      setCoverLetter(res.data.content);
      toast.success('Cover letter generated!');
    } catch (e) {
      toast.error('Failed to generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLinkedIn = async () => {
    if (!selectedResumeId) {
      toast.error('Select a resume first.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/api/future/linkedin-summary', {
        resumeId: selectedResumeId
      });
      setLinkedinSummary(res.data.content);
      toast.success('LinkedIn summary generated!');
    } catch (e) {
      toast.error('Failed to generate LinkedIn summary.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!selectedResumeId || !jdText.trim()) {
      toast.error('Select a resume and paste target Job Description.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/api/future/interview-questions', {
        resumeId: selectedResumeId,
        jdText
      });
      setQuestions(JSON.parse(res.data.questionsJson));
      toast.success('Interview practice questions generated!');
    } catch (e) {
      toast.error('Failed to generate questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillGap = async () => {
    if (!selectedResumeId || !jdText.trim()) {
      toast.error('Select a resume and paste target Job Description.');
      return;
    }
    setLoading(true);
    try {
      const res = await API.post('/api/future/skill-gap', {
        resumeId: selectedResumeId,
        jdText
      });
      setSkillGap(JSON.parse(res.data.reportJson));
      toast.success('Skill Gap Analysis completed!');
    } catch (e) {
      toast.error('Failed to analyze skill gap.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Extensions Toolkit</h1>
        <p className="text-slate-500 mt-1">
          Access advanced personalized AI workflows tailored directly to your resume details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Control Card */}
        <div className="bg-white dark:bg-[#161512] border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm space-y-5 h-fit">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
            <FiLayers className="text-[#B8860B]" />
            <span>Setup Context</span>
          </h2>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Select Active Resume</label>
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full bg-[#F7F4ED]/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B8860B] transition"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.originalFileName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 text-sm font-semibold mb-2">Target Job Details (optional for LinkedIn)</label>
            <textarea
              rows={5}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="w-full bg-[#F7F4ED]/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B8860B] transition"
              placeholder="Paste job details or required technical stacks to customize results..."
            />
          </div>
        </div>

        {/* Right Dashboard Workspace */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Selector */}
          <div className="flex border-b border-[#B8860B]/15 space-x-6 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('cover')}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
                activeTab === 'cover'
                  ? 'border-[#B8860B] text-[#B8860B]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiFileText />
              <span>AI Cover Letter</span>
            </button>

            <button
              onClick={() => setActiveTab('linkedin')}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
                activeTab === 'linkedin'
                  ? 'border-[#B8860B] text-[#B8860B]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiLinkedin />
              <span>LinkedIn Summary</span>
            </button>

            <button
              onClick={() => setActiveTab('questions')}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
                activeTab === 'questions'
                  ? 'border-[#B8860B] text-[#B8860B]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiHelpCircle />
              <span>Interview Prep</span>
            </button>

            <button
              onClick={() => setActiveTab('skillgap')}
              className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
                activeTab === 'skillgap'
                  ? 'border-[#B8860B] text-[#B8860B]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiTrendingUp />
              <span>Skill Gap Analysis</span>
            </button>
          </div>

          {/* Tab Workspace Contents */}
          <div className="bg-white dark:bg-[#161512] border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm min-h-[350px]">
            {activeTab === 'cover' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Personalized Cover Letter</h3>
                <p className="text-xs text-slate-500">
                  Compose a highly relevant cover letter based on matching credentials.
                </p>
                <button
                  onClick={handleGenerateCoverLetter}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#B8860B] to-[#7A4E1D] text-white px-5 py-2.5 rounded-xl font-semibold text-xs hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Cover Letter'}
                </button>
                {coverLetter && (
                  <pre className="mt-4 p-4 bg-[#F7F4ED]/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap">
                    {coverLetter}
                  </pre>
                )}
              </div>
            )}

            {activeTab === 'linkedin' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">LinkedIn About Section Generator</h3>
                <p className="text-xs text-slate-500">
                  Create a professional summary highlighting experience, projects, and top skills.
                </p>
                <button
                  onClick={handleGenerateLinkedIn}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#B8860B] to-[#7A4E1D] text-white px-5 py-2.5 rounded-xl font-semibold text-xs hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate LinkedIn Section'}
                </button>
                {linkedinSummary && (
                  <pre className="mt-4 p-4 bg-[#F7F4ED]/50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap">
                    {linkedinSummary}
                  </pre>
                )}
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Personalized Interview Preparation</h3>
                <p className="text-xs text-slate-500">
                  Practice questions tailored specifically to the mismatch between your projects and requirements.
                </p>
                <button
                  onClick={handleGenerateQuestions}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#B8860B] to-[#7A4E1D] text-white px-5 py-2.5 rounded-xl font-semibold text-xs hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Generate Practice Questions'}
                </button>
                {questions.length > 0 && (
                  <div className="space-y-4 mt-4">
                    {questions.map((q: any, i: number) => (
                      <div key={i} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B]">{q.category}</span>
                        <p className="text-sm font-semibold">{q.question}</p>
                        <p className="text-xs text-slate-500">💡 Hint: {q.hint}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'skillgap' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold">Skill Gap & Learning Roads</h3>
                <p className="text-xs text-slate-500">
                  Analyze missing technologies and receive recommended study order.
                </p>
                <button
                  onClick={handleSkillGap}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#B8860B] to-[#7A4E1D] text-white px-5 py-2.5 rounded-xl font-semibold text-xs hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Analyzing Gap...' : 'Run Skill Gap Analysis'}
                </button>
                {skillGap && (
                  <div className="space-y-6 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-emerald-500/10 bg-emerald-500/5 rounded-2xl text-xs text-emerald-600">
                        <p className="font-bold mb-1">Aligned Stacks</p>
                        {skillGap.alreadyHave?.map((s: string, i: number) => <span key={i} className="mr-2">• {s}</span>)}
                      </div>
                      <div className="p-4 border border-red-500/10 bg-red-500/5 rounded-2xl text-xs text-red-500">
                        <p className="font-bold mb-1">Missing Stacks</p>
                        {skillGap.missing?.map((s: string, i: number) => <span key={i} className="mr-2">• {s}</span>)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold flex items-center space-x-2">
                        <FiBookOpen className="text-[#B8860B]" />
                        <span>Recommended Learning Order</span>
                      </h4>
                      {skillGap.recommendedLearningOrder?.map((item: any, i: number) => (
                        <div key={i} className="p-4 border border-slate-200 dark:border-slate-800 rounded-2xl flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold">{item.skill}</p>
                            <p className="text-[#B8860B]">{item.resourceSuggestion}</p>
                          </div>
                          <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded font-semibold text-[10px] uppercase">
                            {item.priority} Priority
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FutureAiToolkit;
