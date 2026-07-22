import React from 'react';
import { useWorkspace } from '@contexts/WorkspaceContext';
import { useATS } from '@hooks/useATS';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Loader from '@components/common/Loader';
import { FiHelpCircle, FiArrowLeft, FiSliders } from 'react-icons/fi';
import { motion } from 'framer-motion';

export const Optimization: React.FC = () => {
  const {
    activeResumeId,
    matchData,
    step,
    setStep,
    confirmedSkills,
    setConfirmedSkills,
    additionalExperiences,
    setAdditionalExperiences,
    templateName,
    setOptimizeResult,
    setAnalysisReport,
  } = useWorkspace();

  const { optimizeResume, loading } = useATS();

  if (step !== 2 || !matchData) return null;

  const handleSkillConfirmation = (skill: string, hasWorked: boolean) => {
    if (hasWorked) {
      setConfirmedSkills((prev) => [...prev, skill]);
      setAdditionalExperiences((prev) => ({ ...prev, [skill]: '' }));
    } else {
      setConfirmedSkills((prev) => prev.filter((s) => s !== skill));
      setAdditionalExperiences((prev) => {
        const copy = { ...prev };
        delete copy[skill];
        return copy;
      });
    }
  };

  const handleExpTextChange = (skill: string, text: string) => {
    setAdditionalExperiences((prev) => ({ ...prev, [skill]: text }));
  };

  const executeOptimization = async () => {
    try {
      const data = await optimizeResume({
        resumeId: parseInt(activeResumeId),
        jobDescriptionId: matchData.jobDescriptionId,
        templateName,
        confirmedSkills,
        additionalExperiences,
      });

      setOptimizeResult(data);
      if (data.analysisReport) {
        try {
          setAnalysisReport(JSON.parse(data.analysisReport));
        } catch (e) {
          console.error('Failed to parse analysis report', e);
        }
      }
      setStep(3);
    } catch (err) {
      // errors already shown
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
    >
      <Card className="text-left space-y-6">
        <div className="flex items-center space-x-2 pb-4 border-b border-[#B8860B]/10">
          <FiHelpCircle className="text-[#B8860B]" size={22} />
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-[#F7F4ED]">Confirm Technical Experience</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select which missing skills you actually have experience with. We only optimize confirmed skills to preserve resume integrity.
            </p>
          </div>
        </div>

        <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
          {matchData.keywordMatch?.missingKeywords?.map((skill: string) => {
            const isConfirmed = confirmedSkills.includes(skill);
            return (
              <div key={skill} className="p-4 border border-[#B8860B]/10 rounded-2xl space-y-3 bg-[#F7F4ED]/5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                    We detected <span className="text-[#B8860B] font-bold">{skill}</span> in the Job Description. Your resume does not mention {skill}. Have you worked with {skill}?
                  </p>
                </div>
                <div className="flex space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleSkillConfirmation(skill, true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      isConfirmed
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSkillConfirmation(skill, false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${
                      !isConfirmed
                        ? 'bg-red-500/10 border-red-500 text-red-500'
                        : 'border-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    No
                  </button>
                </div>

                {isConfirmed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2.5 pt-3 border-t border-[#B8860B]/5"
                  >
                    <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      Which project? Describe your experience.
                    </label>
                    <input
                      type="text"
                      value={additionalExperiences[skill] || ''}
                      onChange={(e) => handleExpTextChange(skill, e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-[#1A1916] border border-[#B8860B]/15 dark:border-[#B8860B]/30 rounded-xl focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] focus:outline-none text-xs"
                      placeholder="e.g. POS SaaS Project - Implemented containerization to support local development"
                    />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex space-x-3 pt-4 border-t border-[#B8860B]/10">
          <Button variant="ghost" onClick={() => setStep(1)} className="flex items-center space-x-1">
            <FiArrowLeft />
            <span>Back</span>
          </Button>
          <Button className="flex-1 flex items-center justify-center space-x-2" onClick={executeOptimization} disabled={loading}>
            {loading ? (
              <Loader variant="spinner" className="h-5 w-5 border-white p-0" />
            ) : (
              <>
                <FiSliders />
                <span>Optimize Resume</span>
              </>
            )}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default Optimization;
