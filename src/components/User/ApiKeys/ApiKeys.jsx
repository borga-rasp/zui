import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { api, endpoints } from 'api';
import { host } from '../../../host';

import Loading from '../../Shared/Loading';
import ApiKeyDialog from './ApiKeyDialog';
import ApiKeyConfirmDialog from './ApiKeyConfirmDialog';
import ApiKeyCard from './ApiKeyCard';

function ApiKeys() {
  const abortController = useMemo(() => new AbortController(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState([]);
  const [newApiKey, setNewApiKey] = useState();

  // ApiKey dialog props
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKeyConfirmationOpen, setApiKeyConfirmationOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`${host()}${endpoints.apiKeys}`)
      .then((response) => {
        if (response.data && response.data.apiKeys) {
          setApiKeys(response.data.apiKeys);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
      });
    return () => {
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (!isNil(newApiKey) && !apiKeyConfirmationOpen) {
      setApiKeyConfirmationOpen(true);
    }
  }, [newApiKey]);

  const handleApiKeyDialogOpen = () => {
    setApiKeyDialogOpen(true);
  };

  const handleApiKeyCreateConfirm = (apiKey) => {
    setNewApiKey(apiKey);
    setApiKeys((prevState) => [...prevState, apiKey]);
  };

  const handleApiKeyRevokeConfirm = (status, apiKey) => {
    if (status === 200) setApiKeys((prevState) => prevState.filter((ak) => ak.uuid !== apiKey.uuid));
  };

  const renderApiKeys = () => {
    return apiKeys.map((apiKey) => (
      <ApiKeyCard key={apiKey.uuid} apiKey={apiKey} onRevoke={handleApiKeyRevokeConfirm} />
    ));
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full flex flex-col gap-6 text-left">
          {/* Header section */}
          <div className="MuiCard-root bg-bg-panel border border-slate-800/80 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                Manage your API Keys
              </h1>
              <button
                onClick={handleApiKeyDialogOpen}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 cursor-pointer focus:outline-none"
              >
                Create new API key
              </button>
            </div>
          </div>

          {/* API keys list card */}
          {!isLoading && !isEmpty(apiKeys) && (
            <div className="MuiCard-root bg-bg-panel border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col gap-3">
                {renderApiKeys()}
              </div>
            </div>
          )}

          <ApiKeyDialog 
            open={apiKeyDialogOpen} 
            setOpen={setApiKeyDialogOpen} 
            onConfirm={handleApiKeyCreateConfirm} 
          />
          {!isNil(newApiKey) && (
            <ApiKeyConfirmDialog 
              open={apiKeyConfirmationOpen} 
              setOpen={setApiKeyConfirmationOpen} 
              apiKey={newApiKey} 
            />
          )}
        </div>
      )}
    </>
  );
}

export default ApiKeys;
