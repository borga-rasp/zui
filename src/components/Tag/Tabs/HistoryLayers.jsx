import React, { useEffect, useMemo, useState } from 'react';
import LayerCard from '../../Shared/LayerCard.jsx';
import Loading from '../../Shared/Loading';

function HistoryLayers(props) {
  const [historyData, setHistoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const abortController = useMemo(() => new AbortController(), []);
  const { name, history } = props;

  useEffect(() => {
    setHistoryData(history);
    setIsLoading(false);
    return () => {
      abortController.abort();
    };
  }, [name, history]);

  return (
    <div className="flex flex-col gap-4 text-left">
      <h2 className="text-xl font-bold text-white tracking-tight border-b border-slate-800 pb-3 mb-2">
        Layers
      </h2>
      
      {isLoading ? (
        <Loading />
      ) : (
        <div className="flex flex-col gap-3" data-testid="layer-card-container">
          {historyData?.length > 0 ? (
            historyData.map((layer, index) => {
              return (
                <LayerCard
                  key={`${layer?.Layer?.Size}${index}`}
                  index={index + 1}
                  layer={layer?.Layer}
                  historyDescription={layer?.HistoryDescription}
                />
              );
            })
          ) : (
            <div className="text-slate-400 font-medium py-6 text-center">
              No Layer data available
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HistoryLayers;
