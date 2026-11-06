import React from 'react';
import {
  FileText,
  HelpCircle,
  MessageSquare,
  Compass,
  Map,
  Send,
  ArrowRight,
  Sparkles,
  Award,
  Target,
  Zap,
} from 'lucide-react';
import { FeatureTab } from '../types/career';

interface HeroSectionProps {
  onSelectFeature: (tab: FeatureTab) => void;
  activeTab: FeatureTab;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectFeature, activeTab }) => {
  const features = [
    {
      id: 'resume' as FeatureTab,
      title: 'AI Resume Builder',
      badge: 'ATS Optimized',
      description: 'Turn your coursework, campus projects, and skills into a recruiters-ready resume draft.',
      icon: FileText,
      gradient: 'from-blue-500 to-indigo-600',
      tag: 'Fast & Formatted',
    },
    {
      id: 'questions' as FeatureTab,
      title: 'Interview Question Generator',
      badge: '10 Tailored Qs',
      description: 'Generate 10 role-specific technical and behavioral questions with interviewer secrets.',
      icon: HelpCircle,
      gradient: 'from-indigo-500 to-purple-600',
      tag: 'Tech + HR Prep',
    },
    {
      id: 'improver' as FeatureTab,
      title: 'Interview Answer Improver',
      badge: 'STAR Method',
      description: 'Submit your rough answer. Get instant clarity scores, STAR restructuring, and natural spoken delivery.',
      icon: MessageSquare,
      gradient: 'from-purple-500 to-pink-600',
      tag: 'Confidence Boost',
    },
    {
      id: 'guidance' as FeatureTab,
      title: 'AI Career Guidance',
      badge: 'Path Finder',
      description: 'Match your favorite subjects, interests, and strengths to high-growth career trajectories.',
      icon: Compass,
      gradient: 'from-blue-600 to-cyan-600',
      tag: 'Tailored Match',
    },
    {
      id: 'roadmap' as FeatureTab,
      title: 'Skill Learning Roadmap',
      badge: '3-Stage Plan',
      description: 'Clear step-by-step roadmap: Beginner to Advanced with weekly milestones and free resources.',
      icon: Map,
      gradient: 'from-emerald-500 to-teal-600',
      tag: 'Milestone Projects',
    },
    {
      id: 'cover-letter' as FeatureTab,
      title: 'Cover Letter Generator',
      badge: 'Company Tailored',
      description: 'Highlight your student achievements and genuine motivation with tailored business formatting.',
      icon: Send,
      gradient: 'from-violet-600 to-indigo-700',
      tag: 'Recruiter Ready',
    },
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-14 no-print">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-blue-100/60 via-purple-100/50 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Pill announcement */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-indigo-200/60 text-indigo-700 text-xs sm:text-sm font-semibold mb-5 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Built Specifically for College Students & Fresh Grads</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Discover Your Skills.{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Your personal, intelligent career mentor powered by Google Gemini AI. Prepare standout resumes, practice interview questions with STAR coaching, explore dream careers, and master in-demand skills.
          </p>

          {/* Quick value badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-indigo-600" /> ATS-Friendly Resumes
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <Target className="w-3.5 h-3.5 text-purple-600" /> STAR Answer Coaching
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-blue-600" /> 1-Click Sample Previews
            </span>
          </div>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            const isSelected = activeTab === feat.id;
            return (
              <div
                key={feat.id}
                onClick={() => onSelectFeature(feat.id)}
                className={`group relative rounded-2xl p-5 sm:p-6 cursor-pointer transition-all duration-200 border text-left ${
                  isSelected
                    ? 'bg-gradient-to-b from-white to-indigo-50/50 border-indigo-400 shadow-lg shadow-indigo-100 ring-2 ring-indigo-500/20 scale-[1.01]'
                    : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300'
                }`}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-b-full" />
                )}

                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {feat.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {feat.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {feat.tag}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
                    <span>{isSelected ? 'Currently Viewing' : 'Launch Tool'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
