import React, { useEffect, useMemo, useState, useRef } from 'react';

// utility
import { api, endpoints } from '../../../api';

// components
import { host } from '../../../host';
import { debounce, isEmpty } from 'lodash';
import Loading from '../../Shared/Loading';
import { mapCVEInfo, mapAllCVEInfo } from 'utilities/objectModels';
import { EXPLORE_PAGE_SIZE } from 'utilities/paginationConstants';
import { Download, List, LayoutList, Search, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';

import * as XLSX from 'xlsx';
import exportFromJSON from 'export-from-json';

import VulnerabilitiyCard from '../../Shared/VulnerabilityCard';
import VulnerabilityCountCard from '../../Shared/VulnerabilityCountCard';

function VulnerabilitiesDetails(props) {
  const [cveData, setCveData] = useState([]);
  const [allCveData, setAllCveData] = useState([]);
  const [cveSummary, setCVESummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAllCve, setIsLoadingAllCve] = useState(false);
  const abortController = useMemo(() => new AbortController(), []);
  const { name, tag, digest, platform } = props;

  const [openExcludeSearch, setOpenExcludeSearch] = useState(false);

  // pagination props
  const [cveFilter, setCveFilter] = useState('');
  const [cveExcludeFilter, setCveExcludeFilter] = useState('');
  const [cveSeverityFilter, setCveSeverityFilter] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const listBottom = useRef(null);

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef(null);

  const [selectedViewMore, setSelectedViewMore] = useState(false);

  const getCVERequestName = () => {
    return digest !== '' ? `${name}@${digest}` : `${name}:${tag}`;
  };

  const getPaginatedCVEs = () => {
    api
      .get(
        `${host()}${endpoints.vulnerabilitiesForRepo(
          getCVERequestName(),
          { pageNumber, pageSize: EXPLORE_PAGE_SIZE },
          cveFilter,
          cveExcludeFilter,
          cveSeverityFilter
        )}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let cveInfo = response.data.data.CVEListForImage?.CVEList;
          let summary = response.data.data.CVEListForImage?.Summary;
          let cveListData = mapCVEInfo(cveInfo);
          setCveData((previousState) => (pageNumber === 1 ? cveListData : [...previousState, ...cveListData]));
          setIsEndOfList(response.data.data.CVEListForImage.Page?.ItemCount < EXPLORE_PAGE_SIZE);
          setCVESummary((previousState) => {
            if (isEmpty(summary)) {
              return previousState;
            }
            return {
              Count: summary.Count,
              UnknownCount: summary.UnknownCount,
              LowCount: summary.LowCount,
              MediumCount: summary.MediumCount,
              HighCount: summary.HighCount,
              CriticalCount: summary.CriticalCount
            };
          });
        } else if (response.data.errors) {
          setIsEndOfList(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setCveData([]);
        setCVESummary(() => {});
        setIsEndOfList(true);
      });
  };

  const getAllCVEs = () => {
    setIsLoadingAllCve(true);
    api
      .get(`${host()}${endpoints.allVulnerabilitiesForRepo(getCVERequestName())}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          const cveInfo = response.data.data.CVEListForImage?.CVEList;
          const cveListData = mapAllCVEInfo(cveInfo);
          setAllCveData(cveListData);
        }
        setIsLoadingAllCve(false);
      })
      .catch((e) => {
        console.error(e);
        setAllCveData([]);
        setIsLoadingAllCve(false);
      });
  };

  const resetPagination = () => {
    setIsLoading(true);
    setIsEndOfList(false);
    if (pageNumber !== 1) {
      setPageNumber(1);
    } else {
      getPaginatedCVEs();
    }
  };

  const handleOnExportExcel = () => {
    const wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(allCveData);

    XLSX.utils.book_append_sheet(wb, ws, 'vulnerabilities');
    XLSX.writeFile(wb, `${name}:${tag}-vulnerabilities.xlsx`);
    setIsExportMenuOpen(false);
  };

  const handleOnExportCSV = () => {
    const fileName = `${name}:${tag}-vulnerabilities`;
    const exportType = exportFromJSON.types.csv;

    exportFromJSON({ data: allCveData, fileName, exportType });
    setIsExportMenuOpen(false);
  };

  const handleCveFilterChange = (e) => {
    const { value } = e.target;
    setCveFilter(value);
  };

  const handleCveExcludeFilterChange = (e) => {
    const { value } = e.target;
    setCveExcludeFilter(value);
  };

  const debouncedChangeHandler = useMemo(() => debounce(handleCveFilterChange, 300));
  const debouncedExcludeFilterChangeHandler = useMemo(() => debounce(handleCveExcludeFilterChange, 300));

  useEffect(() => {
    getPaginatedCVEs();
  }, [pageNumber]);

  // setup intersection observer for infinite scroll
  useEffect(() => {
    if (isLoading || isEndOfList) return;
    const handleIntersection = (entries) => {
      if (isLoading || isEndOfList) return;
      const [target] = entries;
      if (target?.isIntersecting) {
        setPageNumber((pageNumber) => pageNumber + 1);
      }
    };
    const intersectionObserver = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '0px',
      threshold: 0
    });

    if (listBottom.current) {
      intersectionObserver.observe(listBottom.current);
    }

    return () => {
      intersectionObserver.disconnect();
    };
  }, [isLoading, isEndOfList]);

  useEffect(() => {
    if (isLoading) return;
    resetPagination();
  }, [cveFilter, cveExcludeFilter, cveSeverityFilter]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setIsExportMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      abortController.abort();
      debouncedChangeHandler.cancel();
      debouncedExcludeFilterChangeHandler.cancel();
    };
  }, []);

  useEffect(() => {
    if (isExportMenuOpen && isEmpty(allCveData)) {
      getAllCVEs();
    }
  }, [isExportMenuOpen]);

  const renderCVEs = () => {
    return !isEmpty(cveData) ? (
      cveData.map((cve, index) => {
        return <VulnerabilitiyCard key={index} cve={cve} name={name} platform={platform} expand={selectedViewMore} />;
      })
    ) : (
      <div>{!isLoading && <div className="text-slate-400 font-medium py-6 text-center"> No Vulnerabilities </div>}</div>
    );
  };

  const renderCVESummary = () => {
    if (cveSummary === undefined) {
      return;
    }
    return !isEmpty(cveSummary) ? (
      <VulnerabilityCountCard
        total={cveSummary.Count}
        critical={cveSummary.CriticalCount}
        high={cveSummary.HighCount}
        medium={cveSummary.MediumCount}
        low={cveSummary.LowCount}
        unknown={cveSummary.UnknownCount}
        filterBySeverity={setCveSeverityFilter}
      />
    ) : null;
  };

  const renderListBottom = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (!isLoading && !isEndOfList) {
      return <div ref={listBottom} className="h-4" />;
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-4 text-left" data-testid="vulnerability-container">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2 flex-wrap sm:flex-nowrap gap-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          Vulnerabilities
        </h2>

        <div className="flex items-center gap-2 self-end">
          {/* Export Menu Dropdown */}
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer focus:outline-none"
              aria-label="Export vulnerabilities"
            >
              <Download className="w-5 h-5" data-testid="DownloadIcon" />
            </button>
            {isExportMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-28 bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 animate-in fade-in duration-100"
                data-testid="export-dropdown"
              >
                <button
                  onClick={handleOnExportCSV}
                  disabled={isLoadingAllCve}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition disabled:opacity-50 cursor-pointer"
                  data-testid="export-csv-menuItem"
                >
                  csv
                </button>
                <div className="border-t border-slate-800/60" />
                <button
                  onClick={handleOnExportExcel}
                  disabled={isLoadingAllCve}
                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition disabled:opacity-50 cursor-pointer"
                  data-testid="export-excel-menuItem"
                >
                  xlsx
                </button>
              </div>
            )}
          </div>

          {/* Export preparation Toast */}
          {isExportMenuOpen && isLoadingAllCve && (
            <div className="fixed bottom-4 right-4 bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg py-2.5 px-4 shadow-xl flex items-center gap-3 z-50">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span>Getting your data ready for export</span>
            </div>
          )}

          <div className="h-6 w-px bg-slate-800" />

          {/* View Modes Toggle */}
          <div className="flex border border-slate-800 bg-slate-950 rounded-lg p-0.5">
            <button
              onClick={() => setSelectedViewMore(false)}
              className={`p-1.5 rounded transition cursor-pointer focus:outline-none ${
                !selectedViewMore
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
              title="Collapse list view"
            >
              <List className="w-4 h-4" data-testid="ViewHeadlineIcon" />
            </button>
            <button
              onClick={() => setSelectedViewMore(true)}
              className={`p-1.5 rounded transition cursor-pointer focus:outline-none ${
                selectedViewMore
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-350'
              }`}
              title="Expand list view"
              data-testid="expand-list-view-toggle"
            >
              <LayoutList className="w-4 h-4" data-testid="ViewAgendaIcon" />
            </button>
          </div>
        </div>
      </div>

      {renderCVESummary()}

      {/* Filter and Search Bar */}
      <div className="flex items-start gap-2">
        <button
          onClick={() => setOpenExcludeSearch(!openExcludeSearch)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition shrink-0 mt-0.5 cursor-pointer focus:outline-none"
        >
          {openExcludeSearch ? (
            <ChevronDown className="w-5 h-5" data-testid="KeyboardArrowDownIcon" />
          ) : (
            <ChevronRight className="w-5 h-5" data-testid="KeyboardArrowRightIcon" />
          )}
        </button>

        <div className="flex-1 flex flex-col gap-2">
          {/* Main search */}
          <div>
            <div className="flex items-center justify-between border border-slate-800 bg-slate-900/60 rounded-lg px-3.5 py-2">
              <input
                placeholder="Search"
                onChange={debouncedChangeHandler}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
            </div>
          </div>

          {/* Exclude search panel */}
          {openExcludeSearch && (
            <div className="flex items-center justify-between border border-slate-800 bg-slate-900/60 rounded-lg px-3.5 py-2 animate-in slide-in-from-top-1 duration-100">
              <input
                placeholder="Exclude"
                onChange={debouncedExcludeFilterChangeHandler}
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* CVE items list */}
      <div className={`flex flex-col ${selectedViewMore ? 'gap-4' : 'gap-2'} mt-2`}>
        {renderCVEs()}
        {renderListBottom()}
      </div>
    </div>
  );
}

export default VulnerabilitiesDetails;
