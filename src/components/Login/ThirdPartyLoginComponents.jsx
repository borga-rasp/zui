import React from 'react';
import githubLogo from '../../assets/GhIcon.svg';

function GithubLoginButton({ handleClick }) {
  return (
    <button
      className="w-full bg-[#24292e] text-white hover:bg-[#2c3137] transition font-semibold rounded-md py-3 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-lg"
      onClick={(e) => handleClick(e, 'github')}
    >
      <span>Continue with GitHub</span>
      <img src={githubLogo} className="w-5 h-5 invert" alt="GitHub icon" />
    </button>
  );
}

function GoogleLoginButton({ handleClick }) {
  return (
    <button
      className="w-full bg-white text-[#374151] hover:bg-gray-50 border border-gray-300 transition font-semibold rounded-md py-3 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-lg"
      onClick={(e) => handleClick(e, 'google')}
    >
      <span>Continue with Google</span>
    </button>
  );
}

function GitlabLoginButton({ handleClick }) {
  return (
    <button
      className="w-full bg-[#fc6d26] text-white hover:bg-[#e24329] transition font-semibold rounded-md py-3 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-lg"
      onClick={(e) => handleClick(e, 'gitlab')}
    >
      Sign in with GitLab
    </button>
  );
}

function OIDCLoginButton({ handleClick, oidcName }) {
  const loginWithName = oidcName || 'OIDC';
  return (
    <button
      className="w-full bg-blue-600 text-white hover:bg-blue-700 transition font-semibold rounded-md py-3 px-4 flex items-center justify-center gap-2 cursor-pointer shadow-sm text-lg"
      onClick={(e) => handleClick(e, 'oidc')}
    >
      Sign in with {loginWithName}
    </button>
  );
}

export { GithubLoginButton, GoogleLoginButton, GitlabLoginButton, OIDCLoginButton };
