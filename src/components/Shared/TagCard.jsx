import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import transform from 'utilities/transform';
import { DateTime } from 'luxon';
import { ChevronRight, ChevronDown } from 'lucide-react';
import DeleteTag from 'components/Shared/DeleteTag';

// Custom Tooltip component in pure Tailwind CSS
const Tooltip = ({ title, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div 
      className="group relative inline-flex items-center"
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

export default function TagCard(props) {
  const { repoName, tag, lastUpdated, vendor, manifests, repo, onTagDelete, isDeletable } = props;
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const lastDate = lastUpdated
    ? DateTime.fromISO(lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
    : `Timestamp N/A`;

  const goToTags = (digest = null) => {
    if (repoName) {
      navigate(`/image/${encodeURIComponent(repoName)}/tag/${tag}`, { state: { digest } });
    } else {
      navigate(`tag/${tag}`, { state: { digest } });
    }
  };

  return (
    <div className="MuiCard-root w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 text-left shadow-sm">
      <div className="flex flex-row justify-between items-center mb-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Tag
        </span>
        {isDeletable && <DeleteTag repo={repo} tag={tag} onTagDelete={onTagDelete} />}
      </div>

      <button
        onClick={() => goToTags()}
        className="text-base font-bold text-blue-400 hover:text-blue-300 underline mb-2 transition text-left cursor-pointer focus:outline-none"
      >
        {repoName && `${repoName}:`}
        {tag}
      </button>

      <div className="flex items-center gap-1 text-xs text-slate-500">
        <span>Created</span>
        <Tooltip title={lastUpdated?.slice(0, 16) || ' '}>
          <span className="font-semibold text-slate-350 cursor-help">
            {lastDate} by <Markdown options={{ forceInline: true }}>{vendor || 'Vendor not available'}</Markdown>
          </span>
        </Tooltip>
      </div>

      <div className="border-t border-slate-800/60 my-4" />

      {/* Dropdown trigger */}
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-350 transition cursor-pointer focus:outline-none"
        >
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>{!open ? `Show more` : `Show less`}</span>
        </button>

        {/* Collapsed table of manifests */}
        {open && manifests && manifests.length > 0 && (
          <div className="mt-4 overflow-x-auto animate-in fade-in duration-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-2 pr-4">Digest</th>
                  <th className="py-2 px-4">OS/Arch</th>
                  <th className="py-2 pl-4 text-right hidden sm:table-cell">Compressed Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {manifests.map((el) => (
                  <tr key={el.digest} className="text-xs">
                    <td className="py-2.5 pr-4">
                      <Tooltip title={el.digest || ''}>
                        <button
                          onClick={() => goToTags(el.digest)}
                          className="text-indigo-400 hover:text-indigo-355 underline font-mono cursor-pointer focus:outline-none text-left"
                        >
                          {el.digest?.substr(0, 12)}
                        </button>
                      </Tooltip>
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">
                      {el.platform?.Os || '----'}/{el.platform?.Arch || '----'}
                    </td>
                    <td className="py-2.5 pl-4 text-right text-slate-300 hidden sm:table-cell">
                      {transform.formatBytes(el.size)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
