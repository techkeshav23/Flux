'use client';

import { Home, User, Scan } from 'lucide-react';

export default function BottomNavigation({ currentTab, setCurrentTab, onScanClick }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 px-6 py-2 z-40">
      <div className="flex items-center justify-between relative">
        {/* Home Button */}
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center py-2 px-6 rounded-xl transition-all duration-200 ${
            currentTab === 'home'
              ? 'text-emerald-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-6 h-6" strokeWidth={currentTab === 'home' ? 2.5 : 2} />
          <span className="text-xs mt-1 font-medium">Home</span>
        </button>

        {/* Center FAB - Scan Button */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6">
          <button
            onClick={onScanClick}
            className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-105 active:scale-95"
          >
            <Scan className="w-7 h-7" strokeWidth={2.5} />
          </button>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
            <span className="text-xs font-semibold text-emerald-600">Scan</span>
          </div>
        </div>

        {/* Profile Button */}
        <button
          onClick={() => setCurrentTab('profile')}
          className={`flex flex-col items-center py-2 px-6 rounded-xl transition-all duration-200 ${
            currentTab === 'profile'
              ? 'text-emerald-600'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-6 h-6" strokeWidth={currentTab === 'profile' ? 2.5 : 2} />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
}
