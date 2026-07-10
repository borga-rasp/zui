import React from 'react';
import { Package, ShieldCheck, Layers } from 'lucide-react';

export default function SigninPresentation() {
  return (
    <div className="w-full flex flex-col space-y-8" data-testid="presentation-container">
      {/* Brand Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Package className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Borga <span className="text-blue-600 dark:text-blue-400">Registry</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Official Image Distribution
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The verified, enterprise-ready distribution hub for official Borga container images.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4 pt-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center border border-green-100 dark:border-green-800/30 shrink-0">
            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Continuous Security</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Signed, verified, and continuously scanned for CVEs.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/30 shrink-0">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Immutable &amp; Reliable</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Permanent versions for break-proof production updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
