import { DateTime } from 'luxon';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import React from 'react';
import transform from '../../utilities/transform';

// Custom Tooltip component in pure Tailwind CSS
const Tooltip = ({ title, children }) => {
  return (
    <div className="group relative inline-flex w-full items-center">
      {children}
      {title && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-[2000] mb-2 -translate-x-1/2 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-150 origin-bottom select-none">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-lg px-2.5 py-1.5 shadow-xl max-w-xs whitespace-normal text-left">
            {title}
          </div>
          <div className="w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-800 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};

function RepoDetailsMetadata(props) {
  const { repoURL, totalDownloads, lastUpdated, size, license, description } = props;

  const lastDate = lastUpdated
    ? DateTime.fromISO(lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
    : `Timestamp N/A`;

  const MetaCard = ({ title, content, tooltip }) => {
    const renderContent = () => (
      <div className="w-full bg-[#111827] border border-slate-800/80 rounded-xl p-4 text-left shadow-md">
        <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          {title}
        </span>
        <div className="text-sm font-medium text-slate-200 break-all">
          {content}
        </div>
      </div>
    );

    if (tooltip) {
      return (
        <Tooltip title={tooltip}>
          {renderContent()}
        </Tooltip>
      );
    }
    return renderContent();
  };

  return (
    <div className="flex flex-col gap-4">
      <MetaCard title="Repository" content={repoURL || 'not available'} />
      <MetaCard title="Total Downloads" content={!isNaN(totalDownloads) ? totalDownloads : 'not available'} />
      
      <div className="grid grid-cols-2 gap-4">
        <MetaCard title="Last Publish" content={lastDate} tooltip={lastUpdated?.slice(0, 16) || ' '} />
        <MetaCard title="Total Size" content={transform.formatBytes(size) || '----'} />
      </div>

      <MetaCard 
        title="License" 
        content={license ? <Markdown>{license}</Markdown> : 'License info not available'} 
        tooltip={license || ' '} 
      />

      <MetaCard 
        title="Description" 
        content={description ? <Markdown>{description}</Markdown> : 'Description not available'} 
      />
    </div>
  );
}

export default RepoDetailsMetadata;
