'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft,
  Check,
  AlertTriangle,
  X,
  ChevronRight,
  Info,
  ShieldAlert,
  Sparkles,
  Volume2,
  VolumeX,
  Share2,
  Lightbulb,
  Search,
  ArrowRight
} from 'lucide-react';

// Clean Language Toggle
const LanguageToggle = ({ currentLanguage, onSwitch }) => (
  <div 
    className="flex bg-white/90 backdrop-blur rounded-lg p-0.5 shadow-sm border border-slate-200"
    role="group"
    aria-label="Language selection"
  >
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
    <div className={`${bg} px-6 pt-16 pb-8 lg:pt-8 lg:h-full lg:flex lg:flex-col lg:justify-center`}>
      <div className="max-w-lg mx-auto lg:max-w-none">
        <div className={`w-16 h-16 lg:w-20 lg:h-20 ${iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
          <Icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" strokeWidth={2.5} />
        </div>
        <h1 className="text-white text-2xl lg:text-3xl font-bold text-center mb-2">
          {verdictLabel}
        </h1>
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm lg:text-base">
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
    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl p-5">
      <div className="flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-emerald-200 mb-1">
            {language === 'hi' ? 'सलाह' : 'Advice'}
          </p>
          <p className="text-white font-medium leading-relaxed">{advice}</p>
          {tip && (
            <p className="text-emerald-100 text-sm mt-3 pt-3 border-t border-white/20">
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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [hasAutoSpoken, setHasAutoSpoken] = useState(false);

  // Check for speech synthesis support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSupported('speechSynthesis' in window);
    }
  }, []);

  // Build the speech text based on current language
  const getSpeechText = useCallback(() => {
    if (!result) return '';
    
    const langContent = result[currentLanguage] || result.en || {};
    const verdict = result.verdict || 'Caution';
    
    const verdictLabel = langContent.verdictLabel || 
      (verdict === 'Safe' ? (currentLanguage === 'hi' ? 'सुरक्षित' : 'Safe to consume') : 
       verdict === 'Avoid' ? (currentLanguage === 'hi' ? 'इससे बचें' : 'Better to avoid') : 
       (currentLanguage === 'hi' ? 'सावधानी रखें' : 'Use with caution'));
    
    const summary = langContent.simpleSummary || result.simpleSummary || result.summary || '';
    const advice = langContent.simpleAdvice || result.simpleAdvice || result.bottomLine || '';
    
    if (currentLanguage === 'hi') {
      return `निर्णय: ${verdictLabel}। ${summary}। सलाह: ${advice}`;
    } else {
      return `Verdict: ${verdictLabel}. ${summary}. Advice: ${advice}`;
    }
  }, [result, currentLanguage]);

  // Speak the results
  const speakResults = useCallback(() => {
    if (!speechSupported || !result) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const text = getSpeechText();
    if (!text) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [speechSupported, result, currentLanguage, getSpeechText]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  // Toggle speech
  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speakResults();
    }
  };

  // Auto-speak when results first appear
  useEffect(() => {
    if (result && speechSupported && !hasAutoSpoken) {
      // Small delay to let the UI render first
      const timer = setTimeout(() => {
        speakResults();
        setHasAutoSpoken(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [result, speechSupported, hasAutoSpoken, speakResults]);

  // Re-speak when language changes
  useEffect(() => {
    if (result && speechSupported && hasAutoSpoken) {
      speakResults();
    }
  }, [currentLanguage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Reset auto-spoken flag when result changes
  useEffect(() => {
    setHasAutoSpoken(false);
  }, [result]);

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
  const personalWarnings = langContent.personalWarnings || result.personalWarnings || [];
  const isPersonalized = result.personalizedForUser || false;

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 overflow-y-auto lg:bg-slate-900/50 lg:backdrop-blur-sm lg:flex lg:items-center lg:justify-center lg:p-8">
      <div className="min-h-screen lg:min-h-0 bg-white lg:rounded-2xl lg:shadow-2xl lg:max-w-4xl lg:w-full lg:max-h-[90vh] lg:overflow-hidden lg:flex lg:flex-col">
        
        {/* Top Bar - Mobile floating, Desktop integrated */}
        <div className="fixed lg:static top-0 left-0 right-0 z-20 px-4 py-3 flex items-center justify-between lg:bg-white lg:border-b lg:border-slate-100">
          <button
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-slate-700 hover:bg-white transition-colors lg:shadow-none lg:bg-slate-100 lg:border-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {/* Share Button */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <button
                onClick={() => {
                  navigator.share({
                    title: `Flux Analysis: ${productName || 'Product'}`,
                    text: `Verdict: ${verdict} (${confidence}% confident)\n${simpleSummary || ''}\n\nAnalyzed with Flux Agent - AI Health Co-pilot`,
                  }).catch(() => {});
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 backdrop-blur shadow-sm border border-slate-200 text-slate-700 hover:bg-white lg:bg-slate-100 lg:border-0 transition-colors"
                title="Share results"
              >
                <Share2 className="w-5 h-5" />
              </button>
            )}
            {speechSupported && (
              <button
                onClick={toggleSpeech}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isSpeaking 
                    ? 'bg-emerald-500 text-white animate-pulse' 
                    : 'bg-white/90 backdrop-blur shadow-sm border border-slate-200 text-slate-700 hover:bg-white lg:bg-slate-100 lg:border-0'
                }`}
                title={isSpeaking ? 'Stop speaking' : 'Listen to results'}
              >
                {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            )}
            <LanguageToggle currentLanguage={currentLanguage} onSwitch={onLanguageSwitch} />
          </div>
        </div>

        <div className="lg:flex lg:flex-1 lg:overflow-hidden">
          {/* Verdict Header - Sidebar on desktop */}
          <div className="lg:w-72 lg:flex-shrink-0">
            <VerdictHeader verdict={verdict} verdictLabel={verdictLabel} confidence={confidence} />
          </div>

          {/* Content - Scrollable on desktop */}
          <div className="px-4 py-5 pb-8 space-y-4 lg:flex-1 lg:overflow-y-auto lg:px-6 lg:py-6">
          
            <InfoCard 
              title={currentLanguage === 'hi' ? 'सारांश' : 'Summary'}
              content={simpleSummary}
              subtitle={whatIsThis}
            />

            {/* Personalized Warnings - Only shown when user has health profile */}
            {personalWarnings.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-purple-900">
                    {currentLanguage === 'hi' ? '🎯 आपके लिए विशेष' : '🎯 Personalized for You'}
                  </h3>
                </div>
                <div className="space-y-2">
                  {personalWarnings.map((warning, i) => (
                    <div key={i} className="flex items-start gap-2 bg-white/60 rounded-lg p-3">
                      <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                        warning.severity === 'high' ? 'text-red-500' : 
                        warning.severity === 'medium' ? 'text-amber-500' : 'text-purple-500'
                      }`} />
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{warning.title}</p>
                        <p className="text-slate-600 text-xs mt-0.5">{warning.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personalized Badge */}
            {isPersonalized && personalWarnings.length === 0 && (
              <div className="flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-lg px-3 py-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-700">
                  {currentLanguage === 'hi' 
                    ? 'आपकी स्वास्थ्य प्रोफाइल के अनुसार विश्लेषित' 
                    : 'Analyzed based on your health profile'}
                </span>
              </div>
            )}

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

            {/* Proactive AI Suggestions - Only for Caution/Avoid */}
            {(verdict === 'Caution' || verdict === 'Avoid') && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-blue-900">
                    {currentLanguage === 'hi' ? '🤖 AI सुझाव' : '🤖 AI Suggests'}
                  </h3>
                </div>
                <p className="text-blue-800 text-sm mb-3">
                  {currentLanguage === 'hi' 
                    ? 'क्या आप इसका स्वस्थ विकल्प खोजना चाहेंगे?'
                    : 'Would you like me to suggest healthier alternatives?'
                  }
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const searchQuery = `healthy alternative to ${productName || 'this product'}`;
                      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
                  >
                    <Search className="w-4 h-4" />
                    {currentLanguage === 'hi' ? 'विकल्प खोजें' : 'Find Alternatives'}
                  </button>
                  <button
                    onClick={() => {
                      const tips = verdict === 'Avoid' 
                        ? (currentLanguage === 'hi' 
                            ? 'इस प्रोडक्ट से बचें। प्राकृतिक विकल्प चुनें।' 
                            : 'Avoid this product. Look for natural alternatives with fewer additives.')
                        : (currentLanguage === 'hi'
                            ? 'कभी-कभी ठीक है। बेहतर विकल्पों की तलाश करें।'
                            : 'Occasional use is fine. Consider exploring better options for regular use.');
                      alert(tips);
                    }}
                    className="flex items-center gap-2 bg-white text-blue-700 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {currentLanguage === 'hi' ? 'त्वरित सुझाव' : 'Quick Tip'}
                  </button>
                </div>
              </div>
            )}

            {/* Safe Product Encouragement */}
            {verdict === 'Safe' && (
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-emerald-900 font-medium text-sm">
                      {currentLanguage === 'hi' ? '🌟 शानदार चुनाव!' : '🌟 Great Choice!'}
                    </p>
                    <p className="text-emerald-700 text-xs mt-0.5">
                      {currentLanguage === 'hi' 
                        ? 'आप स्वस्थ विकल्प चुन रहे हैं। ऐसे ही जारी रखें!' 
                        : "You're making healthy choices. Keep it up!"
                      }
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
            )}

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
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="w-full bg-emerald-600 text-white rounded-xl py-4 font-semibold hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
            >
              {currentLanguage === 'hi' ? 'नया स्कैन करें' : 'Scan Another'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
