'use client';

import { useState } from 'react';
import { 
  X, 
  Camera, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Image,
  Zap
} from 'lucide-react';

export default function ScanOverlay({ isOpen, onClose, onAnalyze }) {
  const [mode, setMode] = useState('select'); // select, camera, text
  const [ingredientText, setIngredientText] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCameraCapture = () => {
    setIsCapturing(true);
    // Simulate camera capture
    setTimeout(() => {
      setIsCapturing(false);
      // Simulate captured ingredients
      const simulatedIngredients = "Whole grain wheat flour, high fructose corn syrup, soybean oil, salt, baking soda, natural flavors, vitamin E (mixed tocopherols)";
      setIngredientText(simulatedIngredients);
      setMode('text');
    }, 1500);
  };

  const handleAnalyze = () => {
    if (ingredientText.trim()) {
      onAnalyze(ingredientText);
      setIngredientText('');
      setMode('select');
    }
  };

  const handleClose = () => {
    setMode('select');
    setIngredientText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Panel - Bottom sheet on mobile, centered modal on desktop */}
      <div className="relative w-full max-w-md lg:max-w-lg bg-white rounded-t-3xl lg:rounded-3xl animate-slide-up lg:animate-fade-in min-h-[70vh] lg:min-h-0 lg:max-h-[85vh] max-h-[85vh] overflow-hidden flex flex-col lg:shadow-2xl lg:m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-800">
              {mode === 'select' ? 'Scan Ingredients' : mode === 'camera' ? 'Capture Photo' : 'Paste Ingredients'}
            </h2>
          </div>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {mode === 'select' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-center mb-6">
                Choose how you'd like to input ingredients
              </p>

              {/* Camera Option */}
              <button
                onClick={() => setMode('camera')}
                className="w-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 text-left group hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg">Snap a Photo</h3>
                    <p className="text-emerald-100 text-sm mt-1">
                      Point at the ingredients label
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Text Option */}
              <button
                onClick={() => setMode('text')}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl p-5 text-left group hover:border-emerald-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <FileText className="w-7 h-7 text-slate-600 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-slate-800 font-semibold text-lg">Paste Ingredients</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Copy & paste the ingredients list
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                </div>
              </button>

              {/* AI Tip */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-purple-900 font-medium text-sm">AI-Powered Analysis</p>
                    <p className="text-purple-700 text-xs mt-1">
                      Our AI doesn't just list ingredients—it reasons about their health impact based on scientific research.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {mode === 'camera' && (
            <div className="space-y-4">
              {/* Simulated Camera View */}
              <div className="relative aspect-[4/3] bg-slate-900 rounded-2xl overflow-hidden">
                {isCapturing ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin-slow" />
                  </div>
                ) : (
                  <>
                    {/* Camera Grid */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="border border-white/10" />
                      ))}
                    </div>
                    {/* Focus Box */}
                    <div className="absolute inset-8 border-2 border-emerald-400 rounded-lg">
                      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                    </div>
                    {/* Instruction */}
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-white/80 text-sm bg-black/30 inline-block px-4 py-2 rounded-full">
                        Position ingredients label in frame
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Capture Button */}
              <button
                onClick={handleCameraCapture}
                disabled={isCapturing}
                className="w-full bg-emerald-600 text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCapturing ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Capture & Analyze
                  </>
                )}
              </button>

              <button
                onClick={() => setMode('select')}
                className="w-full text-slate-600 py-2 font-medium"
              >
                ← Back to options
              </button>
            </div>
          )}

          {mode === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ingredients List
                </label>
                <textarea
                  value={ingredientText}
                  onChange={(e) => setIngredientText(e.target.value)}
                  placeholder="Paste the ingredients here...

Example: Water, sugar, citric acid, natural flavors, sodium citrate, potassium sorbate..."
                  className="w-full h-40 border-2 border-slate-200 rounded-xl p-4 text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all resize-none"
                />
              </div>

              {/* Quick Paste Hint */}
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Image className="w-4 h-4" />
                <span>Tip: You can also copy text from a photo using your phone's camera app</span>
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={!ingredientText.trim()}
                className="w-full bg-emerald-600 text-white rounded-xl py-4 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Sparkles className="w-5 h-5" />
                Analyze Ingredients
              </button>

              <button
                onClick={() => setMode('select')}
                className="w-full text-slate-600 py-2 font-medium"
              >
                ← Back to options
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
