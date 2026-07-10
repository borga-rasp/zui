// react global
import React, { useEffect, useRef, useState } from 'react';

// components
import TagCard from '../../Shared/TagCard';
import { tagsSortByCriteria } from 'utilities/sortCriteria';
import { Search } from 'lucide-react';

// Custom Select Component to match MUI tests expectations but using Tailwind
const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const selectedOption = Object.values(options).find((o) => o.value === value) || Object.values(options)[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-[200px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:border-blue-500 transition duration-150 cursor-pointer text-left"
      >
        <span>{selectedOption?.label}</span>
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 max-h-60 overflow-y-auto">
          {Object.values(options).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange({ target: { value: option.value } });
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition cursor-pointer ${
                option.value === value ? 'bg-blue-600 text-white font-semibold' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Tags(props) {
  const { tags, repoName, onTagDelete } = props;
  const [tagsFilter, setTagsFilter] = useState('');
  const [sortFilter, setSortFilter] = useState(tagsSortByCriteria.updateTimeDesc.value);

  const renderTags = (tagsList) => {
    const selectedSort = Object.values(tagsSortByCriteria).find((sc) => sc.value === sortFilter);
    const filteredTags = tagsList.filter((t) => t.tag?.includes(tagsFilter));
    if (selectedSort) {
      filteredTags.sort(selectedSort.func);
    }
    return (
      filteredTags &&
      filteredTags.map((tag) => {
        return (
          <TagCard
            key={tag.tag}
            tag={tag.tag}
            lastUpdated={tag.lastUpdated}
            vendor={tag.vendor}
            manifests={tag.manifests}
            repo={repoName}
            onTagDelete={onTagDelete}
            isDeletable={tag.isDeletable}
          />
        );
      })
    );
  };

  const handleTagsFilterChange = (e) => {
    const { value } = e.target;
    setTagsFilter(value);
  };

  const handleTagsSortChange = (e) => {
    const { value } = e.target;
    setSortFilter(value);
  };

  return (
    <div className="flex flex-col gap-4 text-left">
      <div className="flex flex-row justify-between items-center border-b border-slate-800 pb-3">
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">
          Tags History
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Sort</span>
          <CustomSelect
            value={sortFilter}
            onChange={handleTagsSortChange}
            options={tagsSortByCriteria}
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between border border-slate-800 bg-slate-900/60 rounded-lg px-3.5 py-2">
        <input
          placeholder="Search tags..."
          value={tagsFilter}
          onChange={handleTagsFilterChange}
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
      </div>

      {/* Tags List */}
      <div className="flex flex-col gap-3 mt-2">
        {renderTags(tags)}
      </div>
    </div>
  );
}
