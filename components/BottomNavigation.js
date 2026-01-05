'use client';

import { Home, User, History, ScanLine } from 'lucide-react';

export default function BottomNavigation({ currentTab, setCurrentTab, onScanClick }) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-2 z-40 safe-area-bottom"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home Button */}
        <button
          onClick={() => setCurrentTab('home')}
          aria-label="Home"
          aria-current={currentTab === 'home' ? 'page' : undefined}
          className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-200 min-w-[64px] ${
            currentTab === 'home'
              ? 'text-emerald-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-6 h-6" strokeWidth={currentTab === 'home' ? 2.5 : 1.5} />
          <span className="text-[11px] mt-1 font-medium">Home</span>
        </button>
        {/* Scan Button - Center with subtle highlight */}
        <button
          onClick={onScanClick}
          aria-label="Scan ingredients"
          className="flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-200 min-w-[64px] text-emerald-600 bg-emerald-50"
        >
          <ScanLine className="w-6 h-6" strokeWidth={2.5} />
          <span className="text-[11px] mt-1 font-medium">Scan</span>
        </button>
        {/* History Button */}
        <button
          onClick={() => setCurrentTab('history')}
          aria-label="Scan History"
          aria-current={currentTab === 'history' ? 'page' : undefined}
          className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-200 min-w-[64px] ${
            currentTab === 'history'
              ? 'text-emerald-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <History className="w-6 h-6" strokeWidth={currentTab === 'history' ? 2.5 : 1.5} />
          <span className="text-[11px] mt-1 font-medium">History</span>
        </button>



        {/* Profile Button */}
        <button
          onClick={() => setCurrentTab('profile')}
          aria-label="Profile and settings"
          aria-current={currentTab === 'profile' ? 'page' : undefined}
          className={`flex flex-col items-center py-2 px-4 rounded-2xl transition-all duration-200 min-w-[64px] ${
            currentTab === 'profile'
              ? 'text-emerald-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-6 h-6" strokeWidth={currentTab === 'profile' ? 2.5 : 1.5} />
          <span className="text-[11px] mt-1 font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
}
