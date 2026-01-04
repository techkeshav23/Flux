'use client';

import { 
  X, 
  Shield, 
  AlertTriangle, 
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Share2,
  Bookmark,
  ArrowLeft,
  Sparkles,
  Info
} from 'lucide-react';

const VerdictHeader = ({ verdict, summary }) => {
  const config = {
    Safe: {
      gradient: 'from-emerald-500 to-teal-600',
      icon: Shield,
      label: 'Safe to Consume',
      bgLight: 'bg-emerald-50',
    },
    Caution: {
      gradient: 'from-amber-500 to-orange-500',
      icon: AlertTriangle,
      label: 'Consume with Caution',
      bgLight: 'bg-amber-50',
    },
    Avoid: {
      gradient: 'from-red-500 to-rose-600',
      icon: XCircle,
      label: 'Best to Avoid',
      bgLight: 'bg-red-50',
    },
  };

  const { gradient, icon: Icon, label } = config[verdict] || config.Caution;

  return (
    <div className={`bg-gradient-to-br ${gradient} px-5 pt-14 pb-6 rounded-b-3xl lg:rounded-3xl lg:mx-6 lg:mt-6`}>
      <div className="text-center max-w-xl mx-auto">
        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
          <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
        </div>
        <h1 className="text-white text-2xl lg:text-3xl font-bold">{label}</h1>
        <p className="text-white/90 mt-2 text-sm lg:text-base leading-relaxed">
          {summary}
        </p>
      </div>
    </div>
  );
};

const InsightCard = ({ insight, index }) => {
  const typeConfig = {
    Positive: {
      icon: ThumbsUp,
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      titleColor: 'text-emerald-700',
    },
    Negative: {
      icon: ThumbsDown,
      bg: 'bg-red-50',
      border: 'border-red-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-700',
    },
    Neutral: {
      icon: Minus,
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600',
      titleColor: 'text-slate-700',
    },
  };

  const config = typeConfig[insight.type] || typeConfig.Neutral;
  const Icon = config.icon;

  return (
    <div 
      className={`${config.bg} ${config.border} border rounded-2xl p-4 animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${config.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${config.titleColor}`}>
            {insight.title}
          </h3>
          <p className="text-slate-600 text-sm mt-1 leading-relaxed">
            {insight.explanation}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function ResultsView({ result, productName, onClose, onSaveToHistory }) {
  if (!result) return null;

  const positiveInsights = result.keyInsights.filter(i => i.type === 'Positive');
  const negativeInsights = result.keyInsights.filter(i => i.type === 'Negative');
  const neutralInsights = result.keyInsights.filter(i => i.type === 'Neutral');

  return (
    <div className="fixed inset-0 z-50 bg-white lg:bg-slate-100/95 overflow-y-auto animate-fade-in">
      <div className="max-w-md lg:max-w-4xl mx-auto min-h-screen relative lg:py-6">
        {/* Desktop Close Button */}
        <button
          onClick={onClose}
          className="hidden lg:flex absolute top-8 right-8 z-20 items-center gap-2 bg-white shadow-lg rounded-full px-4 py-2 text-slate-600 hover:text-slate-800 hover:shadow-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Mobile Back Button */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 left-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 lg:top-8 lg:right-auto lg:left-8 z-10 flex gap-2">
          <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors lg:bg-white lg:text-slate-600 lg:shadow-lg lg:hover:shadow-xl">
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={onSaveToHistory}
            className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors lg:bg-white lg:text-slate-600 lg:shadow-lg lg:hover:shadow-xl"
          >
            <Bookmark className="w-5 h-5" />
          </button>
        </div>

        {/* Verdict Header */}
        <VerdictHeader 
          verdict={result.verdict} 
          summary={result.oneLineSummary} 
        />

        {/* Product Name (if available) */}
        {productName && (
          <div className="px-5 lg:px-6 mt-4">
            <div className="bg-slate-100 lg:bg-white lg:shadow-sm lg:border lg:border-slate-100 rounded-xl px-4 py-3">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Product</p>
              <p className="text-slate-800 font-medium lg:text-lg">{productName}</p>
            </div>
          </div>
        )}

        {/* Insights Section */}
        <div className="px-5 lg:px-6 py-6">
          {/* AI Badge */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Key Insights</p>
              <p className="text-xs text-slate-500">AI-powered analysis</p>
            </div>
          </div>

          {/* Desktop Grid Layout for Insights */}
          {/* Desktop Grid Layout for Insights */}
          <div className="lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6">
            {/* Negative Insights First (Most Important) */}
            {negativeInsights.length > 0 && (
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm font-medium text-red-700">Concerns</span>
                  <span className="text-xs text-slate-400">({negativeInsights.length})</span>
                </div>
                <div className="space-y-3">
                  {negativeInsights.map((insight, i) => (
                    <InsightCard key={i} insight={insight} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Positive Insights */}
            {positiveInsights.length > 0 && (
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-sm font-medium text-emerald-700">Benefits</span>
                  <span className="text-xs text-slate-400">({positiveInsights.length})</span>
                </div>
                <div className="space-y-3">
                  {positiveInsights.map((insight, i) => (
                    <InsightCard key={i} insight={insight} index={i + negativeInsights.length} />
                  ))}
                </div>
              </div>
            )}

            {/* Neutral Insights */}
            {neutralInsights.length > 0 && (
              <div className="mb-4 lg:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-slate-400 rounded-full" />
                  <span className="text-sm font-medium text-slate-600">Notes</span>
                  <span className="text-xs text-slate-400">({neutralInsights.length})</span>
                </div>
                <div className="space-y-3">
                  {neutralInsights.map((insight, i) => (
                    <InsightCard 
                      key={i} 
                      insight={insight} 
                      index={i + negativeInsights.length + positiveInsights.length} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-slate-50 lg:bg-white lg:border lg:border-slate-200 rounded-xl p-4 mt-6 flex items-start gap-3 lg:col-span-full">
            <Info className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs lg:text-sm text-slate-500 leading-relaxed">
              This analysis is based on general nutritional research and is not a substitute for professional medical advice. Individual health needs may vary.
            </p>
          </div>

          {/* Bottom Actions - Responsive */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={onSaveToHistory}
              className="flex-1 bg-emerald-600 text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors hover:shadow-lg hover:shadow-emerald-500/25"
            >
              <Bookmark className="w-5 h-5" />
              Save to History
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 rounded-xl py-4 font-medium hover:bg-slate-200 transition-colors"
            >
              Scan Another Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
