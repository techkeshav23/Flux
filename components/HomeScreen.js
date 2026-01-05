'use client';

import { History, Sparkles, Brain, Scan, Plus, Clock } from 'lucide-react';

export default function HomeScreen({ onScanClick }) {
  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-700 px-5 pt-12 pb-8 rounded-b-3xl lg:rounded-3xl lg:mx-6 lg:mt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-purple-200 text-sm font-medium">Your AI Health Co-pilot</p>
            <h1 className="text-white text-2xl lg:text-3xl font-bold mt-1">Flux Agent</h1>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* AI Description Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium">I reason, not just search</p>
              <p className="text-white/70 text-sm mt-1">
                I analyze ingredients and explain <em>why</em> they matter, including what I'm uncertain about.
              </p>
            </div>
          </div>
        </div>

        {/* Scan CTA */}
        <button 
          onClick={onScanClick}
          className="w-full bg-white rounded-2xl p-4 hover:shadow-lg transition-all duration-200 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div className="text-left flex-1">
            <p className="text-slate-800 font-semibold">Analyze Ingredients</p>
            <p className="text-slate-500 text-sm">Paste or type ingredients to get AI insights</p>
          </div>
          <Scan className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
        </button>
      </div>

      {/* History Section - Coming Soon */}
      <div className="px-5 lg:px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Scan History</h2>
          </div>
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Coming Soon</span>
        </div>

        <div className="bg-gradient-to-br from-slate-50 to-purple-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-slate-700 font-semibold text-lg">Coming Soon</h3>
          <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">
            We're building a smart history feature that learns from your preferences. Stay tuned!
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-slate-600">AI-powered insights coming</span>
          </div>
        </div>
      </div>
    </div>
  );
}
