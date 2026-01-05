'use client';

import { 
  Shield, 
  AlertTriangle, 
  XCircle,
  Bookmark,
  ArrowLeft,
  Sparkles,
  Brain,
  MessageCircle,
  Lightbulb,
  Scale,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  HelpCircle
} from 'lucide-react';

const ThinkingSection = ({ thinking }) => {
  if (!thinking) return null;
  
  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border border-purple-100">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-purple-900">My Reasoning Process</h3>
      </div>
      <p className="text-purple-800 text-sm leading-relaxed italic">
        "{thinking}"
      </p>
    </div>
  );
};

const FindingCard = ({ finding, index }) => {
  const config = {
    Positive: {
      icon: TrendingUp,
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      titleColor: 'text-emerald-800',
    },
    Negative: {
      icon: TrendingDown,
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-800',
    },
    Uncertain: {
      icon: HelpCircle,
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-800',
    },
  };

  const style = config[finding.type] || config.Uncertain;
  const Icon = style.icon;

  return (
    <div 
      className={`${style.bg} ${style.border} border rounded-xl p-4 animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${style.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-semibold ${style.titleColor}`}>{finding.ingredient}</h4>
            {finding.confidence && (
              <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full text-slate-600">
                {finding.confidence}% sure
              </span>
            )}
          </div>
          <p className="text-slate-700 text-sm">{finding.insight}</p>
          {finding.reasoning && (
            <p className="text-slate-500 text-xs mt-2 italic">→ {finding.reasoning}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const VerdictHeader = ({ verdict, confidence, summary }) => {
  const config = {
    Safe: {
      gradient: 'from-emerald-500 to-teal-600',
      icon: Shield,
      label: 'Looks Good',
    },
    Caution: {
      gradient: 'from-amber-500 to-orange-500',
      icon: AlertTriangle,
      label: 'Worth Considering',
    },
    Avoid: {
      gradient: 'from-red-500 to-rose-600',
      icon: XCircle,
      label: 'I Have Concerns',
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
        <p className="text-white/90 mt-3 text-sm lg:text-base leading-relaxed">
          {summary}
        </p>
        
        {/* Confidence indicator */}
        {confidence && (
          <div className="mt-4 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Confidence Level: {confidence}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function ResultsView({ result, productName, onClose }) {
  if (!result) return null;

  const { 
    verdict, 
    confidence = 75, 
    summary,
    oneLineSummary,
    reasoning, 
    keyFindings = [], 
    keyInsights = [],
    tradeoffs, 
    uncertainties, 
    bottomLine,
    thinking 
  } = result;

  // Support both new and old format
  const displaySummary = summary || oneLineSummary;
  const findings = keyFindings.length > 0 ? keyFindings : keyInsights.map(i => ({
    ingredient: i.title,
    type: i.type === 'Neutral' ? 'Uncertain' : i.type,
    insight: i.explanation,
    reasoning: ''
  }));

  return (
    <div className="fixed inset-0 z-50 bg-white lg:bg-slate-100/95 overflow-y-auto animate-fade-in">
      <div className="max-w-md lg:max-w-3xl mx-auto min-h-screen relative lg:py-6">
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors lg:bg-white lg:text-slate-600 lg:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>



        {/* Verdict Header */}
        <VerdictHeader 
          verdict={verdict} 
          confidence={confidence}
          summary={displaySummary} 
        />

        {/* Content */}
        <div className="px-5 lg:px-6 py-6 space-y-5">
          
          {/* AI Badge */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">AI Analysis</p>
              <p className="text-xs text-slate-500">Powered by reasoning, not just data lookup</p>
            </div>
          </div>

          {/* Thinking/Reasoning Process */}
          <ThinkingSection thinking={thinking} />

          {/* Main Reasoning */}
          {reasoning && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Here's my take</h3>
              </div>
              <p className="text-slate-700 leading-relaxed">{reasoning}</p>
            </div>
          )}

          {/* Key Findings */}
          {findings.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-slate-800">Key Findings</h3>
              </div>
              <div className="space-y-3">
                {findings.map((finding, i) => (
                  <FindingCard key={i} finding={finding} index={i} />
                ))}
              </div>
            </div>
          )}

          {/* Tradeoffs */}
          {tradeoffs && (
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <Scale className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Tradeoffs to Consider</h3>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">{tradeoffs}</p>
            </div>
          )}

          {/* Uncertainties */}
          {uncertainties && (
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-amber-900">What I'm Uncertain About</h3>
              </div>
              <p className="text-amber-800 text-sm leading-relaxed">{uncertainties}</p>
            </div>
          )}

          {/* Bottom Line */}
          {bottomLine && (
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Bottom Line</h3>
              </div>
              <p className="text-slate-200 text-lg font-medium leading-relaxed">
                "{bottomLine}"
              </p>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-slate-100 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              I'm an AI assistant providing general guidance based on available information. 
              This isn't medical advice. Individual health needs vary - consult a healthcare 
              professional for personalized guidance.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex-1 bg-slate-100 text-slate-400 rounded-xl py-4 font-semibold flex items-center justify-center gap-2 cursor-not-allowed">
              <Bookmark className="w-5 h-5" />
              Save Analysis
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">Soon</span>
            </div>
            <button
              onClick={onClose}
              className="flex-1 bg-emerald-600 text-white rounded-xl py-4 font-medium hover:bg-emerald-700 transition-colors"
            >
              Analyze Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
