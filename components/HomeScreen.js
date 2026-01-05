'use client';

import { Sparkles, Scan, Plus, Camera, Heart, Zap } from 'lucide-react';

export default function HomeScreen({ onScanClick, hasPreferences }) {
  return (
    <div className="pb-24 lg:pb-8">
      {/* Top Header Bar - Gradient with curved bottom like reference */}
      <div className="relative">
        <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 px-6 pt-12 pb-16 lg:px-8 lg:pt-8 lg:pb-12 rounded-b-[2.5rem]">
          <div className="max-w-4xl mx-auto">
            {/* Main Title */}
            <h1 className="text-white text-3xl lg:text-4xl font-bold italic">Flux Agent</h1>
            <p className="text-white/80 text-base mt-1">Your AI health companion</p>
            
            {/* Desktop CTA */}
            <button 
              onClick={onScanClick}
              className="hidden lg:flex mt-6 bg-white hover:bg-emerald-50 rounded-xl px-6 py-3 transition-colors items-center gap-3 shadow-lg"
            >
              <Plus className="w-5 h-5 text-emerald-700" />
              <span className="text-emerald-700 font-semibold">Analyze Ingredients</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content below header */}
      <div className="px-5 lg:px-8 -mt-8 max-w-4xl mx-auto relative z-10">
        {/* Mobile Scan CTA Card */}
        <button 
          onClick={onScanClick}
          className="lg:hidden w-full bg-white hover:bg-slate-50 rounded-2xl p-4 transition-colors flex items-center gap-4 group shadow-lg border border-slate-100"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Scan className="w-6 h-6 text-white" />
          </div>
          <div className="text-left flex-1">
            <p className="text-slate-800 font-semibold">Analyze Ingredients</p>
            <p className="text-slate-500 text-sm">Scan or type to get AI insights</p>
          </div>
          <Plus className="w-5 h-5 text-emerald-500" />
        </button>

        {/* Personalization Status */}
        {hasPreferences && (
          <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-slate-800 text-sm font-semibold">Personalized Mode Active</p>
              <p className="text-slate-500 text-xs">Analysis tailored to your health profile</p>
            </div>
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
        )}

        {/* Feature Cards */}
        <div className="mt-6 grid lg:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-slate-800 font-medium text-sm">AI-Powered</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Understand <em>why</em> ingredients matter
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-slate-800 font-medium text-sm">Snap & Scan</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Photo of label for instant analysis
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-slate-800 font-medium text-sm">Personalized</p>
              <p className="text-slate-500 text-xs mt-0.5">
                Tailored to your health profile
              </p>
            </div>
          </div>
        </div>
      </div>

        {/* Quick Tip */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-slate-800 text-sm font-semibold">Pro Tip</p>
            <p className="text-slate-500 text-xs">For best results, capture the full ingredients list clearly</p>
          </div>
        </div>
      </div>
  );
}
