import React from 'react';
import { useWorkspace } from '@contexts/WorkspaceContext';
import Card from '@components/common/Card';
import Badge from '@components/common/Badge';
import { FiFileText } from 'react-icons/fi';

export const ResumePreview: React.FC = () => {
  const { optimizeResult, templateName } = useWorkspace();

  if (!optimizeResult) {
    return (
      <Card className="text-center py-12 text-slate-400">
        <FiFileText className="mx-auto mb-3 text-[#B8860B]/30" size={48} />
        <p className="text-sm font-semibold">No Resume Preview Available</p>
        <p className="text-xs text-slate-400 mt-1">
          Perform a matching and optimization sequence above to preview the outputs.
        </p>
      </Card>
    );
  }

  // Parse optimized JSON
  let resumeData: any = null;
  try {
    resumeData = typeof optimizeResult.optimizedJson === 'string'
      ? JSON.parse(optimizeResult.optimizedJson)
      : optimizeResult.optimizedJson;
  } catch (e) {
    console.error('Failed to parse optimized JSON', e);
  }

  if (!resumeData) {
    return (
      <Card className="text-center py-6 text-xs text-red-500">
        Error parsing optimized resume details.
      </Card>
    );
  }

  const p = resumeData.personalInfo || {};

  return (
    <Card className="text-left space-y-6 bg-white dark:bg-[#141311] border border-[#B8860B]/20 rounded-3xl p-8 max-w-4xl mx-auto shadow-lg relative">
      <div className="absolute right-6 top-6">
        <Badge variant="gold">{templateName} Layout</Badge>
      </div>

      {/* Header Info */}
      <div className="text-center pb-6 border-b border-[#B8860B]/10 space-y-2">
        <h2 className="text-2xl font-black tracking-tight text-[#1A1A1A] dark:text-[#F7F4ED]">
          {p.name || 'Candidate Name'}
        </h2>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
        </div>
      </div>

      {/* Summary */}
      {resumeData.summary && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8860B]">Summary</h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {resumeData.summary}
          </p>
        </div>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8860B]">Key Technologies & Skills</h3>
          <div className="flex flex-wrap gap-1.5">
            {resumeData.skills.map((s: string, i: number) => (
              <Badge key={i} variant="gold">
                {s}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8860B]">Professional Experience</h3>
          <div className="space-y-4 divide-y divide-[#B8860B]/5">
            {resumeData.experience.map((exp: any, i: number) => (
              <div key={i} className={`pt-3 first:pt-0 text-xs text-slate-700 dark:text-slate-300 space-y-1.5`}>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">{exp.role}</span>
                  <span className="text-[#7A4E1D]">{exp.duration}</span>
                </div>
                <div className="text-slate-500 font-semibold">{exp.company}</div>
                {exp.description && (
                  <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#B8860B]">Projects</h3>
          <div className="space-y-4 divide-y divide-[#B8860B]/5">
            {resumeData.projects.map((proj: any, i: number) => (
              <div key={i} className={`pt-3 first:pt-0 text-xs text-slate-700 dark:text-slate-300 space-y-1.5`}>
                <div className="flex justify-between font-bold">
                  <span className="text-slate-900 dark:text-white">{proj.title}</span>
                  {proj.technologies && (
                    <span className="text-xs text-[#7A4E1D]">({proj.technologies})</span>
                  )}
                </div>
                {proj.description && (
                  <p className="leading-relaxed text-[11px] text-slate-600 dark:text-slate-400">
                    {proj.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ResumePreview;
