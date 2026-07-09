// react global
import React, { useEffect, useMemo, useRef, useState } from 'react';

// components
import RepoCard from '../Shared/RepoCard.jsx';
import Loading from '../Shared/Loading';
import Sticky from 'react-sticky-el';

// utility
import { api, endpoints } from '../../api';
import { host } from '../../host';
import { mapToRepo } from 'utilities/objectModels.js';
import { useSearchParams } from 'react-router';
import FilterCard from '../Shared/FilterCard.jsx';
import { isEmpty, isNil } from 'lodash';
import filterConstants from 'utilities/filterConstants.js';
import { sortByCriteria } from 'utilities/sortCriteria.js';
import { EXPLORE_PAGE_SIZE } from 'utilities/paginationConstants.js';
import FilterDialog from './FilterDialog.jsx';

// Custom Select Component to match MUI tests expectations but using Tailwind
const CustomSelect = ({ value, onChange, options, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const selectedOption = Object.values(options).find((o) => o.value === value) || Object.values(options)[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-[200px]" ref={dropdownRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-slate-200 hover:text-white rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-blue-500 transition duration-150 cursor-pointer text-left"
      >
        <span>{selectedOption?.label}</span>
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && !disabled && (
        <div className="absolute right-0 mt-1 w-full bg-slate-900 border border-slate-800 rounded-lg shadow-xl py-1 z-50 max-h-60 overflow-y-auto">
          {Object.values(options).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange({ target: { value: option.value } });
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition cursor-pointer ${
                option.value === value ? 'bg-blue-600 text-white font-semibold' : 'text-slate-350 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function Explore({ searchInputValue }) {
  const [isLoading, setIsLoading] = useState(true);
  const [exploreData, setExploreData] = useState([]);
  const [sortFilter, setSortFilter] = useState(sortByCriteria.relevance.value);
  const [queryParams] = useSearchParams();
  const search = queryParams.get('search');
  
  // filtercard filters
  const [imageFilters, setImageFilters] = useState({});
  const [osFilters, setOSFilters] = useState([]);
  const [archFilters, setArchFilters] = useState([]);
  
  // pagination props
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const listBottom = useRef(null);
  const abortController = useMemo(() => new AbortController(), []);

  // Filterdialog props
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  const buildFilterQuery = () => {
    let filter = {};
    filter = !isEmpty(osFilters) ? { ...filter, Os: osFilters } : filter;
    filter = !isEmpty(archFilters) ? { ...filter, Arch: archFilters } : filter;
    if (!isEmpty(Object.keys(imageFilters))) {
      filter = { ...filter, ...imageFilters };
    }
    return filter;
  };

  const deconstructFilterQuery = () => {
    const preselectedFilter = queryParams.get('filter');
    if (!isEmpty(preselectedFilter)) {
      if (filterConstants.osFilters.map((f) => f.value).includes(preselectedFilter)) {
        setOSFilters([...osFilters, preselectedFilter]);
      } else if (filterConstants.archFilters.map((f) => f.value).includes(preselectedFilter)) {
        setArchFilters([...archFilters, preselectedFilter]);
      } else if (filterConstants.imageFilters.map((f) => f.value).includes(preselectedFilter)) {
        setImageFilters({ ...imageFilters, [preselectedFilter]: true });
      }
      queryParams.delete('filter');
    }
    const preselectedSortOrder = queryParams.get('sortby');
    if (!isEmpty(preselectedSortOrder)) {
      const sortFilterValue = Object.values(sortByCriteria).find((sbc) => sbc.value === preselectedSortOrder);
      if (sortFilterValue) {
        setSortFilter(sortFilterValue.value);
      }
      queryParams.delete('sortby');
    }
  };

  useEffect(() => {
    let isCurrent = true;
    setIsLoading(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: !isNil(searchInputValue) ? searchInputValue : search,
          pageNumber,
          pageSize: EXPLORE_PAGE_SIZE,
          sortBy: sortFilter,
          filter: buildFilterQuery()
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (!isCurrent) return;
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setTotalItems(response.data.data.GlobalSearch.Page?.TotalCount);
          setIsEndOfList(response.data.data.GlobalSearch.Page?.ItemCount < EXPLORE_PAGE_SIZE);
          if (pageNumber === 1) {
            setExploreData(repoData);
          } else {
            setExploreData((previousState) => [...previousState, ...repoData]);
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        if (!isCurrent) return;
        console.error(e);
        setIsLoading(false);
        setIsEndOfList(true);
      });
    return () => {
      isCurrent = false;
      abortController.abort();
    };
  }, [pageNumber, search, imageFilters, osFilters, archFilters, sortFilter]);

  useEffect(() => {
    setPageNumber(1);
  }, [search, imageFilters, osFilters, archFilters, sortFilter]);

  useEffect(() => {
    if (isLoading) return;
    deconstructFilterQuery();
  }, [queryParams, isLoading]);

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

  const handleSortChange = (event) => {
    setSortFilter(event.target.value);
  };

  const handleFilterDialogOpen = () => {
    setFilterDialogOpen(true);
  };

  const renderRepoCards = () => {
    return (
      <div className="flex flex-col gap-4">
        {exploreData &&
          exploreData.map((item, index) => {
            return (
              <RepoCard
                name={item.name}
                version={item.latestVersion}
                description={item.description}
                downloads={item.downloads}
                stars={item.stars}
                signatureInfo={item.signatureInfo}
                isBookmarked={item.isBookmarked}
                isStarred={item.isStarred}
                vendor={item.vendor}
                platforms={item.platforms}
                key={index}
                vulnerabilityData={{
                  vulnerabilitySeverity: item.vulnerabiltySeverity,
                  count: item.vulnerabilityCount
                }}
                lastUpdated={item.lastUpdated}
                logo={item.logo}
              />
            );
          })}
      </div>
    );
  };

  const renderFilterCards = () => {
    return (
      <div className="flex flex-col gap-4">
        <FilterCard
          title="Operating system"
          filters={filterConstants.osFilters}
          filterValue={osFilters}
          updateFilters={setOSFilters}
          wrapperLoading={isLoading}
        />
        <FilterCard
          title="Architectures"
          filters={filterConstants.archFilters}
          filterValue={archFilters}
          updateFilters={setArchFilters}
          wrapperLoading={isLoading}
        />
        <FilterCard
          title="Additional filters"
          filters={filterConstants.imageFilters}
          filterValue={imageFilters}
          updateFilters={setImageFilters}
          wrapperLoading={isLoading}
        />
      </div>
    );
  };

  const renderListBottom = () => {
    if (isLoading) {
      return filterDialogOpen ? <div /> : <Loading />;
    }
    if (!isLoading && !isEndOfList) {
      return <div ref={listBottom} className="h-4" />;
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <span className="text-sm font-semibold text-slate-400 hidden md:block">
          Showing {exploreData?.length} results out of {totalItems}
        </span>
        
        {!isLoading && (
          <button
            onClick={handleFilterDialogOpen}
            className="md:hidden w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 cursor-pointer"
          >
            Filter results
          </button>
        )}

        <div className="hidden md:flex items-center gap-2 self-end">
          <span className="text-sm font-semibold text-slate-400 mr-2">Sort By</span>
          <CustomSelect
            options={sortByCriteria}
            value={sortFilter}
            onChange={handleSortChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left column: Sticky filters */}
        <aside className="hidden md:block md:col-span-1">
          <Sticky stickyClassName="sticky-wrapper" topOffset={-80}>
            <div className="space-y-4">
              {renderFilterCards()}
            </div>
          </Sticky>
        </aside>

        {/* Right column: Results list */}
        <div className="col-span-1 md:col-span-3">
          {!(exploreData && exploreData.length) && !isLoading ? (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm rounded-xl p-4 text-left">
              Looks like we don't have anything matching that search. Try searching something else.
            </div>
          ) : (
            <div className="flex flex-col">
              {renderRepoCards()}
              {renderListBottom()}
            </div>
          )}
        </div>
      </div>

      <FilterDialog
        open={filterDialogOpen}
        setOpen={setFilterDialogOpen}
        sortValue={sortFilter}
        setSortValue={setSortFilter}
        renderFilterCards={renderFilterCards}
      />
    </div>
  );
}

export default Explore;
