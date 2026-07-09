// react global
import React, { useEffect, useMemo, useRef, useState } from 'react';

// external
import { DateTime } from 'luxon';
import { isEmpty, uniq } from 'lodash';

// utility
import { api, endpoints } from '../../api';
import { host } from '../../host';
import { useParams, useNavigate, createSearchParams } from 'react-router';
import { mapToRepoFromRepoInfo } from 'utilities/objectModels';
import { isAuthenticated } from 'utilities/authUtilities';
import filterConstants from 'utilities/filterConstants';

// components
import Tags from './Tabs/Tags.jsx';
import RepoDetailsMetadata from './RepoDetailsMetadata';
import Loading from '../Shared/Loading';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import { VulnerabilityIconCheck, SignatureIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';
import { Bookmark, Star } from 'lucide-react';

// placeholder images
import repocube1 from '../../assets/repocube-1.png';
import repocube2 from '../../assets/repocube-2.png';
import repocube3 from '../../assets/repocube-3.png';
import repocube4 from '../../assets/repocube-4.png';

// Custom Tooltip component in pure Tailwind CSS
// Custom Tooltip component in pure Tailwind CSS with hover state for test compatibility
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

// temporary utility to get image
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomImage = () => {
  const imageArray = [repocube1, repocube2, repocube3, repocube4];
  return imageArray[randomIntFromInterval(0, 3)];
};

function RepoDetails() {
  const [repoDetailData, setRepoDetailData] = useState({});
  const [tags, setTags] = useState([]);
  const placeholderImage = useRef(randomImage());
  const [isLoading, setIsLoading] = useState(true);
  const { name } = useParams();
  const navigate = useNavigate();
  const abortController = useMemo(() => new AbortController(), []);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`${host()}${endpoints.detailedRepoInfo(name)}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let repoInfo = response.data.data.ExpandedRepoInfo;
          let imageData = mapToRepoFromRepoInfo(repoInfo);
          setRepoDetailData(imageData);
          setTags(imageData.images);
        } else if (!isEmpty(response.data.errors)) {
          navigate('/home');
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setRepoDetailData({});
        setIsLoading(false);
        setTags([]);
      });
    return () => {
      abortController.abort();
    };
  }, [name]);

  const handleDeleteTag = (removed) => {
    setTags((prevState) => prevState.filter((tag) => tag.tag !== removed));
  };

  const handlePlatformChipClick = (event) => {
    const textContent = event.target.textContent;
    event.stopPropagation();
    event.preventDefault();
    navigate({ pathname: `/explore`, search: createSearchParams({ filter: textContent }).toString() });
  };

  const platformChips = () => {
    const platforms = repoDetailData?.platforms || [];
    const filteredPlatforms = platforms?.flatMap((platform) => [platform.Os, platform.Arch]);

    return uniq(filteredPlatforms).map((platform, index) => (
      <button
        key={`${name}${platform}${index}`}
        onClick={handlePlatformChipClick}
        className="bg-slate-800/85 hover:bg-slate-700 text-slate-350 hover:text-white text-xs font-semibold rounded px-2.5 py-0.5 border border-slate-800 transition cursor-pointer"
      >
        {platform}
      </button>
    ));
  };

  const handleBookmarkClick = () => {
    api.put(`${host()}${endpoints.bookmarkToggle(name)}`, abortController.signal).then((response) => {
      if (response && response.status === 200) {
        setRepoDetailData((prevState) => ({
          ...prevState,
          isBookmarked: !prevState.isBookmarked
        }));
      }
    });
  };

  const handleStarClick = () => {
    api.put(`${host()}${endpoints.starToggle(name)}`, abortController.signal).then((response) => {
      if (response.status === 200) {
        setRepoDetailData((prevState) => ({
          ...prevState,
          isStarred: !prevState.isStarred
        }));
      }
    });
  };

  const getVendor = () => {
    return `${repoDetailData.newestTag?.Vendor || 'Vendor not available'} •`;
  };
  const getVersion = () => {
    return `published ${repoDetailData.newestTag?.Tag} •`;
  };
  const getLast = () => {
    const lastDate = repoDetailData.lastUpdated
      ? DateTime.fromISO(repoDetailData.lastUpdated).toRelative({ unit: ['weeks', 'days', 'hours', 'minutes'] })
      : `Timestamp N/A`;
    return lastDate;
  };

  const getSignatureChips = () => {
    const cosign = repoDetailData.signatureInfo
      ?.map((s) => s.tool)
      .includes(filterConstants.signatureToolConstants.COSIGN)
      ? repoDetailData.signatureInfo.filter((si) => si.tool === filterConstants.signatureToolConstants.COSIGN)
      : null;
    const notation = repoDetailData.signatureInfo
      ?.map((s) => s.tool)
      .includes(filterConstants.signatureToolConstants.NOTATION)
      ? repoDetailData.signatureInfo.filter((si) => si.tool === filterConstants.signatureToolConstants.NOTATION)
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
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full flex flex-col gap-6 text-left">
          {/* Main Info Card */}
          <div className="bg-[#111827] border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={placeholderImage.current}
                  alt="icon"
                  className="w-8 h-8 object-contain rounded"
                />
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  {name}
                </h1>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <VulnerabilityIconCheck vulnerabilitySeverity={repoDetailData?.vulnerabilitySeverity} />
                  {getSignatureChips()}
                </div>

                <div className="h-6 w-px bg-slate-800 hidden sm:block" />

                <div className="flex items-center gap-1.5">
                  {isAuthenticated() && (
                    <button
                      onClick={handleStarClick}
                      className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-800/60 rounded-lg transition duration-150 cursor-pointer focus:outline-none"
                      data-testid="star-button"
                      aria-label="Star repository"
                    >
                      {repoDetailData?.isStarred ? (
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" data-testid="starred" />
                      ) : (
                        <Star className="w-5 h-5" data-testid="not-starred" />
                      )}
                    </button>
                  )}

                  {isAuthenticated() && (
                    <button
                      onClick={handleBookmarkClick}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800/60 rounded-lg transition duration-150 cursor-pointer focus:outline-none"
                      data-testid="bookmark-button"
                      aria-label="Bookmark repository"
                    >
                      {repoDetailData?.isBookmarked ? (
                        <Bookmark className="w-5 h-5 text-blue-500 fill-blue-500" data-testid="bookmarked" />
                      ) : (
                        <Bookmark className="w-5 h-5" data-testid="not-bookmarked" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Repo Subtitle/Title */}
            <p className="text-slate-400 text-sm">
              {repoDetailData?.title || 'Title not available'}
            </p>

            {/* Platform tag list */}
            <div className="flex flex-wrap items-center gap-2">
              {platformChips()}
            </div>

            {/* Detail row */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-800/40">
              <Tooltip title={getVendor()}>
                <span className="cursor-help">
                  <Markdown options={{ forceInline: true }}>{getVendor()}</Markdown>
                </span>
              </Tooltip>
              <Tooltip title={getVersion()}>
                <span className="cursor-help">{getVersion()}</span>
              </Tooltip>
              <Tooltip title={repoDetailData.lastUpdated?.slice(0, 16) || ' '}>
                <span className="cursor-help">{getLast()}</span>
              </Tooltip>
            </div>
          </div>

          {/* Grid Layout for Tags and Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Tags (left 2 cols) */}
            <div className="md:col-span-2 bg-[#111827] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <Tags tags={tags} repoName={name} onTagDelete={handleDeleteTag} />
            </div>

            {/* Metadata (right 1 col) */}
            <div className="md:col-span-1">
              <RepoDetailsMetadata
                totalDownloads={repoDetailData?.downloads}
                repoURL={repoDetailData?.source}
                lastUpdated={repoDetailData?.lastUpdated}
                size={repoDetailData?.size}
                latestTag={repoDetailData?.newestTag}
                license={repoDetailData?.license}
                description={repoDetailData?.description}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default RepoDetails;
