import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#B8860B]/10 text-xs font-semibold text-slate-500">
      <div className="flex items-center space-x-2">
        <span>Rows per page:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
          className="px-2 py-1 bg-white dark:bg-[#1A1916] border border-[#B8860B]/15 dark:border-[#B8860B]/30 rounded-lg focus:outline-none transition text-[11px]"
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 border border-[#B8860B]/15 hover:bg-[#B8860B]/5 rounded-lg disabled:opacity-40 transition"
        >
          <FiChevronLeft size={16} />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 border border-[#B8860B]/15 hover:bg-[#B8860B]/5 rounded-lg disabled:opacity-40 transition"
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
