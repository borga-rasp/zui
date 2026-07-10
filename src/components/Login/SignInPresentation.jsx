import React from 'react';
import { ShieldCheck, Cpu, Database, Network } from 'lucide-react';

export default function SigninPresentation() {
  return (
    <div 
      className="min-h-full w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-[#080b11] dark:via-[#0f172a] dark:to-[#020617] flex flex-col items-center justify-center p-8 lg:p-12 text-center relative overflow-hidden border-r border-slate-200 dark:border-slate-800/80" 
      data-testid="presentation-container"
    >
      {/* Edge/Tech grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-60" />

      {/* Decorative glowing blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto space-y-10 z-10">
        {/* Brand header */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-indigo-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-700 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              BORGA RASP
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">
              Registry Server
            </p>
          </div>
        </div>

        {/* Catchy description */}
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
            Deploy containerized modules to your edge
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
            The official container registry for Borga Rasp devices. Build, sign, and securely distribute your Docker images to the edge.
          </p>
        </div>

        {/* Live Visual Mockup: Rasp Edge Status */}
        <div className="bg-white/85 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 shadow-xl max-w-sm w-full mx-auto text-left space-y-4 transition duration-300 hover:shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-350">rasp_edge_nodes</span>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-green-600 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> ONLINE
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Core Image</p>
                <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">borga/rasp-core:v1.2.0</p>
              </div>
              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 px-1.5 py-0.5 rounded border border-blue-100 dark:border-blue-900/40">
                <ShieldCheck className="w-3 h-3" /> Signed
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-3">
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400">Architecture</p>
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">ARM64 / v7 / AMD64</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400">Connected Nodes</p>
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">84 Active Devices</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tech Specs */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/30">
          <div className="flex flex-col items-center space-y-1">
            <Database className="w-5 h-5 text-indigo-500" />
            <span className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">OCI Registry</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            <span className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Secure Scanning</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <Network className="w-5 h-5 text-blue-500" />
            <span className="text-[10px] font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Over-The-Air</span>
          </div>
        </div>
      </div>
    </div>
  );
}
