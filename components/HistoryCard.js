'use client';

import { Shield, Clock, ChevronRight, Leaf, AlertTriangle, XCircle } from 'lucide-react';

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

export default function HistoryCard({ item, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl p-4 lg:p-5 shadow-sm border border-slate-100 hover:shadow-lg hover:border-emerald-200 hover:-translate-y-0.5 transition-all duration-200 text-left group lg:bg-slate-50/80 lg:hover:bg-white"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <VerdictBadge verdict={item.verdict} />
          </div>
          <h3 className="font-semibold text-slate-800 truncate group-hover:text-emerald-600 transition-colors lg:text-lg">
            {item.productName}
          </h3>
          <p className="text-sm text-slate-500 mt-1 line-clamp-2 lg:line-clamp-3">
            {item.oneLineSummary}
          </p>
          <div className="flex items-center gap-1.5 mt-3 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs">{item.timestamp}</span>
          </div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
          <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  );
}
