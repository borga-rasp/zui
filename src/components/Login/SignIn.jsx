// react global
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { User, Lock } from 'lucide-react';

// utility
import { api, endpoints } from '../../api';
import { host } from '../../host';
import { isEmpty, isObject } from 'lodash';

import Loading from '../Shared/Loading';
import { GoogleLoginButton, GithubLoginButton, GitlabLoginButton, OIDCLoginButton } from './ThirdPartyLoginComponents';

export default function SignIn({ isLoggedIn, setIsLoggedIn, wrapperSetLoading = () => {} }) {
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [requestProcessing, setRequestProcessing] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authMethods, setAuthMethods] = useState({});
  const [isGuestLoginEnabled, setIsGuestLoginEnabled] = useState(false);
  const abortController = useMemo(() => new AbortController(), []);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    if (isLoggedIn) {
      setIsLoading(false);
      wrapperSetLoading(false);
      navigate('/home');
    } else {
      api
        .get(`${host()}${endpoints.authConfig}`, abortController.signal)
        .then((response) => {
          if (response.data?.http && isEmpty(response.data?.http?.auth)) {
            localStorage.setItem('authConfig', '{}');
            setIsLoggedIn(true);
            navigate('/home');
          } else if (response.data?.http?.auth) {
            setAuthMethods(response.data?.http?.auth);
            localStorage.setItem('authConfig', JSON.stringify(response.data?.http?.auth));
            setIsLoading(false);
            wrapperSetLoading(false);
            api
              .get(`${host()}${endpoints.status}`)
              .then((response) => {
                if (response.status === 200) {
                  setIsGuestLoginEnabled(true);
                }
              })
              .catch(() => console.log('could not obtain guest login status'));
          }
          setIsLoading(false);
          wrapperSetLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setIsLoading(false);
          wrapperSetLoading(false);
        });
    }
    return () => {
      abortController.abort();
    };
  }, []);

  const handleBasicAuth = () => {
    setRequestProcessing(true);
    let cfg = {};
    const token = btoa(username + ':' + password);
    cfg = {
      headers: {
        Authorization: `Basic ${token}`
      },
      withCredentials: host() !== window?.location?.origin
    };
    api
      .get(`${host()}/v2/`, abortController.signal, cfg)
      .then((response) => {
        if (response.status === 200) {
          setRequestProcessing(false);
          setRequestError(false);
          setIsLoggedIn(true);
          navigate('/home');
        }
      })
      .catch(() => {
        setRequestError(true);
        setRequestProcessing(false);
      });
  };

  const handleBasicAuthSubmit = () => {
    setRequestError(false);
    const isUsernameValid = handleUsernameValidation(username);
    const isPasswordValid = handlePasswordValidation(password);
    if (Object.keys(authMethods).includes('htpasswd') && isUsernameValid && isPasswordValid) {
      handleBasicAuth();
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    handleBasicAuthSubmit();
  };

  const handleGuestClick = () => {
    setRequestProcessing(false);
    setRequestError(false);
    setIsLoggedIn(true);
    navigate('/home');
  };

  const handleClickExternalLogin = (event, provider) => {
    event.preventDefault();
    window.location.replace(
      `${host()}${endpoints.openidAuth}?callback_ui=${encodeURIComponent(
        window?.location?.origin
      )}/home&provider=${provider}`
    );
  };

  const handleUsernameValidation = (username) => {
    let isValid = true;
    if (username === '') {
      setUsernameError('Please enter a username');
      isValid = false;
    } else {
      setUsernameError(null);
    }
    return isValid;
  };

  const handlePasswordValidation = (password) => {
    let isValid = true;
    if (password === '') {
      setPasswordError('Please enter a password');
      isValid = false;
    } else {
      setPasswordError(null);
    }
    return isValid;
  };

  const handleChange = (event, type) => {
    event.preventDefault();
    setRequestError(false);

    const val = event.target?.value;

    switch (type) {
      case 'username':
        setUsername(val);
        handleUsernameValidation(val);
        break;
      case 'password':
        setPassword(val);
        handlePasswordValidation(val);
        break;
      default:
        break;
    }
  };

  const handleLoginInputFieldKeyDown = (event) => {
    const keyPressed = event.key;
    if (keyPressed === 'Enter') {
      handleBasicAuthSubmit();
    }
  };

  const renderThirdPartyLoginMethods = () => {
    let isGoogle = isObject(authMethods.openid?.providers?.google);
    let isGitlab = isObject(authMethods.openid?.providers?.gitlab);
    let isGithub = isObject(authMethods.openid?.providers?.github);
    let isOIDC = isObject(authMethods.openid?.providers?.oidc);
    let oidcName = authMethods.openid?.providers?.oidc?.name;

    return (
      <div className="flex flex-col gap-3 w-full">
        {isGithub && <GithubLoginButton handleClick={handleClickExternalLogin} />}
        {isGoogle && <GoogleLoginButton handleClick={handleClickExternalLogin} />}
        {isGitlab && <GitlabLoginButton handleClick={handleClickExternalLogin} />}
        {isOIDC && <OIDCLoginButton handleClick={handleClickExternalLogin} oidcName={oidcName} />}
      </div>
    );
  };

  return (
    <div className="w-full flex items-center justify-center relative" data-testid="signin-container">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
          <div className="text-left">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-1.5">Sign In</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Enter your credentials to access your registry.</p>
          </div>

          {renderThirdPartyLoginMethods()}

          {Object.keys(authMethods).length > 1 &&
            Object.keys(authMethods).includes('openid') &&
            Object.keys(authMethods.openid.providers).length > 0 && (
              <div className="relative flex py-1 items-center w-full" data-testid="openid-divider">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-850"></div>
                <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider">or</span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-850"></div>
              </div>
            )}

          {Object.keys(authMethods).includes('htpasswd') && (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5" noValidate autoComplete="off">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2" htmlFor="username">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className={`w-full bg-slate-950 border ${
                      usernameError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-800/80 focus:ring-blue-500/10 focus:border-blue-500'
                    } rounded-xl py-2.5 pl-10 pr-3.5 text-slate-100 placeholder-slate-500 dark:placeholder-slate-600 focus:outline-none focus:ring-4 transition duration-200 text-sm`}
                    placeholder="Enter username"
                    onChange={(e) => handleChange(e, 'username')}
                    onKeyDown={(e) => handleLoginInputFieldKeyDown(e)}
                  />
                </div>
                {usernameError && <p className="mt-1.5 text-xs text-red-500 font-semibold">{usernameError}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2" htmlFor="password">
                  Enter Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={`w-full bg-slate-950 border ${
                      passwordError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 dark:border-slate-800/80 focus:ring-blue-500/10 focus:border-blue-500'
                    } rounded-xl py-2.5 pl-10 pr-3.5 text-slate-100 placeholder-slate-500 dark:placeholder-slate-600 focus:outline-none focus:ring-4 transition duration-200 text-sm`}
                    placeholder="Enter password"
                    onChange={(e) => handleChange(e, 'password')}
                    onKeyDown={(e) => handleLoginInputFieldKeyDown(e)}
                  />
                </div>
                {passwordError && <p className="mt-1.5 text-xs text-red-500 font-semibold">{passwordError}</p>}
              </div>

              {requestProcessing && (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-500"></div>
                </div>
              )}

              {requestError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-xs rounded-xl p-3.5 text-left font-medium">
                  Authentication Failed. Please try again.
                </div>
              )}

              <button
                type="button"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg shadow-blue-500/10 dark:shadow-none active:scale-[0.98] cursor-pointer text-sm"
                onClick={handleClick}
                data-testid="basic-auth-submit-btn"
              >
                Continue
              </button>
            </form>
          )}

          {isGuestLoginEnabled && (
            <button
              type="button"
              className="w-full bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-300 hover:text-slate-100 font-semibold py-2.5 px-4 rounded-xl transition duration-200 cursor-pointer text-sm active:scale-[0.98]"
              onClick={handleGuestClick}
            >
              Continue as guest
            </button>
          )}
        </div>
      )}
    </div>
  );
}
