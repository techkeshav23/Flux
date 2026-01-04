'use client';

import { 
  Settings, 
  Bell, 
  Shield, 
  Moon, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  User,
  Heart,
  Leaf
} from 'lucide-react';

const SettingsItem = ({ icon: Icon, title, subtitle, onClick, danger }) => (
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
      <p className="font-medium">{title}</p>
      {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
    </div>
    <ChevronRight className="w-5 h-5 text-slate-400" />
  </button>
);

export default function ProfileScreen() {
  return (
    <div className="pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 px-5 pt-12 pb-8 rounded-b-3xl lg:rounded-3xl lg:mx-6 lg:mt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-xl lg:text-2xl font-bold">Profile</h1>
          <button className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Profile Card - Responsive Layout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <div>
              <h2 className="text-white text-lg lg:text-xl font-semibold">Guest User</h2>
              <p className="text-slate-400 text-sm">Health-conscious Explorer</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white/10 rounded-xl p-3 lg:px-6 text-center">
              <p className="text-white text-lg lg:text-xl font-bold">12</p>
              <p className="text-slate-400 text-xs">Scans</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 lg:px-6 text-center">
              <p className="text-emerald-400 text-lg lg:text-xl font-bold">8</p>
              <p className="text-slate-400 text-xs">Safe</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3 lg:px-6 text-center">
              <p className="text-amber-400 text-lg lg:text-xl font-bold">4</p>
              <p className="text-slate-400 text-xs">Caution</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings List - Responsive Grid */}
      <div className="px-5 lg:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Main Settings Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:bg-slate-50/50">
            <SettingsItem 
              icon={Heart} 
              title="Health Preferences" 
              subtitle="Dietary restrictions, allergies"
            />
            <div className="h-px bg-slate-100 mx-4" />
            <SettingsItem 
              icon={Bell} 
              title="Notifications" 
              subtitle="Alerts and reminders"
            />
            <div className="h-px bg-slate-100 mx-4" />
            <SettingsItem 
              icon={Leaf} 
              title="Sustainability Goals" 
              subtitle="Track eco-friendly choices"
            />
            <div className="h-px bg-slate-100 mx-4" />
            <SettingsItem 
              icon={Shield} 
              title="Privacy & Security" 
              subtitle="Manage your data"
            />
          </div>

          {/* Secondary Settings */}
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

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden lg:bg-slate-50/50">
              <SettingsItem 
                icon={LogOut} 
                title="Sign Out" 
                danger
              />
            </div>
          </div>
        </div>

        {/* App Version */}
        <p className="text-center text-slate-400 text-xs mt-6 lg:hidden">
          Flux Agent v1.0.0 • Made with ❤️
        </p>
      </div>
    </div>
  );
}
