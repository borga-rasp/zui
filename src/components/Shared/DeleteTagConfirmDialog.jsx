import React from 'react';

export default function DeleteTagConfirmDialog(props) {
  const { onClose, open, title, onConfirm } = props;

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      data-testid="delete-dialog"
    >
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
        <h3 className="text-base font-bold text-white mb-6">
          {title}
        </h3>
        
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            data-testid="cancel-delete"
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-4 rounded-lg transition cursor-pointer focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            data-testid="confirm-delete"
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition cursor-pointer focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
