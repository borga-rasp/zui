import { api, endpoints } from 'api';
import { host } from '../../host';
import React, { useEffect, useMemo, useState } from 'react';
import RepoCard from '../Shared/RepoCard';
import { mapToRepo } from 'utilities/objectModels';
import Loading from '../Shared/Loading';
import { useNavigate, createSearchParams } from 'react-router';
import { sortByCriteria } from 'utilities/sortCriteria';
import {
  HOME_POPULAR_PAGE_SIZE,
  HOME_RECENT_PAGE_SIZE,
  HOME_BOOKMARKS_PAGE_SIZE,
  HOME_STARS_PAGE_SIZE
} from 'utilities/paginationConstants';
import { isEmpty } from 'lodash';
import NoDataComponent from 'components/Shared/NoDataComponent';

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [popularData, setPopularData] = useState([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [recentData, setRecentData] = useState([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(true);
  const [bookmarkData, setBookmarkData] = useState([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(true);
  const [starData, setStarData] = useState([]);
  const [isLoadingStars, setIsLoadingStars] = useState(true);

  const navigate = useNavigate();
  const abortController = useMemo(() => new AbortController(), []);

  const getPopularData = () => {
    setIsLoadingPopular(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: '',
          pageNumber: 1,
          pageSize: HOME_POPULAR_PAGE_SIZE,
          sortBy: sortByCriteria.downloads?.value
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setPopularData(repoData);
          setIsLoading(false);
          setIsLoadingPopular(false);
        }
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setIsLoadingPopular(false);
      });
  };

  const getRecentData = () => {
    setIsLoadingRecent(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: '',
          pageNumber: 1,
          pageSize: HOME_RECENT_PAGE_SIZE,
          sortBy: sortByCriteria.updateTime?.value
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setRecentData(repoData);
          setIsLoading(false);
          setIsLoadingRecent(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setIsLoadingRecent(false);
        console.error(e);
      });
  };

  const getBookmarks = () => {
    setIsLoadingBookmarks(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: '',
          pageNumber: 1,
          pageSize: HOME_BOOKMARKS_PAGE_SIZE,
          sortBy: sortByCriteria.relevance?.value,
          filter: { IsBookmarked: true }
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setBookmarkData(repoData);
          setIsLoading(false);
          setIsLoadingBookmarks(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setIsLoadingBookmarks(false);
        console.error(e);
      });
  };

  const getStars = () => {
    setIsLoadingStars(true);
    api
      .get(
        `${host()}${endpoints.globalSearch({
          searchQuery: '',
          pageNumber: 1,
          pageSize: HOME_STARS_PAGE_SIZE,
          sortBy: sortByCriteria.relevance?.value,
          filter: { IsStarred: true }
        })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let repoList = response.data.data.GlobalSearch.Repos;
          let repoData = repoList.map((responseRepo) => {
            return mapToRepo(responseRepo);
          });
          setStarData(repoData);
          setIsLoading(false);
          setIsLoadingStars(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setIsLoadingStars(false);
        console.error(e);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);
    getPopularData();
    getRecentData();
    getBookmarks();
    getStars();
    return () => {
      abortController.abort();
    };
  }, []);

  const handleClickViewAll = (type, value) => {
    navigate({ pathname: `/explore`, search: createSearchParams({ [type]: value }).toString() });
  };

  const isNoData = () =>
    !isLoading &&
    !isLoadingBookmarks &&
    !isLoadingStars &&
    !isLoadingPopular &&
    !isLoadingRecent &&
    bookmarkData.length === 0 &&
    starData.length === 0 &&
    popularData.length === 0 &&
    recentData.length === 0;

  const renderCards = (cardArray) => {
    return (
      <div className="w-full flex flex-col gap-4">
        {cardArray &&
          cardArray.map((item, index) => {
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

  const renderContent = () => {
    return isNoData() === true ? (
      <NoDataComponent text="No images" />
    ) : (
      <div className="w-full flex flex-col items-center gap-12 mt-4 pb-20">
        {/* Most popular Section */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-row justify-between items-end border-b border-slate-800 pb-3">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
              Most popular images
            </h2>
            <button
              onClick={() => handleClickViewAll('sortby', sortByCriteria.downloads.value)}
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
            >
              View all
            </button>
          </div>
          {isLoadingPopular ? <Loading /> : renderCards(popularData)}
        </div>

        {/* Recently updated Section */}
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-row justify-between items-end border-b border-slate-800 pb-3">
            <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
              Recently updated images
            </h2>
            <button
              onClick={() => handleClickViewAll('sortby', sortByCriteria.updateTime.value)}
              className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
            >
              View all
            </button>
          </div>
          {isLoadingRecent ? <Loading /> : renderCards(recentData)}
        </div>

        {/* Bookmarks Section */}
        {!isEmpty(bookmarkData) && (
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-row justify-between items-end border-b border-slate-800 pb-3">
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                Bookmarks
              </h2>
              <button
                onClick={() => handleClickViewAll('filter', 'IsBookmarked')}
                className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
              >
                View all
              </button>
            </div>
            {isLoadingBookmarks ? <Loading /> : renderCards(bookmarkData)}
          </div>
        )}

        {/* Stars Section */}
        {!isEmpty(starData) && (
          <div className="w-full flex flex-col gap-6">
            <div className="flex flex-row justify-between items-end border-b border-slate-800 pb-3">
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                Stars
              </h2>
              <button
                onClick={() => handleClickViewAll('filter', 'IsStarred')}
                className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition cursor-pointer"
              >
                View all
              </button>
            </div>
            {isLoadingStars ? <Loading /> : renderCards(starData)}
          </div>
        )}
      </div>
    );
  };

  return <>{isLoading ? <Loading /> : renderContent()}</>;
}

export default Home;
