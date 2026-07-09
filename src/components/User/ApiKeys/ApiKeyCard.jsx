import React, { useState } from 'react';
import { DateTime } from 'luxon';
import { isNil } from 'lodash';
import { ChevronRight, ChevronDown } from 'lucide-react';
import ApiKeyRevokeDialog from './ApiKeyRevokeDialog';

function ApiKeyCard(props) {
  const { apiKey, onRevoke } = props;
  const [openDropdown, setOpenDropdown] = useState(false);
  const [apiKeyRevokeOpen, setApiKeyRevokeOpen] = useState(false);

  const getExpirationDisplay = () => {
    const expDateTime = DateTime.fromISO(apiKey.expirationDate);
    return `Expires on ${expDateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}`;
  };

  const handleApiKeyRevokeDialogOpen = () => {
    setApiKeyRevokeOpen(true);
  };

  return (
    <div className="MuiCard-root w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 text-left shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Label & Expiration */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white truncate">
            {apiKey.label}
          </h3>
          <span className="text-xs text-slate-400 block mt-1">
            {getExpirationDisplay()}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleApiKeyRevokeDialogOpen}
          className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition duration-150 cursor-pointer self-start sm:self-center focus:outline-none"
        >
          Revoke
        </button>
      </div>

      {!isNil(apiKey.apiKey) && (
        <>
          <div className="border-t border-slate-800/60 my-4" />
          
          <div>
            <button
              onClick={() => setOpenDropdown(!openDropdown)}
              className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-350 transition cursor-pointer focus:outline-none"
            >
              {openDropdown ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span>Key</span>
            </button>

            {openDropdown && (
              <div className="mt-2.5 animate-in fade-in duration-100">
                <div className="bg-slate-950 border border-slate-800/65 rounded-lg p-3 text-xs font-mono text-slate-400 break-all select-all">
                  {apiKey.apiKey}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <ApiKeyRevokeDialog
        open={apiKeyRevokeOpen}
        setOpen={setApiKeyRevokeOpen}
        apiKey={apiKey}
        onConfirm={onRevoke}
      />
    </div>
  );
}

export default ApiKeyCard;
