import React from 'react';
import { Package, ShieldCheck, Layers } from 'lucide-react';

export default function SigninPresentation() {
  return (
    <div className="w-full flex flex-col space-y-10" data-testid="presentation-container">
      {/* Brand Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/20 ring-1 ring-white/10">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Borga <span className="text-blue-400">Registry</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
          Official Image Distribution
        </h2>
        <p className="text-base text-slate-400 leading-relaxed max-w-md">
          The verified, enterprise-ready distribution hub for official Borga container images.
        </p>
      </div>

      {/* Features */}
      <div className="space-y-6 pt-6 border-t border-slate-800/60">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
            <ShieldCheck className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-200">Continuous Security</p>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Signed, verified, and continuously scanned for CVEs.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-base font-semibold text-slate-200">Immutable &amp; Reliable</p>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              Permanent versions for break-proof production updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
