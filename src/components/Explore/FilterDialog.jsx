import React from 'react';
import { sortByCriteria } from 'utilities/sortCriteria.js';

function FilterDialog(props) {
  const { open, setOpen, sortValue, setSortValue, renderFilterCards } = props;

  const handleSortChange = (event) => {
    setSortValue(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-bg-dark z-[9999] flex flex-col p-6 overflow-y-auto">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <h2 className="text-xl font-bold text-white">Filter Results</h2>
        <button
          onClick={handleClose}
          className="text-slate-400 hover:text-white transition cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Sort Section */}
      <div className="mb-6 flex flex-col items-start w-full">
        <label className="block text-sm font-semibold text-slate-400 mb-2">
          Sort Results
        </label>
        <select
          value={sortValue}
          onChange={handleSortChange}
          className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {Object.values(sortByCriteria).map((el) => (
            <option key={el.value} value={el.value}>
              {el.label}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Cards Section */}
      <div className="flex-1 space-y-4 mb-24">
        {renderFilterCards()}
      </div>

      {/* Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-dark border-t border-slate-800 p-4 flex justify-end">
        <button
          onClick={handleClose}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-150 cursor-pointer"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}

export default FilterDialog;
