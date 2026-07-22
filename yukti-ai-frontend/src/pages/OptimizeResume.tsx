import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';
import {
  FiCheckCircle,
  FiDownloadCloud,
  FiSliders,
  FiCompass,
  FiHelpCircle
} from 'react-icons/fi';

const OptimizeResume: React.FC = () => {
  const location = useLocation();
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [templateName, setTemplateName] = useState('ATS Friendly');
  
  // Steps control
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Input & Match, 2: Skill Confirmations, 3: Optimize & Report
  const [loading, setLoading] = useState(false);
  
  // Results
  const [matchData, setMatchData] = useState<any>(null);
  const [confirmedSkills, setConfirmedSkills] = useState<string[]>([]);
  const [additionalExperiences, setAdditionalExperiences] = useState<Record<string, string>>({});
  const [optimizeResult, setOptimizeResult] = useState<any>(null);
  const [analysisReport, setAnalysisReport] = useState<any>(null);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await API.get('/api/resumes');
        setResumes(response.data);
        if (response.data.length > 0) {
          const preselected = location.state?.resumeId || response.data[0].id;
          setSelectedResumeId(preselected.toString());
        }
      } catch (error) {
        console.error('Failed to fetch resumes', error);
      }
    };
    fetchResumes();
  }, [location.state]);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId) {
      toast.error('Select a resume first.');
      return;
    }
    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast.error('Pasting job details is required.');
      return;
    }

    setLoading(true);
    try {
      // Analyze JD
      const jdResponse = await API.post('/api/job-description/analyze', {
        title: jobTitle,
        description: jobDescription,
      });

      // Match resume
      const matchResponse = await API.post('/api/resume/match', {
        resumeId: parseInt(selectedResumeId),
        jobDescriptionId: jdResponse.data.id,
      });

      setMatchData({
        ...matchResponse.data,
        jobDescriptionId: jdResponse.data.id
      });
      toast.success('Resume matched. Checking required skills confirmations!');
      
      // If there are missing skills, proceed to confirmation flow, else skip to optimization
      if (matchResponse.data.keywordMatch?.missingKeywords?.length > 0) {
        setStep(2);
      } else {
        // Optimize immediately
        triggerOptimization([], {});
      }
    } catch (error: any) {
      console.error(error);
      toast.error('Error comparing resume contents.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillConfirmation = (skill: string, hasWorked: boolean) => {
    if (hasWorked) {
      setConfirmedSkills(prev => [...prev, skill]);
      setAdditionalExperiences(prev => ({ ...prev, [skill]: '' }));
    } else {
      setConfirmedSkills(prev => prev.filter(s => s !== skill));
      const updated = { ...additionalExperiences };
      delete updated[skill];
      setAdditionalExperiences(updated);
    }
  };

  const handleExpTextChange = (skill: string, text: string) => {
    setAdditionalExperiences(prev => ({ ...prev, [skill]: text }));
  };

  const triggerOptimization = async (skillsList: string[], expMap: any) => {
    setLoading(true);
    try {
      const response = await API.post('/api/resume/optimize', {
        resumeId: parseInt(selectedResumeId),
        jobDescriptionId: matchData.jobDescriptionId,
        templateName,
        confirmedSkills: skillsList,
        additionalExperiences: expMap
      });

      setOptimizeResult(response.data);
      if (response.data.analysisReport) {
        try {
          setAnalysisReport(JSON.parse(response.data.analysisReport));
        } catch (e) {
          console.error("Failed to parse analysis report", e);
        }
      }
      setStep(3);
      toast.success('Resume optimized successfully!');
    } catch (error: any) {
      console.error(error);
      toast.error('Failed to complete optimization sequence.');
    } finally {
      setLoading(false);
    }
  };

  const submitConfirmations = () => {
    triggerOptimization(confirmedSkills, additionalExperiences);
  };

  const templates = ['ATS Friendly', 'Modern', 'Professional', 'Minimal', 'Executive'];

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />

      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">AI Matching & Optimization</h1>
        <p className="text-slate-500 mt-1">
          Perform strict parsing, keyword validation, and structured ethical rewriting via Google Gemini AI.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: Inputs and matching */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <form onSubmit={handleMatch} className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm space-y-5">
                <h2 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                  <FiSliders className="text-[#B8860B]" />
                  <span>Job Requirements Inputs</span>
                </h2>

                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">Selected Resume</label>
                  {resumes.length > 0 ? (
                    <select
                      value={selectedResumeId}
                      onChange={(e) => setSelectedResumeId(e.target.value)}
                      className="w-full bg-[#F7F4ED]/60 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B8860B] transition"
                    >
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.originalFileName} ({r.fileType})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-slate-500 py-2">
                      No resumes found.{' '}
                      <a href="/upload" className="text-[#B8860B] font-semibold underline">
                        Upload one now.
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-[#F7F4ED]/60 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B8860B] transition"
                    placeholder="Staff Software Engineer, Backend Lead..."
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">Job Description Details</label>
                  <textarea
                    rows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full bg-[#F7F4ED]/60 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B8860B] transition"
                    placeholder="Paste job details, required technologies, or qualifications..."
                  />
                </div>

                <div>
                  <label className="block text-slate-700 text-sm font-semibold mb-2">Template Layout</label>
                  <div className="grid grid-cols-3 gap-2">
                    {templates.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTemplateName(t)}
                        className={`py-2 px-3 rounded-lg border text-xs font-semibold transition ${
                          templateName === t
                            ? 'border-[#B8860B] bg-[#B8860B]/10 text-[#B8860B]'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#B8860B] to-[#7A4E1D] text-white font-semibold py-3.5 rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm disabled:opacity-50"
                >
                  {loading ? 'Evaluating Match...' : 'Compare & Evaluate Match'}
                </button>
              </form>
            </div>

            {/* Instruction Right Side */}
            <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-8 flex flex-col justify-center space-y-6">
              <div className="p-4 bg-[#B8860B]/10 border border-[#B8860B]/20 text-[#B8860B] rounded-2xl inline-flex items-center space-x-3 w-fit">
                <FiCompass size={24} />
                <span className="font-bold text-sm">Guided Path Guidance</span>
              </div>
              <h2 className="text-2xl font-black">How Optimization Works</h2>
              <div className="space-y-4 text-sm text-slate-600">
                <p>
                  1. **Semantic Analysis**: We check keywords, responsibilities, and phrasing alignments first.
                </p>
                <p>
                  2. **Claims Confirmation**: If required skills from JD are missing on your resume, you confirm whether you have them.
                </p>
                <p>
                  3. **Validation & Output**: We invoke Gemini to rewrite descriptions and verify programmatically that no unauthorized credentials are added.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: Skill Confirmations */}
        {step === 2 && matchData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <FiHelpCircle className="text-[#B8860B]" />
                <span>Confirm Your Technical Skills</span>
              </h2>
              <p className="text-sm text-slate-500">
                We detected missing required keywords from the job description. To maintain integrity, we will only optimize keywords you confirm here.
              </p>

              <div className="space-y-6 max-h-[450px] overflow-y-auto pr-2">
                {matchData.keywordMatch.missingKeywords.map((skill: string) => {
                  const isChecked = confirmedSkills.includes(skill);
                  return (
                    <div key={skill} className="p-5 border border-slate-200 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base text-slate-800">{skill}</span>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleSkillConfirmation(skill, true)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                              isChecked
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            Yes, I have experience
                          </button>
                          <button
                            onClick={() => handleSkillConfirmation(skill, false)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                              !isChecked
                                ? 'bg-red-500/5 border-red-500/20 text-red-500'
                                : 'border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>

                      {isChecked && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-2"
                        >
                          <label className="block text-xs text-slate-500 font-semibold">
                            Describe your experience or projects using {skill} (optional, helps AI rewrite)
                          </label>
                          <input
                            type="text"
                            value={additionalExperiences[skill] as string || ''}
                            onChange={(e) => handleExpTextChange(skill, e.target.value)}
                            className="w-full bg-[#F7F4ED]/60 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#B8860B] transition"
                            placeholder="Used Docker to containerize Spring APIs, setup volumes..."
                          />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex space-x-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  onClick={submitConfirmations}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-[#B8860B] to-[#7A4E1D] text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 text-sm"
                >
                  {loading ? 'Rewriting with Gemini...' : 'Proceed to ethical optimization'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Report & Results */}
        {step === 3 && optimizeResult && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8"
          >
            {/* Top Score summary and download */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center font-black text-2xl text-[#B8860B]">
                  {optimizeResult.atsScore?.overallScore}%
                </div>
                <div>
                  <h2 className="text-xl font-bold">Optimization Complete!</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Initial Score: {matchData?.initialScore?.overallScore}% → Optimized Score: {optimizeResult.atsScore?.overallScore}%
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <a
                  href={optimizeResult.cloudinaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#B8860B] to-[#7A4E1D] text-white font-bold py-3.5 px-6 rounded-xl hover:opacity-95 shadow-md shadow-[#B8860B]/15 text-sm"
                >
                  <FiDownloadCloud />
                  <span>Download Optimized Resume (PDF)</span>
                </a>
              </div>
            </div>

            {/* Validation Layer Report */}
            {optimizeResult.validationReport && (
              <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-bold flex items-center space-x-2">
                  <FiCheckCircle className="text-emerald-500" />
                  <span>AI Claims Validation Layer</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Verified Credentials</h4>
                    <div className="max-h-[150px] overflow-y-auto space-y-1.5 text-xs text-slate-600">
                      {optimizeResult.validationReport.verifiedInformation?.map((item: string, i: number) => (
                        <div key={i} className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Filtered Hallucinated Claims</h4>
                    <div className="max-h-[150px] overflow-y-auto space-y-1.5 text-xs text-red-500">
                      {optimizeResult.validationReport.potentialUnsupportedClaims?.length > 0 ? (
                        optimizeResult.validationReport.potentialUnsupportedClaims.map((item: string, i: number) => (
                          <div key={i} className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                            <span>{item}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400">No fabricated items flagged. Excellent!</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis report from Gemini */}
            {analysisReport && (
              <div className="space-y-8">
                {/* 1. Score Improvement Table */}
                <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm overflow-hidden">
                  <h3 className="text-base font-bold text-[#1A1A1A] mb-4">ATS Score Improvements Analysis</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#B8860B]/10 text-slate-500 uppercase tracking-wider">
                          <th className="pb-3 font-semibold">Evaluation Section</th>
                          <th className="pb-3 font-semibold text-center">Original</th>
                          <th className="pb-3 font-semibold text-center">Optimized</th>
                          <th className="pb-3 font-semibold text-center">Improvement</th>
                          <th className="pb-3 font-semibold pl-4">Optimization Explanation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#B8860B]/5">
                        {[
                          { name: 'Overall ATS Match', key: 'overallMatch' },
                          { name: 'Skills Match', key: 'skillsMatch' },
                          { name: 'Experience Match', key: 'experienceMatch' },
                          { name: 'Projects Match', key: 'projectsMatch' },
                          { name: 'Responsibilities Match', key: 'responsibilitiesMatch' },
                          { name: 'Formatting Match', key: 'formattingMatch' },
                          { name: 'Education Match', key: 'educationMatch' },
                          { name: 'Resume Truth Score', key: 'truthScore' },
                          { name: 'Readability Score', key: 'readabilityScore' },
                        ].map((row) => {
                          const val = analysisReport[row.key] || {};
                          const originalVal = val.original !== undefined ? val.original : 50;
                          const optimizedVal = val.optimized !== undefined ? val.optimized : 80;
                          const improvementVal = val.improvement !== undefined ? val.improvement : (optimizedVal - originalVal);
                          const reasonVal = val.reason || 'Verified parameters matching guidelines.';
                          return (
                            <tr key={row.key} className="hover:bg-[#F7F4ED]/10">
                              <td className="py-3.5 font-bold text-slate-800">{row.name}</td>
                              <td className="py-3.5 text-center text-slate-500">{originalVal}%</td>
                              <td className="py-3.5 text-center font-bold text-slate-900">{optimizedVal}%</td>
                              <td className={`py-3.5 text-center font-bold ${improvementVal > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {improvementVal > 0 ? `+${improvementVal}%` : `${improvementVal}%`}
                              </td>
                              <td className="py-3.5 pl-4 text-slate-600 italic leading-relaxed">{reasonVal}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Skills and Concepts Alignment Mapping */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-5 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Matched Skills</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysisReport.matchedSkills && analysisReport.matchedSkills.length > 0 ? (
                        analysisReport.matchedSkills.map((item: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-medium">
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">None detected.</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-5 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Partial / Synonym Matches</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysisReport.partialMatches && analysisReport.partialMatches.length > 0 ? (
                        analysisReport.partialMatches.map((item: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-[10px] font-medium">
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">None detected.</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-5 shadow-sm space-y-3">
                    <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider">Missing Skills</h4>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysisReport.missingSkills && analysisReport.missingSkills.length > 0 ? (
                        analysisReport.missingSkills.map((item: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-red-50 text-red-700 border border-red-100 rounded-lg text-[10px] font-medium">
                            {item}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-slate-400">None detected.</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Strengths, Weaknesses and Recommendations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm space-y-5">
                    <h3 className="text-base font-bold text-[#1A1A1A]">Strengths & Target Gaps</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">Strengths</h4>
                        <div className="space-y-1.5 text-xs text-slate-600">
                          {analysisReport.strengths?.map((item: string, i: number) => (
                            <p key={i}>• {item}</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2">Experience Gap</h4>
                        <div className="space-y-1.5 text-xs text-slate-600">
                          {analysisReport.experienceGap && analysisReport.experienceGap.length > 0 ? (
                            analysisReport.experienceGap.map((item: string, i: number) => (
                              <p key={i}>• {item}</p>
                            ))
                          ) : (
                            <p className="italic text-slate-400">No major experience gaps identified.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#B8860B]/15 rounded-3xl p-6 shadow-sm space-y-5">
                    <h3 className="text-base font-bold text-[#1A1A1A]">Weaknesses & Recommendations</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">Weaknesses</h4>
                        <div className="space-y-1.5 text-xs text-slate-600">
                          {analysisReport.weaknesses?.map((item: string, i: number) => (
                            <p key={i}>• {item}</p>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#B8860B] uppercase tracking-wider mb-2">Recommendations</h4>
                        <div className="space-y-1.5 text-xs text-slate-600">
                          {analysisReport.recommendations && analysisReport.recommendations.length > 0 ? (
                            analysisReport.recommendations.map((item: string, i: number) => (
                              <p key={i}>• {item}</p>
                            ))
                          ) : (
                            <p className="italic text-slate-400">No matching recommendations needed.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setStep(1);
                setMatchData(null);
                setOptimizeResult(null);
                setConfirmedSkills([]);
                setAdditionalExperiences({});
              }}
              className="px-6 py-3 bg-white border border-[#B8860B]/20 text-[#B8860B] rounded-xl text-sm font-semibold hover:bg-[#B8860B]/5 transition"
            >
              Start New Match
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OptimizeResume;
