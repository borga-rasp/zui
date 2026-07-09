import React, { useState } from 'react';
import transform from 'utilities/transform';
import { ChevronRight, ChevronDown } from 'lucide-react';

function LayerCard(props) {
  const { layer, historyDescription } = props;
  const [open, setOpen] = useState(false);

  const getLayerSize = () => {
    if (historyDescription?.EmptyLayer) return 0;
    else return layer?.Size || 0;
  };

  return (
    <div className="MuiCard-root w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 text-left shadow-sm">
      <div className="flex flex-row justify-between items-center gap-4">
        <span
          onClick={() => setOpen(!open)}
          className="text-sm font-medium text-slate-350 truncate hover:text-white transition duration-150 cursor-pointer flex-1"
        >
          {historyDescription?.CreatedBy || 'N/A'}
        </span>
        <span className="text-sm font-medium text-slate-300 shrink-0">
          {transform.formatBytes(getLayerSize())}
        </span>
      </div>

      <div className="border-t border-slate-800/60 my-3" />

      {/* Details dropdown trigger */}
      <div>
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-350 transition cursor-pointer focus:outline-none"
        >
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span>Details</span>
        </button>

        {/* Collapsible Details */}
        {open && (
          <div className="mt-4 space-y-4 animate-in fade-in duration-100">
            <div>
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Command
              </span>
              <div className="bg-slate-950 border border-slate-800/60 rounded-lg p-3 text-sm text-slate-400 font-mono break-all leading-relaxed max-h-60 overflow-y-auto">
                {historyDescription?.CreatedBy || 'N/A'}
              </div>
            </div>

            {!historyDescription?.EmptyLayer && layer?.Digest && (
              <div>
                <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Digest
                </span>
                <div className="bg-slate-950 border border-slate-800/60 rounded-lg p-3 text-sm text-slate-400 font-mono break-all leading-relaxed">
                  {layer.Digest}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LayerCard;
