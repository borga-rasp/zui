import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

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

export default function ReferrerCard(props) {
  const { artifactType, mediaType, size, digest, annotations } = props;
  const [digestDropdownOpen, setDigestDropdownOpen] = useState(false);
  const [annotationDropdownOpen, setAnnotationDropdownOpen] = useState(false);

  return (
    <div className="MuiCard-root w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 text-left shadow-sm">
      <div className="space-y-2 text-slate-300">
        <div>
          {`Type: ${artifactType || 'N/A'}`}
        </div>
        <div>
          {`Media type: ${mediaType || 'N/A'}`}
        </div>
        <div>
          {`Size: ${size || 'N/A'}`}
        </div>
      </div>

      <div className="border-t border-slate-800/60 my-4" />

      {/* Digest Dropdown */}
      <div className="mb-3">
        <button
          onClick={() => setDigestDropdownOpen(!digestDropdownOpen)}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-350 transition cursor-pointer focus:outline-none"
        >
          {digestDropdownOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Digest</span>
        </button>
        {digestDropdownOpen && (
          <div className="mt-2.5 animate-in fade-in duration-100">
            <Tooltip title={digest || ''}>
              <div className="bg-slate-950 border border-slate-800/65 rounded-lg p-3 text-xs font-mono text-slate-400 break-all select-all">
                {digest}
              </div>
            </Tooltip>
          </div>
        )}
      </div>

      {/* Annotations Dropdown */}
      <div>
        <button
          onClick={() => setAnnotationDropdownOpen(!annotationDropdownOpen)}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-350 transition cursor-pointer focus:outline-none"
        >
          {annotationDropdownOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Annotations</span>
        </button>
        {annotationDropdownOpen && (
          <div className="mt-2.5 animate-in fade-in duration-100">
            {annotations && annotations.length > 0 ? (
              <div className="bg-slate-950 border border-slate-800/65 rounded-lg p-3 space-y-2">
                {annotations.map((annotation) => (
                  <div key={annotation.key} className="text-xs font-mono text-slate-350 break-all">
                    {`${annotation?.key}: ${annotation?.value}`}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-xs italic pl-1">No annotations available</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
