'use client';

import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import HomeScreen from '@/components/HomeScreen';
import ProfileScreen from '@/components/ProfileScreen';
import ScanOverlay from '@/components/ScanOverlay';
import AnalyzingOverlay from '@/components/AnalyzingOverlay';
import ResultsView from '@/components/ResultsView';

export default function Home() {
  const [currentTab, setCurrentTab] = useState('home');
  const [showScanOverlay, setShowScanOverlay] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentProductName, setCurrentProductName] = useState('');
  const [analysisError, setAnalysisError] = useState(null);

  const handleScanClick = () => {
    setShowScanOverlay(true);
  };

  const handleCloseScan = () => {
    setShowScanOverlay(false);
  };

  const handleAnalyze = async (ingredients) => {
    setShowScanOverlay(false);
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      setCurrentProductName('Scanned Product');
      setAnalysisResult(result);
    } catch (error) {
      console.error('Analysis error:', error);
      setAnalysisError('Failed to analyze ingredients. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseResults = () => {
    setAnalysisResult(null);
    setCurrentProductName('');
    setAnalysisError(null);
  };



  return (
    <main className="min-h-screen bg-slate-100 lg:bg-gradient-to-br lg:from-slate-100 lg:via-slate-50 lg:to-emerald-50">
      {/* Desktop Layout Wrapper */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-white border-r border-slate-200 p-6 fixed h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Flux Agent</h1>
          </div>
          
          <nav className="space-y-2 flex-1">
            <button
              onClick={() => setCurrentTab('home')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentTab === 'home'
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
            <button
              onClick={handleScanClick}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Scan Product
            </button>
            <button
              onClick={() => setCurrentTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentTab === 'profile'
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
          </nav>

          <div className="pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 text-center">Flux Agent v1.0.0</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-64 xl:ml-72">
          <div className="flex justify-center">
            {/* App Shell Container - Responsive width */}
            <div className="w-full max-w-md lg:max-w-3xl xl:max-w-5xl bg-white min-h-screen shadow-2xl lg:shadow-none lg:bg-transparent relative overflow-hidden">
              {/* Main Content */}
              {currentTab === 'home' && (
                <HomeScreen 
                  onScanClick={handleScanClick}
                />
              )}
              {currentTab === 'profile' && <ProfileScreen />}

              {/* Bottom Navigation - Mobile Only */}
              <div className="lg:hidden">
                <BottomNavigation
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                  onScanClick={handleScanClick}
                />
              </div>

              {/* Scan Overlay */}
              <ScanOverlay
                isOpen={showScanOverlay}
                onClose={handleCloseScan}
                onAnalyze={handleAnalyze}
              />

              {/* Analyzing Overlay */}
              <AnalyzingOverlay isOpen={isAnalyzing} />

              {/* Results View */}
              <ResultsView
                result={analysisResult}
                productName={currentProductName}
                onClose={handleCloseResults}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
