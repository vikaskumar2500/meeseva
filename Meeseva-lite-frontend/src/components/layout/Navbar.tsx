import React from 'react';
import { Landmark, Mic, User, LogOut, ShieldCheck, FileCheck2, Search, FolderClosed, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenVoiceAssistant: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenVoiceAssistant,
  onOpenAuthModal,
}) => {
  const { user, isAuthenticated, isOfficer, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-slate-200">
      {/* Tricolor top border accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 flex">
        <div className="w-1/3 bg-orange-500"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-emerald-600"></div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('services')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gov-navy text-white shadow-md group-hover:bg-gov-blue transition">
              <Landmark className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-gov-navy">
                  Mee<span className="text-gov-blue">Seva</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Lite 2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Integrated Citizen Government Services Portal
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'services'
                  ? 'bg-gov-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Search className="w-4 h-4" />
              Service Catalog
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'track'
                  ? 'bg-gov-blue text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              Track Status
            </button>

            {isAuthenticated && (
              <>
                <button
                  onClick={() => setActiveTab('applications')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'applications'
                      ? 'bg-gov-blue text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Applications
                </button>

                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === 'documents'
                      ? 'bg-gov-blue text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FolderClosed className="w-4 h-4" />
                  Document Vault
                </button>
              </>
            )}

            {isOfficer && (
              <button
                onClick={() => setActiveTab('officer')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition ${
                  activeTab === 'officer'
                    ? 'bg-indigo-700 text-white shadow-sm'
                    : 'text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                Officer Desk
              </button>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Multilingual Voice Assistant Button */}
            <button
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition shadow-sm group"
              title="Vernacular Voice Assistant (Speak your service query)"
            >
              <Mic className="w-3.5 h-3.5 text-amber-700 group-hover:scale-110 transition" />
              <span className="hidden sm:inline">Voice Assistant</span>
            </button>

            {/* Auth Button / Profile */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {user?.fullName}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium capitalize">
                    {user?.role}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-gov-blue text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {user?.fullName?.charAt(0) || <User className="w-4 h-4" />}
                </div>

                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-gov-navy hover:bg-gov-blue text-white shadow-sm transition"
              >
                <User className="w-3.5 h-3.5" />
                <span>Citizen Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

