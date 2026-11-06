import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  FileText,
  HelpCircle,
  MessageSquare,
  Compass,
  Map,
  Send,
  Bookmark,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { FeatureTab } from '../types/career';

interface HeaderProps {
  activeTab: FeatureTab;
  onSelectTab: (tab: FeatureTab) => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenEthics: () => void;
}

export const NAV_ITEMS: Array<{
  id: FeatureTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}> = [
  { id: 'resume', label: 'Resume Builder', icon: FileText },
  { id: 'questions', label: 'Interview Qs', icon: HelpCircle, badge: '10 Qs' },
  { id: 'improver', label: 'Answer Improver', icon: MessageSquare, badge: 'STAR' },
  { id: 'guidance', label: 'Career Guidance', icon: Compass },
  { id: 'roadmap', label: 'Skill Roadmap', icon: Map, badge: '3-Stage' },
  { id: 'cover-letter', label: 'Cover Letter', icon: Send },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  onOpenSaved,
  onOpenEthics,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: FeatureTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Tagline */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onSelectTab('resume')}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  AI Career Buddy
                </span>
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
              </div>
              <p className="hidden sm:block text-xs font-medium text-slate-500 tracking-wide">
                Discover Your Skills. Build Your Future.
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm shadow-indigo-100 ring-1 ring-slate-200/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSaved}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shadow-2xs"
              title="Saved Drafts & Items"
            >
              <Bookmark className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline">Saved</span>
              {savedCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenEthics}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              title="College Career Guide & Ethics"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">Ethics & Guide</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 animate-in slide-in-from-top duration-200 shadow-lg">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
            Career Tools
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
