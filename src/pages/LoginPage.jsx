// react global
import React, { useState } from 'react';

// components
import SignIn from '../components/Login/SignIn';
import SigninPresentation from 'components/Login/SignInPresentation';
import Loading from 'components/Shared/Loading';

function LoginPage({ isLoggedIn, setIsLoggedIn }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex min-h-screen bg-bg-dark relative overflow-hidden" data-testid="login-container">
      {/* Premium ambient background glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none mix-blend-multiply dark:mix-blend-lighten" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none mix-blend-multiply dark:mix-blend-lighten" />

      {isLoading && <Loading />}

      <div className={`w-full flex items-center justify-center p-4 sm:p-8 relative z-10 ${isLoading ? 'hidden' : ''}`}>
        {/* Centered Glassmorphic Modal */}
        <div className="w-full max-w-5xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Presentation */}
          <div className="w-full md:w-1/2 bg-slate-50/50 dark:bg-slate-950/40 p-10 lg:p-16 border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col justify-center">
            <SigninPresentation />
          </div>

          {/* Right Side: Form */}
          <div className="w-full md:w-1/2 p-10 lg:p-16 flex items-center justify-center bg-transparent">
            <SignIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wrapperSetLoading={setIsLoading} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;
