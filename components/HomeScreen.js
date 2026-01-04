'use client';

import { History, Sparkles, TrendingUp, Scan, Plus } from 'lucide-react';
import HistoryCard from './HistoryCard';

export default function HomeScreen({ history, onItemClick, onScanClick }) {
  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 px-5 pt-12 pb-8 rounded-b-3xl lg:rounded-3xl lg:mx-6 lg:mt-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Welcome back</p>
            <h1 className="text-white text-2xl lg:text-3xl font-bold mt-1">Flux Agent</h1>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-xs">Your Health Score</p>
                <p className="text-white text-lg font-bold">82 / 100</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-emerald-200 text-xs">This week</p>
                <p className="text-white font-semibold">+5 pts</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Scan CTA */}
          <button 
            onClick={onScanClick}
            className="hidden md:flex bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20 hover:bg-white/30 transition-all duration-200 items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-white/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">New Scan</p>
              <p className="text-white/70 text-xs">Analyze a product</p>
            </div>
          </button>
        </div>
      </div>

      {/* History Section */}
      <div className="px-5 lg:px-6 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Scan History</h2>
          </div>
          <span className="text-sm text-slate-500">{history.length} items</span>
        </div>

        {/* Responsive Grid for History Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">
          {history.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onClick={() => onItemClick(item)}
            />
          ))}
        </div>

        {history.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-slate-600 font-medium">No scans yet</h3>
            <p className="text-slate-400 text-sm mt-1">
              Tap the scan button to analyze your first product
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
