import React from 'react';

function ApiKeyConfirmDialog(props) {
  const { open, setOpen, apiKey } = props;

  const handleClose = () => {
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left">
        <h3 className="text-lg font-bold text-white mb-4">
          API Key "{apiKey?.label}" Created
        </h3>
        
        <div className="space-y-4 mb-6">
          <p className="text-sm text-slate-450 leading-normal">
            Please copy the api key, you will not be able to see it once the page is refreshed.
          </p>
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm font-mono text-slate-200 break-all select-all text-center">
            {apiKey?.apiKey}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleClose}
            className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 font-semibold py-2 px-6 rounded-lg transition cursor-pointer focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyConfirmDialog;
