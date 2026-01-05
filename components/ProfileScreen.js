'use client';

import { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Moon, 
  HelpCircle, 
  ChevronRight,
  User,
  Heart,
  Target,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import HealthPreferencesModal from './HealthPreferencesModal';

const SettingsItem = ({ icon: Icon, title, subtitle, onClick, danger, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
      danger 
        ? 'hover:bg-red-50 text-red-600' 
        : 'hover:bg-slate-50 text-slate-700'
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
      danger ? 'bg-red-100' : 'bg-slate-100'
    }`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 text-left">
      <div className="flex items-center gap-2">
        <p className="font-medium">{title}</p>
        {badge && (
          <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
    <ChevronRight className="w-5 h-5 text-slate-400" />
  </button>
);

const PreferenceSummaryCard = ({ preferences, onEdit }) => {
  const getActiveCount = () => {
    let count = 0;
    count += Object.values(preferences.dietary || {}).filter(Boolean).length;
    count += Object.values(preferences.conditions || {}).filter(Boolean).length;
    count += Object.values(preferences.allergies || {}).filter(Boolean).length;
    count += Object.values(preferences.goals || {}).filter(Boolean).length;
    return count;
  };

  const getQuickSummary = () => {
    const items = [];
    
    if (preferences.conditions?.diabetic) items.push('Diabetic');
    if (preferences.conditions?.hypertension) items.push('BP');
    if (preferences.dietary?.vegetarian) items.push('Vegetarian');
    if (preferences.dietary?.vegan) items.push('Vegan');
    if (preferences.allergies?.nuts) items.push('Nut allergy');
    if (preferences.allergies?.dairy) items.push('Dairy allergy');
    if (preferences.goals?.weightLoss) items.push('Weight loss');
    if (preferences.goals?.lowSugar) items.push('Low sugar');
    
    return items.slice(0, 4);
  };

  const count = getActiveCount();
  const summary = getQuickSummary();

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">Health Profile</h3>
            <p className="text-xs text-slate-500">
              {count > 0 ? `${count} preferences set` : 'Not configured yet'}
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="text-emerald-600 text-sm font-medium hover:text-emerald-700"
        >
          {count > 0 ? 'Edit' : 'Setup'}
        </button>
      </div>

      {count > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {summary.map((item, i) => (
            <span 
              key={i}
              className="bg-white text-slate-600 text-xs px-2.5 py-1 rounded-full border border-slate-200"
            >
              {item}
            </span>
          ))}
          {count > 4 && (
            <span className="text-slate-400 text-xs px-2 py-1">
              +{count - 4} more
            </span>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-600">
          Set up your health profile to get <span className="text-emerald-600 font-medium">personalized</span> ingredient analysis.
        </p>
      )}
    </div>
  );
};

export default function ProfileScreen({ 
  preferences, 
  updateCategory, 
  updateCustomNotes,
  resetPreferences,
  hasAnyPreferences 
}) {
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const scanStats = { total: 12, safe: 8, caution: 4 };

  const handleReset = () => {
    resetPreferences();
    setShowResetConfirm(false);
  };

  return (
    <div className="pb-24 lg:pb-8">
      {/* Header - Curved gradient like reference */}
      <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 px-5 pt-12 pb-10 lg:px-8 lg:pt-8 rounded-b-[2.5rem]">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white text-2xl lg:text-3xl font-bold italic">Profile</h1>
            <button className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">
                {preferences?.profile?.name || 'Health Explorer'}
              </h2>
              <p className="text-white/70 text-sm">
                {hasAnyPreferences?.() ? '✓ Profile configured' : 'Setup your health profile'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Floating below header */}
      <div className="px-5 lg:px-8 -mt-5 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl p-3 text-center shadow-md border border-slate-100">
              <p className="text-emerald-600 text-xl font-bold">{scanStats.total}</p>
              <p className="text-slate-500 text-xs">Scans</p>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center shadow-md border border-slate-100">
              <p className="text-emerald-600 text-xl font-bold">{scanStats.safe}</p>
              <p className="text-slate-500 text-xs">Safe</p>
            </div>
            <div className="bg-white rounded-2xl p-3 text-center shadow-md border border-slate-100">
              <p className="text-amber-500 text-xl font-bold">{scanStats.caution}</p>
              <p className="text-slate-500 text-xs">Caution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="px-5 lg:px-6 pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <PreferenceSummaryCard 
              preferences={preferences} 
              onEdit={() => setShowPreferencesModal(true)} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:bg-slate-50/50">
              <SettingsItem 
                icon={Heart} 
                title="Health Preferences" 
                subtitle="Dietary, conditions, allergies"
                onClick={() => setShowPreferencesModal(true)}
                badge={hasAnyPreferences?.() ? 'Active' : null}
              />
              <div className="h-px bg-slate-100 mx-4" />
              <SettingsItem 
                icon={Target} 
                title="Health Goals" 
                subtitle="Weight, nutrition targets"
                onClick={() => setShowPreferencesModal(true)}
              />
              <div className="h-px bg-slate-100 mx-4" />
              <SettingsItem 
                icon={Bell} 
                title="Notifications" 
                subtitle="Coming soon"
              />
              <div className="h-px bg-slate-100 mx-4" />
              <SettingsItem 
                icon={Shield} 
                title="Privacy & Data" 
                subtitle="Data stored locally only"
              />
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:bg-slate-50/50">
                <SettingsItem 
                  icon={HelpCircle} 
                  title="Help & Support" 
                  subtitle="FAQs, contact us"
                />
                <div className="h-px bg-slate-100 mx-4" />
                <SettingsItem 
                  icon={Moon} 
                  title="Appearance" 
                  subtitle="Light mode"
                />
              </div>

              {hasAnyPreferences?.() && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:bg-slate-50/50">
                  <SettingsItem 
                    icon={Trash2} 
                    title="Reset Preferences" 
                    subtitle="Clear all health data"
                    onClick={() => setShowResetConfirm(true)}
                    danger
                  />
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 bg-slate-50 rounded-xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-700">Your privacy matters</p>
              <p className="text-xs text-slate-500 mt-1">
                All health preferences are stored locally on your device. Nothing is sent to our servers.
              </p>
            </div>
          </div>

          <p className="text-center text-slate-400 text-xs mt-6">
            Flux Agent
          </p>
        </div>
      </div>

      <HealthPreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        preferences={preferences}
        updateCategory={updateCategory}
        updateCustomNotes={updateCustomNotes}
      />

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowResetConfirm(false)} />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-center text-slate-800 mb-2">
              Reset all preferences?
            </h3>
            <p className="text-sm text-slate-500 text-center mb-6">
              This will clear all your health preferences. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 bg-red-600 rounded-xl text-white font-medium hover:bg-red-500 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
