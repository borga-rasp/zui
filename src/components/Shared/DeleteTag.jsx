import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

// utility
import { api, endpoints } from '../../api';

// components
import DeleteTagConfirmDialog from 'components/Shared/DeleteTagConfirmDialog';
import { host } from '../../host';

export default function DeleteTag(props) {
  const { repo, tag, onTagDelete } = props;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteTag = (repo, tag) => {
    api
      .delete(`${host()}${endpoints.deleteImage(repo, tag)}`)
      .then((response) => {
        if (response && response.status === 202) {
          onTagDelete(tag);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onConfirm = () => {
    deleteTag(repo, tag);
  };

  return (
    <React.Fragment>
      <button
        onClick={handleClickOpen}
        className="p-1.5 text-slate-500 hover:text-red-500 hover:bg-slate-800 rounded-lg transition cursor-pointer focus:outline-none"
        aria-label="Delete tag"
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <DeleteTagConfirmDialog
        onClose={handleClose}
        open={open}
        title={`Permanently delete image ${repo}:${tag}?`}
        onConfirm={onConfirm}
      />
    </React.Fragment>
  );
}
