// react global
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

function ExploreHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const pathWithoutImage = path.replace('tag/', '');
  const pathToBeDisplayed = pathWithoutImage.replace('/image/', '');
  const pathHeader = pathToBeDisplayed.replace('/', ' / ').replace(/%2F/g, '/');
  
  const parts = pathHeader.split(' / ');

  return (
    <div className="flex items-center gap-4 py-6 text-left">
      <button
        onClick={() => navigate(-1)}
        className="text-slate-400 hover:text-white transition p-1.5 hover:bg-slate-800 rounded-lg cursor-pointer focus:outline-none"
        aria-label="Back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      
      <nav className="flex items-center text-sm font-semibold" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="text-slate-400 hover:text-white transition">
              Home
            </Link>
          </li>
          {parts.map((part, index) => (
            <li key={index} className="flex items-center space-x-2">
              <span className="text-slate-600 select-none">/</span>
              <span className="text-slate-200">
                {part}
              </span>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

export default ExploreHeader;
