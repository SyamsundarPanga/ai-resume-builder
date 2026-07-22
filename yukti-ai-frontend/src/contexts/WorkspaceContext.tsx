import React, { createContext, useContext, useState } from 'react';

interface WorkspaceContextType {
  activeResumeId: string;
  setActiveResumeId: (id: string) => void;
  resumes: any[];
  setResumes: (resumes: any[] | ((prev: any[]) => any[])) => void;
  jobTitle: string;
  setJobTitle: (title: string) => void;
  jobDescription: string;
  setJobDescription: (desc: string) => void;
  templateName: string;
  setTemplateName: (name: string) => void;
  step: 1 | 2 | 3;
  setStep: (step: 1 | 2 | 3) => void;
  matchData: any;
  setMatchData: (data: any) => void;
  confirmedSkills: string[];
  setConfirmedSkills: (skills: string[] | ((prev: string[]) => string[])) => void;
  additionalExperiences: Record<string, string>;
  setAdditionalExperiences: (exp: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  optimizeResult: any;
  setOptimizeResult: (res: any) => void;
  analysisReport: any;
  setAnalysisReport: (rep: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeResumeId, setActiveResumeId] = useState<string>('');
  const [resumes, setResumes] = useState<any[]>([]);
  const [jobTitle, setJobTitle] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [templateName, setTemplateName] = useState<string>('ATS Friendly');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [matchData, setMatchData] = useState<any>(null);
  const [confirmedSkills, setConfirmedSkills] = useState<string[]>([]);
  const [additionalExperiences, setAdditionalExperiences] = useState<Record<string, string>>({});
  const [optimizeResult, setOptimizeResult] = useState<any>(null);
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <WorkspaceContext.Provider
      value={{
        activeResumeId,
        setActiveResumeId,
        resumes,
        setResumes,
        jobTitle,
        setJobTitle,
        jobDescription,
        setJobDescription,
        templateName,
        setTemplateName,
        step,
        setStep,
        matchData,
        setMatchData,
        confirmedSkills,
        setConfirmedSkills,
        additionalExperiences,
        setAdditionalExperiences,
        optimizeResult,
        setOptimizeResult,
        analysisReport,
        setAnalysisReport,
        loading,
        setLoading,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
