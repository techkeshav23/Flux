'use client';

import { History, Sparkles, Scan, Plus, Clock } from 'lucide-react';

export default function HomeScreen({ onScanClick }) {
  return (
    <div className="pb-24 lg:pb-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-slate-900 px-6 pt-14 pb-8">
        <div className="mb-8">
          <p className="text-slate-400 text-sm font-medium">AI Health Co-pilot</p>
          <h1 className="text-white text-3xl font-bold mt-1">Flux Agent</h1>
        </div>

        {/* AI Description */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-5">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-white font-medium">I reason, not just search</p>
              <p className="text-slate-400 text-sm mt-1">
                Analyze ingredients and understand <em>why</em> they matter for your health.
              </p>
            </div>
          </div>
        </div>

        {/* Scan CTA */}
        <button 
          onClick={onScanClick}
          className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-xl p-4 transition-colors flex items-center gap-4 group"
        >
          <div className="w-11 h-11 bg-white/20 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <div className="text-left flex-1">
            <p className="text-white font-semibold">Analyze Ingredients</p>
            <p className="text-emerald-100 text-sm">Scan or type to get AI insights</p>
          </div>
          <Scan className="w-5 h-5 text-white/70" />
        </button>
      </div>

      {/* History Section - Coming Soon */}
      <div className="px-5 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-800">History</h2>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
            Coming Soon
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-slate-800 font-medium">Coming Soon</h3>
          <p className="text-slate-500 text-sm mt-1.5 max-w-xs mx-auto">
            Smart history that learns from your preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
