import { useLocation, useNavigate, useParams } from 'react-router';
import React, { useEffect, useMemo, useState, useRef } from 'react';

// utility
import { api, endpoints } from '../../api';
import { host } from '../../host';
import { mapToImage } from '../../utilities/objectModels';
import filterConstants from 'utilities/filterConstants';
import { isEmpty, head, uniqBy } from 'lodash';

// components
import TagDetailsMetadata from './TagDetailsMetadata';
import VulnerabilitiesDetails from './Tabs/VulnerabilitiesDetails';
import HistoryLayers from './Tabs/HistoryLayers';
import DependsOn from './Tabs/DependsOn';
import IsDependentOn from './Tabs/IsDependentOn';
import Loading from '../Shared/Loading';
import { VulnerabilityIconCheck, SignatureIconCheck } from 'utilities/vulnerabilityAndSignatureCheck';
import ReferredBy from './Tabs/ReferredBy';

// placeholder images
import repocube1 from '../../assets/repocube-1.png';
import repocube2 from '../../assets/repocube-2.png';
import repocube3 from '../../assets/repocube-3.png';
import repocube4 from '../../assets/repocube-4.png';

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

// temporary utility to get image
const randomIntFromInterval = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const randomImage = () => {
  const imageArray = [repocube1, repocube2, repocube3, repocube4];
  return imageArray[randomIntFromInterval(0, 3)];
};

function TagDetails() {
  const [imageDetailData, setImageDetailData] = useState({});
  const [selectedManifest, setSelectedManifest] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('Layers');
  const placeholderImage = useRef(randomImage());
  const abortController = useMemo(() => new AbortController(), []);
  const navigate = useNavigate();

  // check for optional preselected digest
  const { state } = useLocation() || {};
  const { digest } = state || '';

  // get url param from <Route here (i.e. image name)
  const { reponame, tag } = useParams();

  useEffect(() => {
    setSelectedTab('Layers');
    window?.scrollTo(0, 0);
    setIsLoading(true);
    api
      .get(`${host()}${endpoints.detailedImageInfo(reponame, tag)}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let imageInfo = response.data.data.Image;
          let imageData = mapToImage(imageInfo);
          setImageDetailData(imageData);
          if (!isEmpty(digest)) {
            const preselectedManifest = imageData.manifests?.find((el) => el.digest === digest);
            if (preselectedManifest) {
              setSelectedManifest(preselectedManifest);
            } else {
              setSelectedManifest(head(imageData.manifests));
            }
          } else {
            setSelectedManifest(head(imageData.manifests));
          }
        } else if (!isEmpty(response.data.errors)) {
          navigate('/home');
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setImageDetailData({});
        setIsLoading(false);
      });
    return () => {
      abortController.abort();
    };
  }, [reponame, tag]);

  const getPlatform = () => {
    return selectedManifest?.platform ? selectedManifest.platform : '--/--';
  };

  const handleOSArchChange = (e) => {
    const { value } = e.target;
    const manifest = imageDetailData?.manifests?.find((m) => m.digest === value);
    if (manifest) {
      setSelectedManifest(manifest);
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'DependsOn':
        return <DependsOn name={imageDetailData?.name} digest={selectedManifest?.digest} />;
      case 'IsDependentOn':
        return <IsDependentOn name={imageDetailData?.name} digest={selectedManifest?.digest} />;
      case 'Vulnerabilities':
        return (
          <VulnerabilitiesDetails
            name={reponame}
            tag={tag}
            digest={selectedManifest?.digest}
            platform={selectedManifest?.platform}
          />
        );
      case 'ReferredBy':
        const allReferrers = uniqBy(
          [...(selectedManifest?.referrers || []), ...(imageDetailData?.referrers || [])],
          'digest'
        );
        return <ReferredBy referrers={allReferrers} />;
      default:
        return <HistoryLayers name={imageDetailData?.name} history={selectedManifest?.history || []} />;
    }
  };

  const getSignatureChips = () => {
    const cosign = imageDetailData?.signatureInfo
      ?.map((s) => s.tool)
      ?.includes(filterConstants.signatureToolConstants.COSIGN)
      ? imageDetailData?.signatureInfo?.filter((si) => si.tool === filterConstants.signatureToolConstants.COSIGN)
      : null;
    const notation = imageDetailData?.signatureInfo
      ?.map((s) => s.tool)
      ?.includes(filterConstants.signatureToolConstants.NOTATION)
      ? imageDetailData?.signatureInfo?.filter((si) => si.tool === filterConstants.signatureToolConstants.NOTATION)
      : null;
    const sigArray = [];
    if (cosign) sigArray.push(cosign);
    if (notation) sigArray.push(notation);
    if (sigArray.length === 0) return <SignatureIconCheck />;
    return sigArray.map((sig, index) => (
      <div className="hidden sm:inline-flex" key={`${imageDetailData?.name || ''}sig${index}`}>
        <SignatureIconCheck signatureInfo={sig} />
      </div>
    ));
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full flex flex-col gap-6 text-left" data-testid="tag-container">
          {/* Main Info Card */}
          <div className="MuiCard-root bg-bg-panel border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={placeholderImage.current}
                  alt="icon"
                  className="w-8 h-8 object-contain rounded"
                />
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                  <span className="hidden sm:inline">{reponame}</span>:{tag}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <VulnerabilityIconCheck
                  vulnerabilitySeverity={imageDetailData?.vulnerabiltySeverity}
                  count={imageDetailData?.vulnerabilityCount}
                />
                {getSignatureChips()}
              </div>
            </div>

            {/* OS/Arch and Digest */}
            {imageDetailData?.manifests && imageDetailData.manifests.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-4 border-t border-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">OS/Arch</span>
                  <select
                    value={selectedManifest?.digest}
                    onChange={handleOSArchChange}
                    className="bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {imageDetailData?.manifests?.map((el) => (
                      <option key={el.digest} value={el.digest}>
                        {`${el.platform?.Os || '----'}/${el.platform?.Arch || '----'}`}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-xs text-slate-500 truncate">
                  Digest: {selectedManifest?.digest}
                </span>
              </div>
            )}
          </div>

          {/* Toggle buttons for tabs */}
          <div className="flex border border-slate-800/80 bg-slate-900/60 rounded-xl p-1 self-start" role="tablist">
            {[
              { value: 'Layers', label: 'Layers' },
              { value: 'DependsOn', label: 'Uses', testId: 'dependencies-tab' },
              { value: 'IsDependentOn', label: 'Used by' },
              { value: 'Vulnerabilities', label: 'Vulnerabilities' },
              { value: 'ReferredBy', label: 'Referred by' }
            ].map((tab) => (
              <button
                key={tab.value}
                role="tab"
                data-testid={tab.testId}
                aria-selected={selectedTab === tab.value}
                onClick={() => setSelectedTab(tab.value)}
                className={`px-4 py-2.5 text-xs font-bold rounded-lg transition duration-150 cursor-pointer focus:outline-none ${
                  selectedTab === tab.value
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main layout: Tab Content (left) and Metadata (right) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Tab content */}
            <div className="MuiCard-root md:col-span-2 bg-bg-panel border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              {renderTabContent()}
            </div>

            {/* Metadata column */}
            <div className="md:col-span-1">
              <TagDetailsMetadata
                platform={getPlatform()}
                size={selectedManifest?.size}
                lastUpdated={selectedManifest?.lastUpdated}
                lastTagged={imageDetailData?.lastTagged}
                license={imageDetailData?.license}
                imageName={imageDetailData?.name}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TagDetails;
