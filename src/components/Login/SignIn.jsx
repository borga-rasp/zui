// react global
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

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
      <div className="flex flex-col gap-3 w-full mb-6">
        {isGithub && <GithubLoginButton handleClick={handleClickExternalLogin} />}
        {isGoogle && <GoogleLoginButton handleClick={handleClickExternalLogin} />}
        {isGitlab && <GitlabLoginButton handleClick={handleClickExternalLogin} />}
        {isOIDC && <OIDCLoginButton handleClick={handleClickExternalLogin} oidcName={oidcName} />}
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto flex items-center justify-center relative p-6" data-testid="signin-container">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="w-full bg-bg-panel border border-bg-border shadow-xl rounded-2xl p-8 flex flex-col">
          <div className="mb-8 text-left">
            <h1 className="text-3xl font-bold text-slate-100 mb-2">Sign In</h1>
            <p className="text-slate-400 text-sm">Welcome back! Please login.</p>
          </div>

          {renderThirdPartyLoginMethods()}

          {Object.keys(authMethods).length > 1 &&
            Object.keys(authMethods).includes('openid') &&
            Object.keys(authMethods.openid.providers).length > 0 && (
              <div className="relative flex py-4 items-center w-full" data-testid="openid-divider">
                <div className="flex-grow border-t border-slate-700"></div>
                <span className="flex-shrink mx-4 text-slate-500 text-sm">or</span>
                <div className="flex-grow border-t border-slate-700"></div>
              </div>
            )}

          {Object.keys(authMethods).includes('htpasswd') && (
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5" noValidate autoComplete="off">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="username">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`w-full bg-slate-950 border ${
                    usernameError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                  } rounded-lg py-2.5 px-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-200`}
                  placeholder="Enter username"
                  onChange={(e) => handleChange(e, 'username')}
                  onKeyDown={(e) => handleLoginInputFieldKeyDown(e)}
                />
                {usernameError && <p className="mt-1 text-xs text-red-500">{usernameError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">
                  Enter Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className={`w-full bg-slate-950 border ${
                    passwordError ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-700 focus:ring-blue-500/20 focus:border-blue-500'
                  } rounded-lg py-2.5 px-3.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-200`}
                  placeholder="Enter password"
                  onChange={(e) => handleChange(e, 'password')}
                  onKeyDown={(e) => handleLoginInputFieldKeyDown(e)}
                />
                {passwordError && <p className="mt-1 text-xs text-red-500">{passwordError}</p>}
              </div>

              {requestProcessing && (
                <div className="flex justify-center py-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}

              {requestError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3.5 text-left">
                  Authentication Failed. Please try again.
                </div>
              )}

              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md cursor-pointer hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 text-lg"
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
              className="w-full mt-4 bg-transparent hover:bg-slate-800 border border-slate-600 text-slate-300 hover:text-white font-semibold py-3 px-4 rounded-lg transition duration-200 cursor-pointer text-lg"
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
