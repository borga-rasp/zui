import React from 'react';
import { api, endpoints } from 'api';
import { host } from 'host';

function ApiKeyRevokeDialog(props) {
  const { open, setOpen, apiKey, onConfirm } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    api
      .delete(`${host()}${endpoints.apiKeys}`, { id: apiKey.uuid })
      .then((response) => {
        onConfirm(response?.status, apiKey);
        setOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
        <h3 className="text-lg font-bold text-white mb-4">
          Revoke "{apiKey?.label}" key
        </h3>
        
        <p className="text-sm text-slate-350 mb-6">
          Are you sure you want to revoke this api key?
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-5 rounded-lg transition cursor-pointer focus:outline-none"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-5 rounded-lg transition cursor-pointer focus:outline-none"
          >
            Revoke
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyRevokeDialog;
