'use client';

import { useState } from 'react';
import { 
  History, 
  Trash2, 
  ChevronRight, 
  Clock, 
  Shield, 
  AlertTriangle, 
  XCircle,
  Search,
  Sparkles,
  BarChart3
} from 'lucide-react';

// Verdict Badge Component
const VerdictBadge = ({ verdict }) => {
  const config = {
    Safe: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: Shield,
    },
    Caution: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: AlertTriangle,
    },
    Avoid: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      icon: XCircle,
    },
  };

  const { bg, text, border, icon: Icon } = config[verdict] || config.Caution;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${bg} ${text} border ${border}`}>
      <Icon className="w-3.5 h-3.5" />
      {verdict}
    </span>
  );
};

// History Item Card
const HistoryItem = ({ scan, onClick, onDelete }) => {
  const summary = scan.en?.simpleSummary || scan.simpleSummary || scan.summary || '';
  
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-emerald-200 transition-all">
      <button
        onClick={() => onClick(scan)}
        className="w-full p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center flex-wrap gap-2 mb-1.5">
              <VerdictBadge verdict={scan.verdict} />
              {scan.personalizedForUser && (
                <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-medium">
                  <Sparkles className="w-2.5 h-2.5 inline mr-0.5" />
                  Personalized
                </span>
              )}
            </div>
            <h3 className="font-semibold text-slate-800 text-sm truncate">
              {scan.productName || 'Scanned Product'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
              {summary}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5 text-slate-400">
              <Clock className="w-3 h-3" />
              <span className="text-[10px]">{scan.displayTime || 'Recently'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(scan.id);
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </div>
        </div>
      </button>
    </div>
  );
};

// Stats Card - Floating style like Profile page
const StatsCard = ({ stats }) => (
  <div className="grid grid-cols-4 gap-2 -mt-4 mb-6 relative z-10">
    <div className="bg-white rounded-2xl p-3 text-center shadow-md border border-slate-100">
      <p className="text-lg font-bold text-slate-800">{stats.total}</p>
      <p className="text-[10px] text-slate-500 font-medium">Total</p>
    </div>
    <div className="bg-white rounded-2xl p-3 text-center shadow-md border border-emerald-100">
      <p className="text-lg font-bold text-emerald-600">{stats.safe}</p>
      <p className="text-[10px] text-emerald-600 font-medium">Safe</p>
    </div>
    <div className="bg-white rounded-2xl p-3 text-center shadow-md border border-amber-100">
      <p className="text-lg font-bold text-amber-600">{stats.caution}</p>
      <p className="text-[10px] text-amber-600 font-medium">Caution</p>
    </div>
    <div className="bg-white rounded-2xl p-3 text-center shadow-md border border-red-100">
      <p className="text-lg font-bold text-red-600">{stats.avoid}</p>
      <p className="text-[10px] text-red-600 font-medium">Avoid</p>
    </div>
  </div>
);

// Empty State
const EmptyState = ({ onScanClick }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
    <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="w-6 h-6 text-emerald-600" />
    </div>
    <h3 className="text-slate-800 font-semibold mb-2">No scans yet</h3>
    <p className="text-slate-500 text-sm mb-4 max-w-xs mx-auto">
      Start scanning products to build your personalized health history and track patterns.
    </p>
    <button
      onClick={onScanClick}
      className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-emerald-500 transition-colors inline-flex items-center gap-2"
    >
      <Sparkles className="w-4 h-4" />
      Scan Your First Product
    </button>
  </div>
);

// Loading Skeleton
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-slate-100 p-4 animate-pulse">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
          <div className="h-4 w-8 bg-slate-100 rounded"></div>
        </div>
        <div className="h-5 w-32 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-full bg-slate-100 rounded mb-1"></div>
        <div className="h-4 w-2/3 bg-slate-100 rounded mb-2"></div>
        <div className="h-3 w-20 bg-slate-100 rounded"></div>
      </div>
    </div>
  </div>
);

// AI Insight Generator
const getAIInsight = (stats, history) => {
  const total = stats.total;
  const safePercent = total > 0 ? Math.round((stats.safe / total) * 100) : 0;
  
  if (total === 0) return null;
  
  if (total < 3) {
    return {
      emoji: "📊",
      text: `You've scanned ${total} product${total > 1 ? 's' : ''}. Keep going to discover health patterns!`
    };
  }
  
  if (safePercent >= 70) {
    return {
      emoji: "🎉",
      text: `Amazing! ${safePercent}% of your scans are healthy choices. You're making great decisions!`
    };
  } else if (safePercent >= 50) {
    return {
      emoji: "👍",
      text: `Good progress! ${stats.safe} out of ${total} products are safe. Consider swapping some caution items for healthier alternatives.`
    };
  } else if (stats.avoid > stats.safe) {
    return {
      emoji: "💪",
      text: `Your awareness is growing! You've identified ${stats.avoid} products to avoid. Knowledge is power!`
    };
  } else {
    return {
      emoji: "🔍",
      text: `You're developing a critical eye for ingredients. ${stats.caution} products need attention - check for healthier swaps!`
    };
  }
};

export default function HistoryScreen({ 
  history, 
  stats,
  onScanClick, 
  onViewScan, 
  onDeleteScan,
  onClearHistory 
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, safe, caution, avoid

  const filteredHistory = filter === 'all' 
    ? history 
    : history.filter((scan) => scan.verdict?.toLowerCase() === filter);

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header - Curved gradient like reference */}
      <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 px-5 pt-12 pb-8 lg:px-8 lg:pt-8 rounded-b-[2.5rem]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl lg:text-3xl font-bold italic">Scan History</h1>
              <p className="text-white/80 text-sm mt-1">{history.length} products analyzed</p>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="bg-white/20 hover:bg-white/30 text-white text-sm flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 lg:px-8 pt-6 max-w-4xl mx-auto">
        {history.length > 0 ? (
          <>
            {/* Stats */}
            <StatsCard stats={stats} />

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { id: 'all', label: 'All', count: stats.total },
                { id: 'safe', label: 'Safe', count: stats.safe },
                { id: 'caution', label: 'Caution', count: stats.caution },
                { id: 'avoid', label: 'Avoid', count: stats.avoid },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    filter === tab.id
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* History List */}
            <div className="space-y-3">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((scan) => (
                  <HistoryItem
                    key={scan.id}
                    scan={scan}
                    onClick={onViewScan}
                    onDelete={onDeleteScan}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No {filter} products in your history.
                </div>
              )}
            </div>

            {/* AI Insight */}
            {(() => {
              const insight = getAIInsight(stats, history);
              return insight && (
                <div className="mt-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-3 border border-purple-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-purple-900 text-xs">Your Health Pattern</h3>
                      <p className="text-purple-700 text-xs mt-0.5 line-clamp-2">
                        {insight.emoji} {insight.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </>
        ) : (
          <EmptyState onScanClick={onScanClick} />
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowClearConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-center text-slate-800 mb-2">
              Clear all history?
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              This will delete all {history.length} scanned products. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2.5 bg-red-600 rounded-xl text-white font-medium hover:bg-red-500 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
