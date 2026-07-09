// react global
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';

import { isAuthenticated, isAuthenticationEnabled, logoutUser } from '../../utilities/authUtilities';

// components
import SearchSuggestion from './SearchSuggestion';
import UserAccountMenu from './UserAccountMenu';

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

function setNavShow() {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(null);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 50) {
        setShow(true);
      } else if (lastScrollY !== null) {
        if (currentScrollY < lastScrollY) {
          setShow(true);
        } else {
          setShow(false);
        }
      }
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);
  return show;
}

function Header({ setSearchCurrentValue = () => {} }) {
  const show = setNavShow();
  const path = useLocation().pathname;

  const handleSignInClick = () => {
    logoutUser();
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full h-16 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800 z-[1000] transition-transform duration-300 ${
        show ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Branding & Links */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/home" className="flex items-center gap-2 group shrink-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 shadow shadow-indigo-500/20 group-hover:scale-105 transition duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="font-extrabold tracking-tight text-white text-lg bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                BORGA
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold">
                Registry
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md">
          {path !== '/' && <SearchSuggestion setSearchCurrentValue={setSearchCurrentValue} />}
        </div>

        {/* Right: GitHub & User Profile */}
        <div className="flex items-center gap-4">
          <a
            className="text-slate-400 hover:text-white transition duration-150 p-1.5 hover:bg-slate-800 rounded-lg"
            href="https://github.com/project-zot/zot"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="w-5 h-5" />
          </a>

          {isAuthenticated() && isAuthenticationEnabled() && (
            <UserAccountMenu />
          )}

          {!isAuthenticated() && isAuthenticationEnabled() && (
            <button
              onClick={handleSignInClick}
              className="bg-transparent border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white text-sm font-semibold py-1.5 px-4 rounded-lg transition duration-200 cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
