import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-[300px] py-12">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-blue-500 border-r-indigo-500 animate-spin" />
        {/* Inner pulsing branding icon */}
        <div className="absolute w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 animate-pulse flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loading;
