import React from 'react';
import { useWorkspace } from '@contexts/WorkspaceContext';
import Card from '@components/common/Card';
import { FiLayout } from 'react-icons/fi';
import API from '@utils/api';

export const ResumeTemplates: React.FC = () => {
  const { templateName, setTemplateName } = useWorkspace();

  const [dbTemplates, setDbTemplates] = React.useState<any[]>([]);

  React.useEffect(() => {
    API.get('/api/resume/templates')
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDbTemplates(res.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const templatesToUse = dbTemplates.length > 0 ? dbTemplates.map(t => t.displayName) : ['ATS Friendly', 'Modern', 'Professional', 'Minimal', 'Executive'];

  return (
    <Card className="text-left space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-[#F7F4ED] flex items-center space-x-2">
          <FiLayout className="text-[#B8860B]" />
          <span>Resume Templates</span>
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Select your target layout style. Both PDF and DOCX streams automatically align formatting rules to the selected layout.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {templatesToUse.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTemplateName(t)}
            className={`py-3 px-4 rounded-xl border text-xs font-bold transition flex flex-col items-center justify-center space-y-2 cursor-pointer ${
              templateName === t
                ? 'border-[#B8860B] bg-[#B8860B]/10 text-[#B8860B] shadow-md shadow-[#B8860B]/5'
                : 'border-[#B8860B]/15 hover:bg-[#B8860B]/5 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <span className="w-8 h-8 rounded-lg bg-[#B8860B]/10 flex items-center justify-center">
              <FiLayout size={14} className="text-[#B8860B]" />
            </span>
            <span>{t}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default ResumeTemplates;
