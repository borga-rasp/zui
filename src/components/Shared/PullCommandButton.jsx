import React, { useState, useEffect, useRef } from 'react';
import { dockerPull, podmanPull, skopeoPull } from 'utilities/pullStrings';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

function PullCommandButton(props) {
  const { imageName } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('docker');
  const dropdownRef = useRef(null);

  const getPullString = (tab) => {
    switch (tab) {
      case 'podman':
        return podmanPull(imageName);
      case 'skopeo':
        return skopeoPull(imageName);
      default:
        return dockerPull(imageName);
    }
  };

  const currentCommand = getPullString(activeTab);

  const handleCopyClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(currentCommand);
    setIsCopied(true);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {isCopied ? (
        <button
          className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center justify-between px-4 transition duration-200 cursor-pointer shadow-md"
          data-testid="successPulled-buton"
        >
          <span>Copied Pull Command</span>
          <Check className="w-5 h-5" />
        </button>
      ) : (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full h-14 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white font-semibold rounded-lg flex items-center justify-between px-4 transition duration-150 cursor-pointer shadow-md ${
              isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : ''
            }`}
          >
            <span className="truncate">Pull {imageName}</span>
            {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {isOpen && (
            <div
              className="absolute left-0 mt-2 w-full bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50 flex flex-col gap-3"
              data-testid="pull-dropdown"
            >
              {/* Tab Selector */}
              <div className="flex border-b border-slate-800/80 pb-1" data-testid="pull-menuItem">
                {[
                  { id: 'docker', label: 'Docker' },
                  { id: 'podman', label: 'Podman' },
                  { id: 'skopeo', label: 'Skopeo' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 text-center py-2 text-xs font-bold transition ${
                      activeTab === tab.id
                        ? 'text-blue-400 border-b-2 border-blue-500 font-extrabold'
                        : 'text-slate-500 hover:text-slate-350'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Panel */}
              <div className="flex items-center gap-2 border border-slate-800 bg-slate-950 rounded-lg p-2 mt-1">
                <input
                  readOnly
                  value={currentCommand}
                  className="w-full bg-transparent text-xs text-slate-300 placeholder-slate-600 focus:outline-none truncate select-all px-1"
                  data-testid={activeTab === 'podman' ? 'podman-input' : undefined}
                />
                <button
                  onClick={handleCopyClick}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition shrink-0 cursor-pointer"
                  data-testid={
                    activeTab === 'docker'
                      ? 'pullcopy-btn'
                      : activeTab === 'podman'
                      ? 'podmanPullcopy-btn'
                      : 'skopeoPullcopy-btn'
                  }
                  aria-label="Copy pull command"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PullCommandButton;
