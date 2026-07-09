import React, { useState } from 'react';
import transform from '../../utilities/transform';
import { DateTime } from 'luxon';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import PullCommandButton from 'components/Shared/PullCommandButton';

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

function TagDetailsMetadata(props) {
  const { platform, lastUpdated, lastTagged, size, license, imageName } = props;

  const lastDate = lastUpdated
    ? DateTime.fromISO(lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
    : `Timestamp N/A`;

  const lastTaggedDate = lastTagged
    ? DateTime.fromISO(lastTagged).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
    : `Timestamp N/A`;

  const MetaCard = ({ title, content, tooltip, labelTestId }) => {
    return (
      <div className="MuiCard-root w-full bg-[#111827] border border-slate-800/80 rounded-xl p-4 text-left shadow-md">
        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </span>
        {tooltip ? (
          <Tooltip title={tooltip}>
            <div className="text-sm font-medium text-slate-200 cursor-help" data-testid={labelTestId}>
              {content}
            </div>
          </Tooltip>
        ) : (
          <div className="text-sm font-medium text-slate-200" data-testid={labelTestId}>
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4" data-testid="tagDetailsMetadata-container">
      {/* Pull command */}
      <div className="MuiCard-root hidden sm:block w-full bg-[#111827] border border-slate-800/80 rounded-xl p-0 overflow-hidden shadow-md">
        <PullCommandButton imageName={imageName || ''} />
      </div>

      <MetaCard 
        title="OS/Arch" 
        content={`${platform?.Os || '----'} / ${platform?.Arch || '----'}`} 
      />

      <MetaCard 
        title="Total Size" 
        content={transform.formatBytes(size) || '----'} 
      />

      <MetaCard 
        title="Created" 
        content={lastDate} 
        tooltip={lastUpdated?.slice(0, 16) || ' '} 
      />

      <MetaCard 
        title="Last Tagged" 
        content={lastTaggedDate} 
        tooltip={lastTagged?.slice(0, 16) || ' '} 
      />

      <MetaCard 
        title="License" 
        content={license ? <Markdown>{license}</Markdown> : 'License info not available'} 
        tooltip={license || ' '} 
      />
    </div>
  );
}

export default TagDetailsMetadata;
