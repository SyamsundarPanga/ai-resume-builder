import React from 'react';
import { useWorkspace } from '@contexts/WorkspaceContext';
import { useTemplate } from '@hooks/useTemplate';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Loader from '@components/common/Loader';
import { FiDownloadCloud } from 'react-icons/fi';

export const DownloadSection: React.FC = () => {
  const { optimizeResult, templateName } = useWorkspace();
  const { downloadPdf, downloadDocx, loading } = useTemplate();

  if (!optimizeResult) return null;

  return (
    <Card className="text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-[#F7F4ED] flex items-center space-x-2">
            <FiDownloadCloud className="text-[#B8860B]" />
            <span>Download Formats</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Export your fully ethically-optimized resume in executive-ready layouts.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="ghost"
            onClick={() => downloadDocx(optimizeResult.optimizedJson, templateName, 'optimized')}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading ? <Loader variant="spinner" className="h-4 w-4 p-0" /> : <FiDownloadCloud />}
            <span>Export to DOCX</span>
          </Button>

          <Button
            onClick={() => downloadPdf(optimizeResult.optimizedJson, templateName, 'optimized')}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            {loading ? <Loader variant="spinner" className="h-4 w-4 p-0 border-white" /> : <FiDownloadCloud />}
            <span>Export to PDF</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DownloadSection;
