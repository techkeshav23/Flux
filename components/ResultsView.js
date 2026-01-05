'use client';

import { 
  ArrowLeft,
  Check,
  AlertTriangle,
  X,
  ChevronRight,
  Info,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

// Clean Language Toggle
const LanguageToggle = ({ currentLanguage, onSwitch }) => (
  <div className="flex bg-white/90 backdrop-blur rounded-lg p-0.5 shadow-sm border border-slate-200">
    <button
      onClick={() => onSwitch('en')}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
        currentLanguage === 'en' 
          ? 'bg-slate-900 text-white' 
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      EN
    </button>
    <button
      onClick={() => onSwitch('hi')}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
        currentLanguage === 'hi' 
          ? 'bg-slate-900 text-white' 
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      हिंदी
    </button>
  </div>
);

// Clean Verdict Header
const VerdictHeader = ({ verdict, verdictLabel, confidence }) => {
  const config = {
    Safe: {
      bg: 'bg-emerald-600',
      icon: Check,
      iconBg: 'bg-emerald-500',
    },
    Caution: {
      bg: 'bg-amber-500',
      icon: AlertTriangle,
      iconBg: 'bg-amber-400',
    },
    Avoid: {
      bg: 'bg-red-600',
      icon: X,
      iconBg: 'bg-red-500',
    },
  };

  const { bg, icon: Icon, iconBg } = config[verdict] || config.Caution;

  return (
    <div className={`${bg} px-6 pt-16 pb-8`}>
      <div className="max-w-lg mx-auto">
        <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
          <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-white text-2xl font-bold text-center mb-2">
          {verdictLabel}
        </h1>
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
          <span>{confidence}% confident</span>
        </div>
      </div>
    </div>
  );
};

// Clean Info Card
const InfoCard = ({ title, content, subtitle }) => {
  if (!content) return null;
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-700 leading-relaxed">{content}</p>
      {subtitle && (
        <p className="text-slate-500 text-sm mt-2">{subtitle}</p>
      )}
    </div>
  );
};

// Clean List Item
const ListItem = ({ title, description, type = 'neutral' }) => {
  const styles = {
    good: { dot: 'bg-emerald-500', title: 'text-slate-900' },
    bad: { dot: 'bg-red-500', title: 'text-slate-900' },
    neutral: { dot: 'bg-slate-400', title: 'text-slate-900' },
  };
  const style = styles[type] || styles.neutral;

  return (
    <div className="flex gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className={`w-2 h-2 ${style.dot} rounded-full mt-2 flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className={`font-medium ${style.title}`}>{title}</p>
        <p className="text-slate-600 text-sm mt-0.5">{description}</p>
      </div>
    </div>
  );
};

// Clean Section
const Section = ({ title, children, icon: Icon }) => {
  if (!children) return null;
  
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-slate-500" />}
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
};

// Advice Card
const AdviceCard = ({ advice, tip, language }) => {
  if (!advice) return null;
  
  return (
    <div className="bg-slate-900 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-slate-400 mb-1">
            {language === 'hi' ? 'सलाह' : 'Advice'}
          </p>
          <p className="text-white font-medium leading-relaxed">{advice}</p>
          {tip && (
            <p className="text-slate-400 text-sm mt-3 pt-3 border-t border-slate-700">
              💡 {tip}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ResultsView({ 
  result, 
  productName, 
  onClose, 
  currentLanguage = 'en', 
  onLanguageSwitch
}) {
  if (!result) return null;

  const langContent = result[currentLanguage] || result.en || {};
  const { verdict = 'Caution', confidence = 75 } = result;

  const verdictLabel = langContent.verdictLabel || 
    (verdict === 'Safe' ? (currentLanguage === 'hi' ? 'सुरक्षित' : 'Safe to consume') : 
     verdict === 'Avoid' ? (currentLanguage === 'hi' ? 'इससे बचें' : 'Better to avoid') : 
     (currentLanguage === 'hi' ? 'सावधानी रखें' : 'Use with caution'));
  
  const simpleSummary = langContent.simpleSummary || result.simpleSummary || result.summary;
  const whatIsThis = langContent.whatIsThis || result.whatIsThis;
  const goodThings = langContent.goodThings || result.goodThings || [];
  const concerns = langContent.concerns || result.concerns || [];
  const whoShouldAvoid = langContent.whoShouldAvoid || result.whoShouldAvoid;
  const simpleAdvice = langContent.simpleAdvice || result.simpleAdvice || result.bottomLine;
  const dailyLifeTip = langContent.dailyLifeTip || result.dailyLifeTip;

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto">
      <div className="max-w-lg mx-auto min-h-screen pb-6">
        
        {/* Top Bar */}
        <div className="fixed top-0 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-slate-700 hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <LanguageToggle currentLanguage={currentLanguage} onSwitch={onLanguageSwitch} />
        </div>

        {/* Verdict Header */}
        <VerdictHeader verdict={verdict} verdictLabel={verdictLabel} confidence={confidence} />

        {/* Content */}
        <div className="px-4 py-5 space-y-4">
          
          <InfoCard 
            title={currentLanguage === 'hi' ? 'सारांश' : 'Summary'}
            content={simpleSummary}
            subtitle={whatIsThis}
          />

          {goodThings.length > 0 && (
            <Section title={currentLanguage === 'hi' ? 'अच्छी बातें' : 'Benefits'} icon={Check}>
              {goodThings.map((item, i) => (
                <ListItem key={i} title={item.title} description={item.explanation} type="good" />
              ))}
            </Section>
          )}

          {concerns.length > 0 && (
            <Section title={currentLanguage === 'hi' ? 'चिंताएं' : 'Concerns'} icon={AlertTriangle}>
              {concerns.map((item, i) => (
                <ListItem key={i} title={item.title} description={item.explanation} type="bad" />
              ))}
            </Section>
          )}

          {whoShouldAvoid && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-900 mb-1">
                    {currentLanguage === 'hi' ? 'किसे बचना चाहिए' : 'Who should avoid'}
                  </p>
                  <p className="text-red-800 text-sm">{whoShouldAvoid}</p>
                </div>
              </div>
            </div>
          )}

          <AdviceCard advice={simpleAdvice} tip={dailyLifeTip} language={currentLanguage} />

          <div className="flex items-start gap-2 px-1">
            <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              {currentLanguage === 'hi' 
                ? 'यह AI द्वारा सामान्य जानकारी है, डॉक्टर की सलाह नहीं।'
                : "AI-generated general info. Not medical advice."
              }
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-900 text-white rounded-xl py-4 font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            {currentLanguage === 'hi' ? 'नया स्कैन करें' : 'Scan Another'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
