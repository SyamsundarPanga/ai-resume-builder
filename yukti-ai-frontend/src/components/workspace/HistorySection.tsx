import React, { useEffect, useState } from 'react';
import { useWorkspace } from '@contexts/WorkspaceContext';
import { HistoryService } from '@services/HistoryService';
import { useSettings } from '@hooks/useSettings';
import { useTemplate } from '@hooks/useTemplate';
import Card from '@components/common/Card';
import Loader from '@components/common/Loader';
import SearchInput from '@components/common/SearchInput';
import FilterDropdown from '@components/common/FilterDropdown';
import SortSelect from '@components/common/SortSelect';
import Pagination from '@components/common/Pagination';
import { FiClock, FiDownloadCloud, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

export const HistorySection: React.FC = () => {
  const { activeResumeId } = useWorkspace();
  const [versions, setVersions] = useState<any[]>([]);
  const [loadingVersions, setLoadingVersions] = useState(false);
  
  // Search & Filter & Sort States
  const [search, setSearch] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  
  const { restoreVersion, deleteVersion, loading: actionLoading } = useSettings();
  const { downloadPdf, downloadDocx } = useTemplate();

  const fetchVersions = async () => {
    if (!activeResumeId) return;
    setLoadingVersions(true);
    try {
      const data = await HistoryService.getVersions(parseInt(activeResumeId));
      setVersions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load version history logs', e);
      setVersions([]);
    } finally {
      setLoadingVersions(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, [activeResumeId]);

  const handleRestore = async (versionId: number) => {
    try {
      await restoreVersion(versionId);
      fetchVersions();
    } catch (e) {
      // errors already shown
    }
  };

  const handleDelete = async (versionId: number) => {
    if (!window.confirm('Are you sure you want to delete this version?')) return;
    try {
      await deleteVersion(versionId);
      fetchVersions();
    } catch (e) {
      // errors already shown
    }
  };

  // Filter & Sort Logic
  const filteredVersions = versions
    .filter((v) => {
      const matchesSearch =
        v.templateName.toLowerCase().includes(search.toLowerCase()) ||
        v.versionNumber.toString().includes(search);
      const matchesTemplate =
        selectedTemplate === 'ALL' || v.templateName === selectedTemplate;
      return matchesSearch && matchesTemplate;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'version-high') return b.versionNumber - a.versionNumber;
      if (sortBy === 'version-low') return a.versionNumber - b.versionNumber;
      return 0;
    });

  // Pagination Slice
  const totalPages = Math.ceil(filteredVersions.length / pageSize);
  const paginatedVersions = filteredVersions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (!activeResumeId) return null;

  return (
    <Card className="text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-[#F7F4ED] flex items-center space-x-2">
            <FiClock className="text-[#B8860B]" />
            <span>Resume Versions Log</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Review previous optimization version checkpoints, download them, or restore active states.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-44">
            <SearchInput value={search} onChange={setSearch} placeholder="Search version..." />
          </div>
          <FilterDropdown
            label="Template"
            value={selectedTemplate}
            onChange={setSelectedTemplate}
            options={[
              { label: 'All Layouts', value: 'ALL' },
              { label: 'ATS Friendly', value: 'ATS Friendly' },
              { label: 'Modern', value: 'Modern' },
              { label: 'Professional', value: 'Professional' },
              { label: 'Minimal', value: 'Minimal' },
              { label: 'Executive', value: 'Executive' }
            ]}
          />
          <SortSelect
            value={sortBy}
            onChange={setSortBy}
            options={[
              { label: 'Newest First', value: 'newest' },
              { label: 'Oldest First', value: 'oldest' },
              { label: 'Highest Version', value: 'version-high' },
              { label: 'Lowest Version', value: 'version-low' }
            ]}
          />
        </div>
      </div>

      {loadingVersions || actionLoading ? (
        <Loader variant="spinner" />
      ) : paginatedVersions.length > 0 ? (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#B8860B]/10 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3">Version</th>
                  <th className="pb-3">Template</th>
                  <th className="pb-3">Optimized Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B8860B]/5 text-slate-700 dark:text-slate-300 font-medium">
                {paginatedVersions.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="py-4 font-bold text-[#B8860B]">v{v.versionNumber}</td>
                    <td className="py-4">{v.templateName}</td>
                    <td className="py-4">{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 text-right flex justify-end space-x-2">
                      <button
                        onClick={() => downloadPdf(v.optimizedJson, v.templateName, v.versionNumber)}
                        className="px-2 py-1.5 border border-[#B8860B]/20 text-[#B8860B] text-[10px] font-bold rounded-lg hover:bg-[#B8860B]/5 transition flex items-center space-x-1"
                        title="Download PDF"
                      >
                        <FiDownloadCloud />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => downloadDocx(v.optimizedJson, v.templateName, v.versionNumber)}
                        className="px-2 py-1.5 border border-[#B8860B]/20 text-[#B8860B] text-[10px] font-bold rounded-lg hover:bg-[#B8860B]/5 transition flex items-center space-x-1"
                        title="Download DOCX"
                      >
                        <FiDownloadCloud />
                        <span>Word</span>
                      </button>
                      <button
                        onClick={() => handleRestore(v.id)}
                        className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition"
                        title="Restore as Active Resume"
                      >
                        <FiRefreshCw size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(v.id)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                        title="Delete version row"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
          />
        </div>
      ) : (
        <p className="text-center text-xs text-slate-400 py-4">No matching historical version milestones found.</p>
      )}
    </Card>
  );
};

export default HistorySection;
