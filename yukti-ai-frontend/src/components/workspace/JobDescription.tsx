import React from 'react';
import { useWorkspace } from '@contexts/WorkspaceContext';
import { useATS } from '@hooks/useATS';
import Card from '@components/common/Card';
import Input from '@components/common/Input';
import Textarea from '@components/common/Textarea';
import Button from '@components/common/Button';
import Loader from '@components/common/Loader';
import { FiSliders } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const JobDescription: React.FC = () => {
  const {
    activeResumeId,
    jobTitle,
    setJobTitle,
    jobDescription,
    setJobDescription,
    setMatchData,
    setStep,
    setOptimizeResult,
    setAnalysisReport,
  } = useWorkspace();

  const { analyzeJD, matchResume, optimizeResume, loading } = useATS();

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResumeId) {
      toast.error('Please upload or select an active resume first.');
      return;
    }
    if (!jobTitle.trim() || !jobDescription.trim()) {
      toast.error('Both Job Title and Job Description Details are required.');
      return;
    }

    try {
      // 1. Analyze JD
      const jdData = await analyzeJD(jobTitle, jobDescription);

      // 2. Perform Match
      const matchDataResult = await matchResume(parseInt(activeResumeId), jdData.id);

      setMatchData({
        ...matchDataResult,
        jobDescriptionId: jdData.id,
      });

      // Clear previous optimization results
      setOptimizeResult(null);
      setAnalysisReport(null);

      toast.success('ATS evaluation logs calculated successfully!');

      // Check if there are missing skills to confirm
      if (matchDataResult.keywordMatch?.missingKeywords?.length > 0) {
        setStep(2); // Go to confirmations
      } else {
        // Run straight optimization with no confirmed skills
        const optData = await optimizeResume({
          resumeId: parseInt(activeResumeId),
          jobDescriptionId: jdData.id,
          templateName: 'ATS Friendly',
          confirmedSkills: [],
          additionalExperiences: {},
        });
        setOptimizeResult(optData);
        if (optData.analysisReport) {
          try {
            setAnalysisReport(JSON.parse(optData.analysisReport));
          } catch (err) {
            console.error(err);
          }
        }
        setStep(3);
      }
    } catch (err) {
      // Error notifications are already handled in useATS
    }
  };

  return (
    <Card className="text-left space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-[#F7F4ED] flex items-center space-x-2">
          <FiSliders className="text-[#B8860B]" />
          <span>Paste Job Description</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Specify the target role name and requirements text to compute match alignment.
        </p>
      </div>

      <form onSubmit={handleCompare} className="space-y-4">
        <Input
          id="jobTitle"
          label="Job Title"
          placeholder="e.g. Senior Java Backend Developer"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          required
        />

        <Textarea
          id="jobDescription"
          label="Job Description details"
          placeholder="Paste requirements details here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={6}
          required
        />

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? <Loader variant="spinner" className="h-5 w-5 border-white p-0" /> : 'Analyze & Compare'}
        </Button>
      </form>
    </Card>
  );
};

export default JobDescription;
