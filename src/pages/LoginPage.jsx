// react global
import React, { useState } from 'react';

// components
import { Package } from 'lucide-react';
import SignIn from '../components/Login/SignIn';
import SigninPresentation from 'components/Login/SignInPresentation';
import Loading from 'components/Shared/Loading';

function LoginPage({ isLoggedIn, setIsLoggedIn }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="flex min-h-screen w-full" data-testid="login-container">
      {isLoading && <Loading />}

      {/* Left Side: Presentation (Always Dark Theme) */}
      <div className={`hidden lg:flex w-1/2 bg-slate-950 relative overflow-hidden flex-col justify-center items-center p-12 lg:p-24 ${isLoading ? 'hidden' : ''}`}>
        
        {/* Absolute Brand Header */}
        <div className="absolute top-12 left-12 flex items-center gap-4 z-20">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/20 ring-1 ring-white/10">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Borga <span className="text-blue-400">Registry</span>
          </h1>
        </div>

        {/* Artistic background elements */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_20%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/20 via-transparent to-indigo-900/20 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-[128px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/20 blur-[128px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-lg">
          <SigninPresentation />
        </div>
      </div>

      {/* Right Side: Form (Adapts to system theme) */}
      <div className={`flex w-full lg:w-1/2 flex-col justify-center items-center p-8 sm:p-16 relative bg-slate-50 dark:bg-slate-950 ${isLoading ? 'hidden' : ''}`}>
        {/* Subtle background dots for texture on the right side */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="relative z-10 w-full flex justify-center">
          <SignIn isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} wrapperSetLoading={setIsLoading} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
