// react global
import React, { useRef, useMemo, useState } from 'react';
import { useNavigate, createSearchParams } from 'react-router';

// utility
import { DateTime } from 'luxon';
import { uniq } from 'lodash';

// api module
import { api, endpoints } from '../../api';
import { host } from '../../host';
import { isAuthenticated } from '../../utilities/authUtilities';

import { Bookmark, Star } from 'lucide-react';

import { VulnerabilityIconCheck, SignatureIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import filterConstants from 'utilities/filterConstants';

// placeholder images
import repocube1 from '../../assets/repocube-1.png';
import repocube2 from '../../assets/repocube-2.png';
import repocube3 from '../../assets/repocube-3.png';
import repocube4 from '../../assets/repocube-4.png';

// Custom Tooltip component in pure Tailwind CSS
// Custom Tooltip component in pure Tailwind CSS with hover state for test compatibility
const Tooltip = ({ title, children, className = "inline-flex" }) => {
  const [show, setShow] = useState(false);
  return (
    <div 
      className={`group relative items-center ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {title && show && (
        <div className="absolute bottom-full left-1/2 z-[2000] mb-2 -translate-x-1/2 select-none pointer-events-none">
          <div className="bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-lg px-2.5 py-1.5 shadow-xl max-w-xs whitespace-normal text-left">
            {title}
          </div>
          <div className="w-2 h-2 bg-slate-900 border-r border-b border-slate-800 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
        </div>
      )}
    </div>
  );
};

// temporary utility to get image
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomImage = () => {
  const imageArray = [repocube1, repocube2, repocube3, repocube4];
  return imageArray[randomIntFromInterval(0, 3)];
};

function RepoCard(props) {
  const navigate = useNavigate();
  const placeholderImage = useRef(randomImage());
  const MAX_PLATFORM_CHIPS = 6;

  const abortController = useMemo(() => new AbortController(), []);

  const {
    name,
    vendor,
    platforms,
    description,
    downloads,
    stars,
    signatureInfo,
    lastUpdated,
    version,
    vulnerabilityData,
    isBookmarked,
    isStarred
  } = props;

  // keep a local bookmark state to display in the ui dynamically on updates
  const [currentBookmarkValue, setCurrentBookmarkValue] = useState(isBookmarked);

  // keep a local star state to display in the ui dynamically on updates
  const [currentStarValue, setCurrentStarValue] = useState(isStarred);

  const [currentStarCount, setCurrentStarCount] = useState(stars);

  const goToDetails = () => {
    navigate(`/image/${encodeURIComponent(name)}`);
  };

  const handlePlatformChipClick = (event) => {
    const textContent = event.target.textContent;
    event.stopPropagation();
    event.preventDefault();
    navigate({ pathname: `/explore`, search: createSearchParams({ filter: textContent }).toString() });
  };

  const handleBookmarkClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    api.put(`${host()}${endpoints.bookmarkToggle(name)}`, abortController.signal).then((response) => {
      if (response.status === 200) {
        setCurrentBookmarkValue((prevState) => !prevState);
      }
    });
  };

  const handleStarClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    api.put(`${host()}${endpoints.starToggle(name)}`, abortController.signal).then((response) => {
      if (response.status === 200) {
        setCurrentStarValue((prevState) => !prevState);
        currentStarValue
          ? setCurrentStarCount((prevState) => {
              return !isNaN(prevState) ? prevState - 1 : prevState;
            })
          : setCurrentStarCount((prevState) => {
              return !isNaN(prevState) ? prevState + 1 : prevState;
            });
      }
    });
  };

  const platformChips = () => {
    const filteredPlatforms = uniq(platforms?.flatMap((platform) => [platform.Os, platform.Arch]));
    const hiddenChips = filteredPlatforms.length - MAX_PLATFORM_CHIPS;
    const displayedPlatforms = filteredPlatforms.slice(0, MAX_PLATFORM_CHIPS + 1);
    if (hiddenChips > 0) displayedPlatforms.push(`+${hiddenChips} more`);
    return displayedPlatforms.map((platform, index) => (
      <button
        key={`${name}${platform}${index}`}
        onClick={handlePlatformChipClick}
        className="bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold rounded px-2 py-0.5 border border-slate-700 transition cursor-pointer"
      >
        {platform}
      </button>
    ));
  };

  const getVendor = () => {
    return `${vendor || 'Vendor not available'} •`;
  };
  const getVersion = () => {
    return `published ${version} •`;
  };
  const getLast = () => {
    const lastDate = lastUpdated
      ? DateTime.fromISO(lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
      : `Timestamp N/A`;
    return lastDate;
  };

  const renderBookmark = () => {
    return (
      isAuthenticated() && (
        <button
          onClick={handleBookmarkClick}
          className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800/60 rounded-lg transition duration-150 cursor-pointer focus:outline-none"
          data-testid="bookmark-button"
          aria-label="Bookmark repository"
        >
          {currentBookmarkValue ? (
            <Bookmark className="w-5 h-5 text-blue-500 fill-blue-500" data-testid="bookmarked" />
          ) : (
            <Bookmark className="w-5 h-5" data-testid="not-bookmarked" />
          )}
        </button>
      )
    );
  };

  const renderStar = () => {
    return (
      isAuthenticated() && (
        <button
          onClick={handleStarClick}
          className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-800/60 rounded-lg transition duration-150 cursor-pointer focus:outline-none"
          data-testid="star-button"
          aria-label="Star repository"
        >
          {currentStarValue ? (
            <Star className="w-4 h-4 text-amber-550 fill-amber-500" data-testid="starred" />
          ) : (
            <Star className="w-4 h-4" data-testid="not-starred" />
          )}
        </button>
      )
    );
  };

  const getSignatureChips = () => {
    const cosign = signatureInfo?.map((s) => s.tool).includes(filterConstants.signatureToolConstants.COSIGN)
      ? signatureInfo.filter((si) => si.tool === filterConstants.signatureToolConstants.COSIGN)
      : null;
    const notation = signatureInfo?.map((s) => s.tool).includes(filterConstants.signatureToolConstants.NOTATION)
      ? signatureInfo.filter((si) => si.tool === filterConstants.signatureToolConstants.NOTATION)
      : null;
    const sigArray = [];
    if (cosign) sigArray.push(cosign);
    if (notation) sigArray.push(notation);
    if (sigArray.length === 0) return <SignatureIconCheck />;
    return sigArray.map((sig, index) => (
      <div className="hidden sm:inline-flex" key={`${name}sig${index}`}>
        <SignatureIconCheck signatureInfo={sig} />
      </div>
    ));
  };

  return (
    <div
      onClick={goToDetails}
      className="group w-full bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-5 hover:bg-slate-900/80 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-indigo-500/2"
      data-testid="repo-card"
    >
      <div className="flex flex-row justify-between items-start gap-4">
        {/* Left Side: Avatar, Title, Description, Platforms & Meta */}
        <div className="flex-1 min-w-0">
          {/* Header row: Avatar, title, bug icon, signatures */}
          <div className="flex items-center gap-3 mb-2 flex-wrap sm:flex-nowrap">
            <img
              src={placeholderImage.current}
              alt="icon"
              className="w-6 h-6 object-contain rounded"
            />
            <Tooltip title={name}>
              <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors duration-150 truncate max-w-sm sm:max-w-md md:max-w-lg">
                {name}
              </h3>
            </Tooltip>
            <div className="hidden sm:flex items-center gap-2">
              <VulnerabilityIconCheck {...vulnerabilityData} />
              {getSignatureChips()}
            </div>
          </div>

          {/* Description */}
          <Tooltip title={description || 'Description not available'} className="flex w-full text-left justify-start">
            <p className="text-sm text-slate-400 mb-4 line-clamp-2 max-w-3xl text-left w-full">
              {description || 'Description not available'}
            </p>
          </Tooltip>

          {/* Platform tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
            {platformChips()}
          </div>

          {/* Meta text: vendor, version, last updated */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 text-left">
            <span className="hidden sm:inline">
              <Markdown options={{ forceInline: true }}>{getVendor()}</Markdown>
            </span>
            <span className="hidden sm:inline">{getVersion()}</span>
            <span>{getLast()}</span>
          </div>
        </div>

        {/* Right Side: Downloads & Stars & Bookmark action */}
        <div className="flex flex-col items-end justify-between self-stretch shrink-0 text-right">
          <div className="space-y-1.5 hidden sm:block">
            <div className="text-xs text-slate-500">
              Downloads: <span className="font-semibold text-slate-300 ml-1">{!isNaN(downloads) ? downloads : 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 justify-end">
              {renderStar()}
              <span>Stars:</span>
              <span className="font-semibold text-slate-300 ml-1">{!isNaN(currentStarCount) ? currentStarCount : 'N/A'}</span>
            </div>
          </div>
          <div className="mt-auto">
            {renderBookmark()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepoCard;
