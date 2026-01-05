'use client';

import { useState } from 'react';
import { 
  X,
  Check,
  Heart,
  Leaf,
  AlertTriangle,
  Target,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const SECTIONS = [
  {
    id: 'dietary',
    title: 'Dietary Preferences',
    titleHi: 'आहार प्राथमिकताएं',
    icon: Leaf,
    color: 'emerald',
    options: [
      { key: 'vegetarian', label: 'Vegetarian', labelHi: 'शाकाहारी', emoji: '🥬' },
      { key: 'vegan', label: 'Vegan', labelHi: 'वीगन', emoji: '🌱' },
      { key: 'halal', label: 'Halal', labelHi: 'हलाल', emoji: '🍖' },
      { key: 'kosher', label: 'Kosher', labelHi: 'कोषेर', emoji: '✡️' },
      { key: 'glutenFree', label: 'Gluten-Free', labelHi: 'ग्लूटन-फ्री', emoji: '🌾' },
    ],
  },
  {
    id: 'conditions',
    title: 'Health Conditions',
    titleHi: 'स्वास्थ्य स्थितियां',
    icon: Heart,
    color: 'red',
    options: [
      { key: 'diabetic', label: 'Diabetic', labelHi: 'मधुमेह', emoji: '💉' },
      { key: 'hypertension', label: 'High Blood Pressure', labelHi: 'उच्च रक्तचाप', emoji: '❤️‍🩹' },
      { key: 'heartDisease', label: 'Heart Disease', labelHi: 'हृदय रोग', emoji: '🫀' },
      { key: 'pregnant', label: 'Pregnant/Nursing', labelHi: 'गर्भवती/स्तनपान', emoji: '🤰' },
      { key: 'lactoseIntolerant', label: 'Lactose Intolerant', labelHi: 'लैक्टोज असहिष्णु', emoji: '🥛' },
      { key: 'celiacDisease', label: 'Celiac Disease', labelHi: 'सीलिएक रोग', emoji: '🍞' },
      { key: 'kidneyDisease', label: 'Kidney Disease', labelHi: 'गुर्दे की बीमारी', emoji: '🫘' },
    ],
  },
  {
    id: 'allergies',
    title: 'Allergies',
    titleHi: 'एलर्जी',
    icon: AlertTriangle,
    color: 'amber',
    options: [
      { key: 'nuts', label: 'Tree Nuts', labelHi: 'मेवे', emoji: '🌰' },
      { key: 'peanuts', label: 'Peanuts', labelHi: 'मूंगफली', emoji: '🥜' },
      { key: 'dairy', label: 'Dairy', labelHi: 'डेयरी', emoji: '🧀' },
      { key: 'eggs', label: 'Eggs', labelHi: 'अंडे', emoji: '🥚' },
      { key: 'soy', label: 'Soy', labelHi: 'सोया', emoji: '🫛' },
      { key: 'wheat', label: 'Wheat', labelHi: 'गेहूं', emoji: '🌾' },
      { key: 'fish', label: 'Fish', labelHi: 'मछली', emoji: '🐟' },
      { key: 'shellfish', label: 'Shellfish', labelHi: 'शेलफिश', emoji: '🦐' },
    ],
  },
  {
    id: 'goals',
    title: 'Health Goals',
    titleHi: 'स्वास्थ्य लक्ष्य',
    icon: Target,
    color: 'blue',
    options: [
      { key: 'weightLoss', label: 'Weight Loss', labelHi: 'वजन कम करना', emoji: '⚖️' },
      { key: 'muscleGain', label: 'Muscle Gain', labelHi: 'मांसपेशी बढ़ाना', emoji: '💪' },
      { key: 'heartHealth', label: 'Heart Health', labelHi: 'दिल की सेहत', emoji: '❤️' },
      { key: 'lowSodium', label: 'Low Sodium', labelHi: 'कम नमक', emoji: '🧂' },
      { key: 'lowSugar', label: 'Low Sugar', labelHi: 'कम चीनी', emoji: '🍬' },
      { key: 'highProtein', label: 'High Protein', labelHi: 'ज्यादा प्रोटीन', emoji: '🥩' },
    ],
  },
];

export default function HealthPreferencesModal({ 
  isOpen, 
  onClose, 
  preferences, 
  updateCategory,
  updateCustomNotes,
  language = 'en'
}) {
  const [activeSection, setActiveSection] = useState('dietary');

  if (!isOpen) return null;

  const currentSection = SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {language === 'hi' ? 'स्वास्थ्य प्रोफाइल' : 'Health Profile'}
                </h2>
                <p className="text-emerald-100 text-sm">
                  {language === 'hi' ? 'AI को आपके लिए personalize करें' : 'Personalize AI for you'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-100 overflow-x-auto">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const count = Object.values(preferences[section.id] || {}).filter(Boolean).length;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 min-w-[80px] px-3 py-3 flex flex-col items-center gap-1 transition-all border-b-2 ${
                  isActive 
                    ? 'border-emerald-500 bg-emerald-50/50' 
                    : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {count > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {language === 'hi' ? section.titleHi.split(' ')[0] : section.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Options */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            {language === 'hi' ? currentSection.titleHi : currentSection.title}
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            {currentSection.options.map((option) => {
              const isSelected = preferences[currentSection.id]?.[option.key] || false;
              
              return (
                <button
                  key={option.key}
                  onClick={() => updateCategory(currentSection.id, option.key, !isSelected)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{option.emoji}</span>
                  <span className={`text-sm font-medium flex-1 ${isSelected ? 'text-emerald-700' : 'text-slate-700'}`}>
                    {language === 'hi' ? option.labelHi : option.label}
                  </span>
                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Notes */}
          {activeSection === 'goals' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {language === 'hi' ? 'अतिरिक्त नोट्स (वैकल्पिक)' : 'Additional Notes (optional)'}
              </label>
              <textarea
                value={preferences.customNotes || ''}
                onChange={(e) => updateCustomNotes(e.target.value)}
                placeholder={language === 'hi' 
                  ? 'कोई और स्वास्थ्य संबंधी जानकारी...' 
                  : 'Any other health concerns or preferences...'}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none resize-none h-20"
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-4 py-3 bg-slate-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              {language === 'hi' 
                ? '🔒 आपका डेटा आपके डिवाइस पर सुरक्षित है' 
                : '🔒 Your data stays on your device'}
            </p>
            <button
              onClick={onClose}
              className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium text-sm hover:bg-emerald-500 transition-colors flex items-center gap-1"
            >
              {language === 'hi' ? 'सेव करें' : 'Save'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
