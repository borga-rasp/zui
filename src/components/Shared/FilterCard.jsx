import { isArray, isNil } from 'lodash';
import React, { useState } from 'react';

// Custom Tooltip component in pure Tailwind CSS
const Tooltip = ({ title, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div 
      className="group relative inline-flex w-full items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {title && show && (
        <div className="absolute bottom-full left-1/2 z-[2000] mb-2 -translate-x-1/2 select-none pointer-events-none">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-lg px-2.5 py-1.5 shadow-xl max-w-xs whitespace-normal text-left">
            {title}
          </div>
          <div className="w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-800 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};

function FilterCard(props) {
  const { title, filters, updateFilters, filterValue, wrapperLoading } = props;

  const handleFilterClicked = (event, changedFilterValue) => {
    const { checked } = event.target;
    if (checked) {
      if (!isArray(filterValue)) {
        updateFilters({ ...filterValue, [changedFilterValue]: true });
      } else {
        updateFilters([...filterValue, changedFilterValue]);
      }
    } else {
      if (!isArray(filterValue)) {
        updateFilters({ ...filterValue, [changedFilterValue]: false });
      } else {
        updateFilters(filterValue.filter((e) => e !== changedFilterValue));
      }
    }
  };

  const getCheckboxStatus = (filter) => {
    if (isNil(filter)) {
      return false;
    }
    if (isArray(filterValue)) {
      return filterValue?.includes(filter.label);
    }
    return filterValue[filter.value] || false;
  };

  const getFilterRows = () => {
    return filters.map((filter, index) => {
      const isChecked = getCheckboxStatus(filter);
      return (
        <Tooltip key={index} title={filter.tooltip ?? filter.label}>
          <label className="flex items-center gap-2.5 py-1.5 px-1 w-full text-slate-300 hover:text-white transition duration-150 cursor-pointer select-none">
            <input
              type="checkbox"
              id={`${title}-${filter.value}`}
              checked={isChecked}
              disabled={wrapperLoading}
              onChange={(e) => handleFilterClicked(e, filter.value)}
              className="w-4 h-4 rounded bg-slate-950 border border-slate-700 text-blue-500 focus:ring-blue-500/20 focus:ring-2 focus:ring-offset-0 transition duration-150 disabled:opacity-50"
            />
            <span className="text-sm font-medium">{filter.label}</span>
          </label>
        </Tooltip>
      );
    });
  };

  return (
    <div className="w-full bg-bg-panel border border-slate-800/80 rounded-xl p-5 shadow-lg">
      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 text-left">
        {title || 'Filter Title'}
      </h4>
      <div className="flex flex-col gap-1 align-left items-start">
        {getFilterRows()}
      </div>
    </div>
  );
}

export default FilterCard;
