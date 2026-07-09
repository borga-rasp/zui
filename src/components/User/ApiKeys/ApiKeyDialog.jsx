import React, { useState } from 'react';
import { isNil, isNumber } from 'lodash';
import { DateTime } from 'luxon';
import { api, endpoints } from 'api';
import { host } from 'host';

function ApiKeyDialog(props) {
  const { open, setOpen, onConfirm } = props;

  const [apiKeyLabel, setApiKeyLabel] = useState('');
  const [expirationDateOffset, setExpirationDateOffset] = useState(30);
  const [selectedExpirationDate, setSelectedExpirationDate] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    api
      .post(`${host()}${endpoints.apiKeys}`, {
        label: apiKeyLabel,
        expirationDate: getExpirationDatetime().toISO()
      })
      .then((response) => {
        if (response.data) {
          onConfirm(response.data);
          setOpen(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleLabelChange = (e) => {
    const { value } = e.target;
    setApiKeyLabel(value);
  };

  const handleExpirationDateChange = (e) => {
    const { value } = e.target;
    setExpirationDateOffset(value === 'custom' ? 'custom' : Number(value));
  };

  const handleDatePickerChange = (e) => {
    setSelectedExpirationDate(e.target.value);
  };

  const getExpirationDatetime = () => {
    if (isNumber(expirationDateOffset)) {
      return DateTime.now().plus({ days: expirationDateOffset }).endOf('day');
    } else if (expirationDateOffset === 'custom') {
      return DateTime.fromISO(selectedExpirationDate);
    }
    return null;
  };

  const getExpirationDisplay = () => {
    const expDateTime = getExpirationDatetime();
    if (!expDateTime) return '';
    return `Expires on ${expDateTime.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 text-left flex flex-col gap-5">
        <h3 className="text-lg font-bold text-white">
          Create Api Key
        </h3>
        
        <div className="flex flex-col gap-4">
          {/* Label Input */}
          <div className="flex flex-col gap-1.5">
            <label className="block text-sm font-semibold text-slate-350" htmlFor="apikeylabel">
              Label
            </label>
            <input
              autoFocus
              required
              id="apikeylabel"
              type="text"
              placeholder="Enter key label"
              onChange={handleLabelChange}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition duration-150"
            />
          </div>

          {/* Expiration Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mt-1">
            <div className="flex flex-col gap-1.5">
              <label className="block text-sm font-semibold text-slate-350" htmlFor="expirationDate">
                Expiration date
              </label>
              <select
                id="expirationDate"
                value={expirationDateOffset}
                onChange={handleExpirationDateChange}
                className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition duration-150 cursor-pointer"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
                <option value="custom">custom</option>
              </select>
            </div>

            <div className="flex items-center justify-start h-10">
              {expirationDateOffset === 'custom' ? (
                <input
                  type="date"
                  value={selectedExpirationDate}
                  onChange={handleDatePickerChange}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-blue-500 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition duration-150 cursor-pointer"
                />
              ) : (
                <span className="text-xs font-semibold text-slate-450 truncate">
                  {getExpirationDisplay()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            onClick={handleClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2.5 px-5 rounded-lg transition cursor-pointer focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={expirationDateOffset === 'custom' && isEmpty(selectedExpirationDate)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg transition disabled:opacity-50 cursor-pointer focus:outline-none"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyDialog;
