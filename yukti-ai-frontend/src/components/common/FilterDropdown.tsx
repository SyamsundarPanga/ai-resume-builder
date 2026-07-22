import React from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: FilterOption[];
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  onChange,
  options
}) => {
  return (
    <div className="flex flex-col text-left space-y-1">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 bg-white dark:bg-[#1A1916] border border-[#B8860B]/15 dark:border-[#B8860B]/30 rounded-xl focus:border-[#B8860B] focus:outline-none transition text-xs font-semibold"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
