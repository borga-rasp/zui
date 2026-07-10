import React from 'react';
import { ShieldCheck, Layers } from 'lucide-react';

export default function SigninPresentation() {
  return (
    <div className="w-full flex flex-col space-y-10" data-testid="presentation-container">
      {/* Description */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-slate-100 tracking-tight leading-tight">
          Official Image Distribution
        </h2>
        <p className="text-lg text-slate-400 leading-relaxed max-w-md">
          The verified, enterprise-ready distribution hub for official Borga container images.
        </p>
      </div>

      {/* Features in Cards */}
      <div className="flex flex-col gap-4">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/[0.06] transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-200">Continuous Security</p>
              <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                Signed, verified, and continuously scanned for CVEs.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/[0.06] transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-slate-200">Immutable &amp; Reliable</p>
              <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                Permanent versions for break-proof production updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
