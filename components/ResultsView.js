'use client';

import { 
  Shield, 
  AlertTriangle, 
  XCircle,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Info,
  Heart,
  Ban
} from 'lucide-react';

// Language Toggle Button Component
const LanguageToggle = ({ currentLanguage, onSwitch }) => {
  return (
    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full p-1">
      <button
        onClick={() => onSwitch('en')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          currentLanguage === 'en' 
            ? 'bg-white text-slate-800 shadow-sm' 
            : 'text-white/80 hover:text-white'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => onSwitch('hi')}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          currentLanguage === 'hi' 
            ? 'bg-white text-slate-800 shadow-sm' 
            : 'text-white/80 hover:text-white'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
};

// Verdict Badge with Emoji
const VerdictBadge = ({ verdict, verdictEmoji, verdictLabel }) => {
  const config = {
    Safe: {
      gradient: 'from-emerald-500 to-teal-600',
      icon: Shield,
      defaultEmoji: '✅',
      defaultLabel: 'Good to go!',
    },
    Caution: {
      gradient: 'from-amber-500 to-orange-500',
      icon: AlertTriangle,
      defaultEmoji: '⚠️',
      defaultLabel: 'Be careful',
    },
    Avoid: {
      gradient: 'from-red-500 to-rose-600',
      icon: XCircle,
      defaultEmoji: '❌',
      defaultLabel: 'Better avoid',
    },
  };

  const { gradient, defaultEmoji, defaultLabel } = config[verdict] || config.Caution;
  const emoji = verdictEmoji || defaultEmoji;
  const label = verdictLabel || defaultLabel;

  return (
    <div className={`bg-gradient-to-br ${gradient} px-5 pt-16 pb-8 rounded-b-3xl lg:rounded-3xl lg:mx-6 lg:mt-6`}>
      <div className="text-center max-w-xl mx-auto">
        <div className="text-6xl lg:text-7xl mb-4">
          {emoji}
        </div>
        <h1 className="text-white text-2xl lg:text-3xl font-bold mb-2">{label}</h1>
      </div>
    </div>
  );
};

// Simple Summary Card
const SummaryCard = ({ simpleSummary, whatIsThis, language }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Info className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-900 mb-2">
            {language === 'hi' ? 'सारांश' : 'Quick Summary'}
          </h3>
          <p className="text-blue-800 text-lg font-medium leading-relaxed">
            {simpleSummary}
          </p>
          {whatIsThis && (
            <p className="text-blue-700 text-sm mt-3 leading-relaxed">
              {whatIsThis}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Good Things Section
const GoodThingsSection = ({ items, language }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <ThumbsUp className="w-5 h-5 text-emerald-500" />
        <h3 className="font-semibold text-slate-800">
          {language === 'hi' ? 'अच्छी बातें 👍' : 'Good Things 👍'}
        </h3>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.icon || '✨'}</span>
              <div>
                <h4 className="font-semibold text-emerald-800">{item.title}</h4>
                <p className="text-emerald-700 text-sm mt-1">{item.explanation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Concerns Section
const ConcernsSection = ({ items, language }) => {
  if (!items || items.length === 0) return null;
  
  const severityColors = {
    low: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', title: 'text-amber-900' },
    medium: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', title: 'text-orange-900' },
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', title: 'text-red-900' },
  };
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <ThumbsDown className="w-5 h-5 text-red-500" />
        <h3 className="font-semibold text-slate-800">
          {language === 'hi' ? 'चिंता की बातें ⚠️' : 'Concerns ⚠️'}
        </h3>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => {
          const colors = severityColors[item.severity] || severityColors.medium;
          return (
            <div key={i} className={`${colors.bg} ${colors.border} border rounded-xl p-4`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon || '⚠️'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`font-semibold ${colors.title}`}>{item.title}</h4>
                    {item.severity === 'high' && (
                      <span className="text-xs bg-red-200 text-red-700 px-2 py-0.5 rounded-full">
                        {language === 'hi' ? 'गंभीर' : 'Serious'}
                      </span>
                    )}
                  </div>
                  <p className={`${colors.text} text-sm mt-1`}>{item.explanation}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Who Should Avoid Section
const WhoShouldAvoidSection = ({ content, language }) => {
  if (!content) return null;
  
  return (
    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Ban className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-semibold text-purple-900 mb-2">
            {language === 'hi' ? 'किसे नहीं खाना चाहिए?' : 'Who should avoid this?'}
          </h3>
          <p className="text-purple-800 text-sm leading-relaxed">{content}</p>
        </div>
      </div>
    </div>
  );
};

// Simple Advice Card
const SimpleAdviceCard = ({ advice, dailyTip, language }) => {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
          <Heart className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="font-semibold text-white mb-1">
            {language === 'hi' ? 'मेरी सलाह 💡' : 'My Advice 💡'}
          </h3>
          <p className="text-slate-200 text-lg font-medium leading-relaxed">
            "{advice}"
          </p>
        </div>
      </div>
      
      {dailyTip && (
        <div className="bg-white/10 rounded-xl p-4 mt-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-300 text-xs font-medium mb-1">
                {language === 'hi' ? 'Daily Tip' : 'Practical Tip'}
              </p>
              <p className="text-slate-300 text-sm">{dailyTip}</p>
            </div>
          </div>
        </div>
      )}
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

  // Get language-specific content from bilingual response
  const langContent = result[currentLanguage] || result.en || {};
  
  const { 
    verdict = 'Caution', 
    confidence = 75,
  } = result;

  // Extract language-specific fields
  const verdictLabel = langContent.verdictLabel || (verdict === 'Safe' ? 'Good to go!' : verdict === 'Avoid' ? 'Better avoid' : 'Be careful');
  const simpleSummary = langContent.simpleSummary || result.simpleSummary || result.summary;
  const whatIsThis = langContent.whatIsThis || result.whatIsThis;
  const goodThings = langContent.goodThings || result.goodThings || [];
  const concerns = langContent.concerns || result.concerns || [];
  const whoShouldAvoid = langContent.whoShouldAvoid || result.whoShouldAvoid;
  const simpleAdvice = langContent.simpleAdvice || result.simpleAdvice || result.bottomLine;
  const dailyLifeTip = langContent.dailyLifeTip || result.dailyLifeTip;

  // Verdict emoji based on verdict
  const verdictEmoji = verdict === 'Safe' ? '✅' : verdict === 'Avoid' ? '❌' : '⚠️';

  return (
    <div className="fixed inset-0 z-50 bg-white lg:bg-slate-100/95 overflow-y-auto animate-fade-in">
      <div className="max-w-md lg:max-w-2xl mx-auto min-h-screen relative lg:py-6">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors lg:bg-white lg:text-slate-600 lg:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="absolute top-4 right-4 z-10">
          <LanguageToggle 
            currentLanguage={currentLanguage}
            onSwitch={onLanguageSwitch}
          />
        </div>

        <VerdictBadge 
          verdict={verdict} 
          verdictEmoji={verdictEmoji}
          verdictLabel={verdictLabel}
        />

        <div className="px-5 lg:px-6 py-6 space-y-5">
          
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-600">
                  {currentLanguage === 'hi' ? 'विश्वास स्तर' : 'Confidence'}
                </span>
                <span className="text-sm font-semibold text-slate-800">{confidence}%</span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          </div>

          <SummaryCard 
            simpleSummary={simpleSummary}
            whatIsThis={whatIsThis}
            language={currentLanguage}
          />

          <GoodThingsSection items={goodThings} language={currentLanguage} />
          <ConcernsSection items={concerns} language={currentLanguage} />
          <WhoShouldAvoidSection content={whoShouldAvoid} language={currentLanguage} />

          <SimpleAdviceCard 
            advice={simpleAdvice || "Check with a doctor if unsure."}
            dailyTip={dailyLifeTip}
            language={currentLanguage}
          />

          <div className="bg-slate-100 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              {currentLanguage === 'hi' 
                ? 'मैं एक AI हूं और सामान्य जानकारी दे रहा हूं। यह डॉक्टर की सलाह नहीं है। किसी भी स्वास्थ्य समस्या के लिए डॉक्टर से मिलें।'
                : "I'm an AI giving general info. This is not medical advice. Please consult a doctor for any health concerns."
              }
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-emerald-600 text-white rounded-xl py-4 font-semibold hover:bg-emerald-700 transition-colors"
          >
            {currentLanguage === 'hi' ? 'और स्कैन करें' : 'Scan Another'}
          </button>
        </div>
      </div>
    </div>
  );
}
