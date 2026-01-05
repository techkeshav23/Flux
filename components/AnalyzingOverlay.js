'use client';

import { Sparkles, Brain, Search, CheckCircle, Lightbulb } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AnalyzingOverlay({ isOpen }) {
  const [step, setStep] = useState(0);
  
  const steps = [
    { icon: Search, text: "Reading your ingredients..." },
    { icon: Brain, text: "Thinking about health implications..." },
    { icon: Lightbulb, text: "Identifying what matters to you..." },
    { icon: Sparkles, text: "Forming my opinion..." },
    { icon: CheckCircle, text: "Almost ready with insights..." },
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const CurrentIcon = steps[step].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 lg:bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="text-center px-8 lg:bg-white lg:rounded-3xl lg:p-12 lg:shadow-2xl lg:max-w-md">
        {/* Animated Icon */}
        <div className="relative w-24 h-24 lg:w-32 lg:h-32 mx-auto mb-8">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-purple-100 animate-pulse" />
          {/* Middle Ring */}
          <div className="absolute inset-2 rounded-full border-2 border-purple-200 animate-spin-slow" style={{ animationDuration: '3s' }} />
          {/* Inner Circle with Icon */}
          <div className="absolute inset-4 lg:inset-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30">
            <CurrentIcon className="w-8 h-8 lg:w-10 lg:h-10 text-white animate-pulse" />
          </div>
        </div>

        {/* Status Text */}
        <h2 className="text-xl lg:text-2xl font-semibold text-slate-800 mb-2">
          Let me think about this...
        </h2>
        <p className="text-slate-600 lg:text-lg animate-pulse-soft">
          {steps[step].text}
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= step 
                  ? 'bg-purple-500 scale-100' 
                  : 'bg-slate-200 scale-75'
              }`}
            />
          ))}
        </div>

        {/* AI Badge */}
        <div className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 px-4 py-2 rounded-full">
          <Brain className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">
            AI is reasoning, not just searching
          </span>
        </div>
      </div>
    </div>
  );
}
