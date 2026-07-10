// react global
import React, { useState } from 'react';

// components
import SignIn from '../components/Login/SignIn';
import SigninPresentation from 'components/Login/SignInPresentation';
import Loading from 'components/Shared/Loading';

function LoginPage({ isLoggedIn, setIsLoggedIn }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-bg-dark" data-testid="login-container">
      {isLoading && <Loading />}
      <div className={`w-full md:w-1/2 min-h-[30vh] md:min-h-screen ${isLoading ? 'hidden' : ''}`}>
        <SigninPresentation />
      </div>
      <div className={`w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 ${isLoading ? 'hidden' : ''}`}>
        <SignIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wrapperSetLoading={setIsLoading} />
      </div>
    </div>
  );
}

export default LoginPage;
