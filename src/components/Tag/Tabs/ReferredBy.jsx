import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import ReferrerCard from '../../Shared/ReferrerCard';
import Loading from '../../Shared/Loading';
import { mapReferrer } from 'utilities/objectModels';

function ReferredBy(props) {
  const { referrers } = props;
  const [referrersData, setReferrersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isEmpty(referrers)) {
      const mappedReferrersData = referrers.map((referrer) => mapReferrer(referrer));
      setReferrersData(mappedReferrersData);
    } else {
      setReferrersData([]);
    }
    setIsLoading(false);
  }, []);

  const renderReferrers = () => {
    return !isEmpty(referrersData) ? (
      referrersData.map((referrer, index) => {
        return (
          <ReferrerCard
            key={index}
            artifactType={referrer.artifactType}
            mediaType={referrer.mediaType}
            size={referrer.size}
            digest={referrer.digest}
            annotations={referrer.annotations}
          />
        );
      })
    ) : (
      <div>{!isLoading && <div className="text-slate-400 font-medium py-6 text-center"> Nothing found </div>}</div>
    );
  };

  return (
    <div data-testid="referred-by-container" className="flex flex-col gap-4 text-left">
      <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-3 mb-2">
        Referred By
      </h2>
      <div className="flex flex-col gap-3">
        {isLoading ? <Loading /> : renderReferrers()}
      </div>
    </div>
  );
}

export default ReferredBy;
