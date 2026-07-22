import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  delayMs?: number;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  delayMs = 300
}) => {
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localVal);
    }, delayMs);

    return () => clearTimeout(handler);
  }, [localVal, delayMs, onChange]);

  return (
    <div className="relative w-full">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
        <FiSearch size={16} />
      </span>
      <input
        type="text"
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
        className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-[#1A1916] border border-[#B8860B]/15 dark:border-[#B8860B]/30 rounded-xl focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] focus:outline-none transition text-xs"
        placeholder={placeholder}
      />
    </div>
  );
};

export default SearchInput;
