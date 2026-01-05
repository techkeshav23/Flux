'use client';

import { History, Sparkles, Scan, Plus, Clock, Camera, FileText } from 'lucide-react';

export default function HomeScreen({ onScanClick }) {
  return (
    <div className="pb-24 lg:pb-8">
      {/* Header - Full width on desktop */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 px-6 pt-14 pb-8 lg:px-8 lg:pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="lg:flex lg:items-center lg:justify-between mb-8">
            <div>
              <p className="text-emerald-200 text-sm font-medium">AI Health Co-pilot</p>
              <h1 className="text-white text-3xl lg:text-4xl font-bold mt-1">Flux Agent</h1>
            </div>
            {/* Desktop CTA */}
            <button 
              onClick={onScanClick}
              className="hidden lg:flex bg-white hover:bg-emerald-50 rounded-xl px-6 py-3 transition-colors items-center gap-3 shadow-lg"
            >
              <Plus className="w-5 h-5 text-emerald-700" />
              <span className="text-emerald-700 font-semibold">Analyze Ingredients</span>
            </button>
          </div>

          {/* Feature Cards - Grid on desktop */}
          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            {/* AI Description */}
            <div className="bg-white/15 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">AI-Powered Analysis</p>
                  <p className="text-emerald-100 text-sm mt-1">
                    Understand <em>why</em> ingredients matter for your health.
                  </p>
                </div>
              </div>
            </div>

            {/* Camera Feature */}
            <div className="hidden lg:block bg-white/15 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Camera className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Snap & Scan</p>
                  <p className="text-emerald-100 text-sm mt-1">
                    Take a photo of ingredients label for instant analysis.
                  </p>
                </div>
              </div>
            </div>

            {/* Bilingual Feature */}
            <div className="hidden lg:block bg-white/15 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Hindi & English</p>
                  <p className="text-emerald-100 text-sm mt-1">
                    Get results in your preferred language instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Scan CTA */}
          <button 
            onClick={onScanClick}
            className="lg:hidden w-full bg-white hover:bg-emerald-50 rounded-xl p-4 transition-colors flex items-center gap-4 group shadow-lg"
          >
            <div className="w-11 h-11 bg-emerald-600 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="text-emerald-800 font-semibold">Analyze Ingredients</p>
              <p className="text-emerald-600 text-sm">Scan or type to get AI insights</p>
            </div>
            <Scan className="w-5 h-5 text-emerald-500" />
          </button>
        </div>
      </div>

      {/* History Section - Coming Soon */}
      <div className="px-5 lg:px-8 pt-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            <h2 className="text-base font-semibold text-slate-800">Recent Scans</h2>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
            Coming Soon
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 text-center">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-slate-800 font-medium">Coming Soon</h3>
          <p className="text-slate-500 text-sm mt-1.5 max-w-md mx-auto">
            Smart history that learns from your preferences and provides personalized insights.
          </p>
        </div>
      </div>
    </div>
  );
}
