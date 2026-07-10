import React from 'react';
import { Package, ShieldCheck, Zap } from 'lucide-react';

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
              Borga <span className="text-blue-600 dark:text-blue-400">Rasp</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500 dark:text-slate-400">Container Registry</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Secure image storage for Rasp products.
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          A dedicated, lightning-fast OCI registry built to store, sign, and distribute Borga Rasp Docker images effortlessly. Purely a registry, perfected for your workflow.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 dark:border-blue-800/30">
            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Lightning Fast Pulls</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Optimized for high-speed delivery.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center border border-green-100 dark:border-green-800/30">
            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Signed &amp; Verified</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Cosign signature verification built-in.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
