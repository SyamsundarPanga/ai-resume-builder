import React, { useEffect, useRef } from 'react';
import { WorkspaceProvider, useWorkspace } from '@contexts/WorkspaceContext';
import { ResumeService } from '@services/ResumeService';
import WelcomeSection from '@components/workspace/WelcomeSection';
import ResumeUpload from '@components/workspace/ResumeUpload';
import JobDescription from '@components/workspace/JobDescription';
import ATSAnalysis from '@components/workspace/ATSAnalysis';
import Optimization from '@components/workspace/Optimization';
import ResumePreview from '@components/workspace/ResumePreview';
import ResumeTemplates from '@components/workspace/ResumeTemplates';
import DownloadSection from '@components/workspace/DownloadSection';
import HistorySection from '@components/workspace/HistorySection';
import { Toaster } from 'react-hot-toast';

const AIWorkspaceContent: React.FC = () => {
  const { setResumes, setActiveResumeId, step, matchData, optimizeResult } = useWorkspace();

  // Scroll Refs for Quick Jump Navigation
  const welcomeRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLDivElement>(null);
  const jdRef = useRef<HTMLDivElement>(null);
  const matchRef = useRef<HTMLDivElement>(null);
  const optimizeRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const templateRef = useRef<HTMLDivElement>(null);
  const downloadRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  const scrollToRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    // Initial fetch of user's resumes
    const loadResumes = async () => {
      try {
        const data = await ResumeService.getAll();
        setResumes(data);
        if (data.length > 0) {
          setActiveResumeId(data[0].id.toString());
        }
      } catch (e) {
        console.error('Failed to load user resumes', e);
      }
    };
    loadResumes();
  }, [setResumes, setActiveResumeId]);

  // Proactive scroll-jump helper when steps progress
  useEffect(() => {
    if (step === 2 && matchData) {
      setTimeout(() => scrollToRef(optimizeRef), 100);
    } else if (step === 3 && optimizeResult) {
      setTimeout(() => scrollToRef(previewRef), 100);
    }
  }, [step, matchData, optimizeResult]);

  return (
    <div className="space-y-8 pb-20 relative">
      <Toaster position="top-right" />

      {/* Floating Quick Navigation Anchor Indicators */}
      <div className="sticky top-18 bg-white/70 dark:bg-[#141311]/70 backdrop-blur-md border border-[#B8860B]/10 rounded-2xl p-2 z-30 flex flex-wrap gap-2 justify-center shadow-sm">
        <button onClick={() => scrollToRef(welcomeRef)} className="px-3 py-1 bg-[#B8860B]/10 hover:bg-[#B8860B]/20 text-[#B8860B] rounded-lg text-xs font-bold transition">
          Home
        </button>
        <button onClick={() => scrollToRef(uploadRef)} className="px-3 py-1 bg-[#B8860B]/10 hover:bg-[#B8860B]/20 text-[#B8860B] rounded-lg text-xs font-bold transition">
          Resume
        </button>
        <button onClick={() => scrollToRef(jdRef)} className="px-3 py-1 bg-[#B8860B]/10 hover:bg-[#B8860B]/20 text-[#B8860B] rounded-lg text-xs font-bold transition">
          Compare
        </button>
        {matchData && (
          <button onClick={() => scrollToRef(matchRef)} className="px-3 py-1 bg-[#B8860B]/10 hover:bg-[#B8860B]/20 text-[#B8860B] rounded-lg text-xs font-bold transition">
            Match Report
          </button>
        )}
        {step === 2 && (
          <button onClick={() => scrollToRef(optimizeRef)} className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold transition">
            Verify Experience
          </button>
        )}
        {optimizeResult && (
          <>
            <button onClick={() => scrollToRef(previewRef)} className="px-3 py-1 bg-[#B8860B]/10 hover:bg-[#B8860B]/20 text-[#B8860B] rounded-lg text-xs font-bold transition">
              Preview
            </button>
            <button onClick={() => scrollToRef(templateRef)} className="px-3 py-1 bg-[#B8860B]/10 hover:bg-[#B8860B]/20 text-[#B8860B] rounded-lg text-xs font-bold transition">
              Templates
            </button>
            <button onClick={() => scrollToRef(downloadRef)} className="px-3 py-1 bg-[#B8860B]/10 hover:bg-[#B8860B]/20 text-[#B8860B] rounded-lg text-xs font-bold transition">
              Export
            </button>
          </>
        )}
        <button onClick={() => scrollToRef(historyRef)} className="px-3 py-1 bg-[#B8860B]/10 hover:bg-[#B8860B]/20 text-[#B8860B] rounded-lg text-xs font-bold transition">
          Versions History
        </button>
      </div>

      {/* Composed Sections Container */}
      <div ref={welcomeRef}>
        <WelcomeSection />
      </div>

      <div ref={uploadRef}>
        <ResumeUpload />
      </div>

      <div ref={jdRef}>
        <JobDescription />
      </div>

      <div ref={matchRef}>
        <ATSAnalysis />
      </div>

      <div ref={optimizeRef}>
        <Optimization />
      </div>

      <div ref={previewRef}>
        <ResumePreview />
      </div>

      <div ref={templateRef}>
        <ResumeTemplates />
      </div>

      <div ref={downloadRef}>
        <DownloadSection />
      </div>

      <div ref={historyRef}>
        <HistorySection />
      </div>
    </div>
  );
};

export const AIWorkspace: React.FC = () => {
  return (
    <WorkspaceProvider>
      <AIWorkspaceContent />
    </WorkspaceProvider>
  );
};

export default AIWorkspace;
