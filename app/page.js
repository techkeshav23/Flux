'use client';

import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import HomeScreen from '@/components/HomeScreen';
import ProfileScreen from '@/components/ProfileScreen';
import HistoryScreen from '@/components/HistoryScreen';
import ScanOverlay from '@/components/ScanOverlay';
import AnalyzingOverlay from '@/components/AnalyzingOverlay';
import ResultsView from '@/components/ResultsView';
import Confetti from '@/components/Confetti';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ToastContainer, useToast } from '@/components/Toast';
import { useHealthPreferences } from '@/lib/useHealthPreferences';
import { useScanHistory } from '@/lib/useScanHistory';

export default function Home() {
  const [currentTab, setCurrentTab] = useState('home');
  const [showScanOverlay, setShowScanOverlay] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [currentProductName, setCurrentProductName] = useState('');
  const [analysisError, setAnalysisError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showConfetti, setShowConfetti] = useState(false);

  // Toast notifications
  const { toasts, removeToast, success, error: showError, info } = useToast();

  // Health preferences from localStorage
  const {
    preferences,
    isLoaded,
    updateCategory,
    updateCustomNotes,
    resetPreferences,
    getPreferencesForPrompt,
    hasAnyPreferences,
  } = useHealthPreferences();

  // Scan history from localStorage
  const {
    history,
    addScan,
    removeScan,
    clearHistory,
    getStats,
  } = useScanHistory();

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
      // Get user's health preferences for personalized analysis
      const userContext = getPreferencesForPrompt();
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ingredients,
          userContext, // Pass health preferences to API
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      
      // Vibration feedback on mobile for scan complete
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(result.verdict === 'Avoid' ? [100, 50, 100] : [100]);
      }
      
      // Confetti for first scan or Safe verdict celebration
      const isFirstScan = history.length === 0;
      if (isFirstScan || result.verdict === 'Safe') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 100);
      }
      
      // Use AI-detected product name or fallback
      const productName = result.detectedProductName || 'Scanned Product';
      
      // Save to history
      addScan({
        productName: productName,
        ingredients: ingredients.substring(0, 200), // Store first 200 chars
        verdict: result.verdict,
        confidence: result.confidence,
        personalizedForUser: result.personalizedForUser,
        en: result.en,
        hi: result.hi,
        simpleSummary: result.en?.simpleSummary || result.simpleSummary,
      });
      
      setCurrentProductName(productName);
      setAnalysisResult(result);
      
      // Success toast for first scan
      if (isFirstScan) {
        success('🎉 Your first scan! Welcome to Flux Agent!');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalysisError('Failed to analyze ingredients. Please try again.');
      showError('Analysis failed. Please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // View a scan from history
  const handleViewScan = (scan) => {
    setAnalysisResult({
      verdict: scan.verdict,
      confidence: scan.confidence,
      personalizedForUser: scan.personalizedForUser,
      en: scan.en,
      hi: scan.hi,
    });
    setCurrentProductName(scan.productName);
  };

  // Instant language switch - no API call needed!
  const handleLanguageSwitch = (newLanguage) => {
    setCurrentLanguage(newLanguage);
  };

  const handleCloseResults = () => {
    setAnalysisResult(null);
    setCurrentProductName('');
    setAnalysisError(null);
    setCurrentLanguage('en');
  };



  return (
    <ErrorBoundary>
      <main 
        className="min-h-screen bg-emerald-50/50 lg:bg-gradient-to-br lg:from-emerald-50 lg:via-white lg:to-teal-50"
        role="main"
        aria-label="Flux Agent - AI Health Co-pilot"
      >
        {/* Desktop Layout Wrapper */}
        <div className="flex min-h-screen">
          {/* Desktop Sidebar Navigation */}
          <aside 
            className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-white border-r border-emerald-100 p-6 fixed h-full"
            role="navigation"
            aria-label="Main navigation"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="text-xl font-bold text-emerald-800">Flux Agent</h1>
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
              onClick={() => setCurrentTab('history')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentTab === 'history'
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              History
              {history.length > 0 && (
                <span className="ml-auto bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                  {history.length}
                </span>
              )}
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
            <p className="text-xs text-slate-400 text-center">Flux Agent</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-64 xl:ml-72">
          <div className="w-full">
            {/* App Shell Container - Full width on desktop */}
            <div className="w-full bg-white min-h-screen lg:bg-transparent relative overflow-hidden">
              {/* Main Content */}
              {currentTab === 'home' && (
                <HomeScreen 
                  onScanClick={handleScanClick}
                  hasPreferences={hasAnyPreferences()}
                  scanCount={history.length}
                  recentVerdicts={history.slice(0, 5).map(s => s.verdict)}
                  onProfileClick={() => setCurrentTab('profile')}
                />
              )}
              {currentTab === 'history' && (
                <HistoryScreen
                  history={history}
                  stats={getStats()}
                  onScanClick={handleScanClick}
                  onViewScan={handleViewScan}
                  onDeleteScan={removeScan}
                  onClearHistory={clearHistory}
                />
              )}
              {currentTab === 'profile' && (
                <ProfileScreen 
                  preferences={preferences}
                  updateCategory={updateCategory}
                  updateCustomNotes={updateCustomNotes}
                  resetPreferences={resetPreferences}
                  hasAnyPreferences={hasAnyPreferences}
                />
              )}

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
                currentLanguage={currentLanguage}
                onLanguageSwitch={handleLanguageSwitch}
                isLoading={isAnalyzing}
              />

              {/* Confetti Celebration */}
              <Confetti trigger={showConfetti} />

              {/* Toast Notifications */}
              <ToastContainer toasts={toasts} removeToast={removeToast} />
            </div>
          </div>
        </div>
      </div>
      </main>
    </ErrorBoundary>
  );
}
