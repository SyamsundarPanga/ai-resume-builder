import React from 'react';
import { useWorkspace } from '@contexts/WorkspaceContext';
import Card from '@components/common/Card';
import Progress from '@components/common/Progress';
import Badge from '@components/common/Badge';
import { FiAward, FiCheck, FiX } from 'react-icons/fi';

export const ATSAnalysis: React.FC = () => {
  const { matchData } = useWorkspace();

  if (!matchData) {
    return (
      <Card className="text-center py-12 text-slate-400">
        <FiAward className="mx-auto mb-3 text-[#B8860B]/30" size={48} />
        <p className="text-sm font-semibold">No ATS Analysis Computed</p>
        <p className="text-xs text-slate-400 mt-1">
          Upload a resume and paste a Job Description above to evaluate your ATS compatibility.
        </p>
      </Card>
    );
  }

  const score = matchData.initialScore || {};
  const kw = matchData.keywordMatch || {};

  return (
    <Card className="text-left space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-[#B8860B]/10">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-[#F7F4ED] flex items-center space-x-2">
            <FiAward className="text-[#B8860B]" />
            <span>ATS Evaluation Report</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Breakdown of keyword overlaps, layout structures, and category alignments.
          </p>
        </div>
        <div className="w-16 h-16 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/20 flex items-center justify-center font-black text-lg text-[#B8860B]">
          {score.overallScore}%
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Match Categories</h4>
          <Progress label="Skills Alignment" value={score.skillsScore} />
          <Progress label="Professional Experience" value={score.experienceScore} />
          <Progress label="Projects Alignment" value={score.projectsScore} />
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Formatting & Structure</h4>
          <Progress label="Education Context" value={score.educationScore} />
          <Progress label="Document Layout formatting" value={score.formattingScore} />
        </div>
      </div>

      {/* Keyword Matching Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#B8860B]/10">
        {/* Matched Keywords */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
            <FiCheck />
            <h4 className="text-xs font-bold uppercase tracking-wider">Matched Keywords ({kw.matchedKeywords?.length || 0})</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {kw.matchedKeywords?.length > 0 ? (
              kw.matchedKeywords.map((item: string, i: number) => (
                <Badge key={i} variant="success">
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-slate-400">No overlapping keywords identified.</span>
            )}
          </div>
        </div>

        {/* Missing Keywords */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
            <FiX />
            <h4 className="text-xs font-bold uppercase tracking-wider">Missing Keywords ({kw.missingKeywords?.length || 0})</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {kw.missingKeywords?.length > 0 ? (
              kw.missingKeywords.map((item: string, i: number) => (
                <Badge key={i} variant="error">
                  {item}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-emerald-500 font-semibold">Perfect! Zero missing skills.</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ATSAnalysis;
