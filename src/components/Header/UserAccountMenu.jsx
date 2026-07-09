import React, { useState, useEffect, useRef } from 'react';
import { getLoggedInUser, logoutUser, isApiKeyEnabled } from '../../utilities/authUtilities';
import { useNavigate } from 'react-router';

function UserAccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const apiKeyManagement = () => {
    setIsOpen(false);
    navigate('/user/apikey');
  };

  const handleUserClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleUserClick}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
        data-testid="user-icon-header-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-800 border border-slate-700 shadow-xl py-1 z-50 animate-in fade-in duration-100">
          <div className="px-4 py-2 text-sm text-slate-200 font-medium truncate border-b border-slate-700">
            {getLoggedInUser()}
          </div>
          {isApiKeyEnabled() && (
            <>
              <button
                onClick={apiKeyManagement}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition cursor-pointer"
                data-testid="api-keys-menu-item"
              >
                API Keys
              </button>
              <div className="border-t border-slate-700" data-testid="api-keys-menu-item-divider" />
            </>
          )}
          <button
            onClick={logoutUser}
            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-slate-700 hover:text-red-300 transition cursor-pointer"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserAccountMenu;
