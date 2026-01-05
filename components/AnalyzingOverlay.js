'use client';

import { Search, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AnalyzingOverlay({ isOpen }) {
  const [step, setStep] = useState(0);
  
  const steps = [
    { text: "Reading ingredients..." },
    { text: "Analyzing health impact..." },
    { text: "Forming insights..." },
    { text: "Almost ready..." },
  ];

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      return;
    }

    const interval = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-fade-in">
      <div className="text-center px-8 max-w-sm">
        {/* Spinner */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-emerald-400 animate-spin" />
          <div className="absolute inset-3 rounded-full bg-slate-800 flex items-center justify-center">
            <Search className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Status */}
        <h2 className="text-lg font-semibold text-white mb-1">
          Analyzing...
        </h2>
        <p className="text-slate-400 text-sm">
          {steps[step].text}
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center gap-1.5 mt-5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-emerald-400' : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
