import React, { useEffect, useMemo, useState, useRef } from 'react';
import { isEmpty } from 'lodash';

// utility
import { api, endpoints } from '../../../api';

// components
import { host } from '../../../host';
import Loading from '../../Shared/Loading';
import TagCard from '../../Shared/TagCard';
import { mapToImage } from 'utilities/objectModels';
import { EXPLORE_PAGE_SIZE } from 'utilities/paginationConstants';

function IsDependentOn(props) {
  const [images, setImages] = useState([]);
  const { name } = props;
  const [isLoading, setIsLoading] = useState(true);
  const abortController = useMemo(() => new AbortController(), []);

  // pagination props
  const [pageNumber, setPageNumber] = useState(1);
  const [isEndOfList, setIsEndOfList] = useState(false);
  const listBottom = useRef(null);

  const getPaginatedResults = () => {
    setIsLoading(true);
    api
      .get(
        `${host()}${endpoints.isDependentOnForImage(name, { pageNumber, pageSize: EXPLORE_PAGE_SIZE })}`,
        abortController.signal
      )
      .then((response) => {
        if (response.data && response.data.data) {
          let imagesData = response.data.data.DerivedImageList?.Results?.map((img) => mapToImage(img));
          const newImageList = [...images, ...imagesData];
          setImages(newImageList);
          setIsEndOfList(
            response.data.data.DerivedImageList?.Page?.ItemCount < EXPLORE_PAGE_SIZE ||
              newImageList.length >= response.data.data.DerivedImageList?.Page?.TotalCount
          );
        } else if (response.data.errors) {
          setIsEndOfList(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setIsEndOfList(true);
      });
  };

  useEffect(() => {
    getPaginatedResults();
    return () => {
      abortController.abort();
    };
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

  const renderDependents = () => {
    return !isEmpty(images) ? (
      images?.map((dependence, index) => {
        return (
          <TagCard
            repoName={dependence.repoName}
            tag={dependence.tag}
            vendor={dependence.vendor}
            signatureInfo={dependence.signatureInfo}
            manifests={dependence.manifests}
            key={index}
            lastUpdated={dependence.lastUpdated}
          />
        );
      })
    ) : (
      <div>{!isLoading && <div className="text-slate-400 font-medium py-6 text-center"> Nothing found </div>}</div>
    );
  };

  const renderListBottom = () => {
    if (isLoading) {
      return <Loading />;
    }
    if (!isLoading && !isEndOfList) {
      return <div ref={listBottom} className="h-4" />;
    }
    return '';
  };

  return (
    <div data-testid="dependents-container" className="flex flex-col gap-4 text-left">
      <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-3 mb-2">
        Used by
      </h2>
      <div className="flex flex-col gap-3">
        {renderDependents()}
        {renderListBottom()}
      </div>
    </div>
  );
}

export default IsDependentOn;
