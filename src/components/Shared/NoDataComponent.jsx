import React from 'react';
import nodataImage from '../../assets/noData.svg';

function NoDataComponent({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <img src={nodataImage} className="w-48 h-48 mb-6 opacity-40 select-none pointer-events-none" alt="No data" />
      <span className="text-lg font-semibold text-slate-400">
        {text ? text : 'No Data'}
      </span>
    </div>
  );
}

export default NoDataComponent;
