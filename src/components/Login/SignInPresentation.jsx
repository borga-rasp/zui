import React from 'react';

export default function SigninPresentation() {
  return (
    <div className="min-h-full w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden border-r border-slate-800" data-testid="presentation-container">
      {/* Decorative background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto space-y-8 z-10">
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-9 h-9 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-cyan-400 bg-clip-text text-transparent">
              BORGA
            </h1>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
              Registry Server
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-white leading-snug tracking-tight">
          OCI-native container image registry, simplified
        </h2>
        <p className="text-slate-400 text-sm">
          A secure, lightning-fast container registry for all your container images, OCI artifacts, and Helm charts.
        </p>
      </div>
    </div>
  );
}
