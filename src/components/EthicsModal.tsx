import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, BookOpen, X, Sparkles, HeartHandshake } from 'lucide-react';

interface EthicsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EthicsModal: React.FC<EthicsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 no-print">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-5 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Student Ethics & Career Guidance Charter
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Our commitment to authentic, honest, and empowering career preparation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/60 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-indigo-950 text-sm">
                Empowering College Students with Generative AI
              </h4>
              <p className="text-xs text-indigo-900/80 mt-1 leading-relaxed">
                AI Career Buddy uses Google Gemini AI to help you translate your genuine academic efforts, class projects, and personal curiosity into polished, professional applications.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              What AI Career Buddy Does
            </h3>
            <ul className="space-y-2.5 pl-1">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong>Organizes your authentic background:</strong> Formats your real classes, projects, GPA, and extracurricular activities into clean, industry-standard ATS resume formats.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong>Simulates realistic interview scenarios:</strong> Generates relevant practice questions across technical and behavioral domains so you can practice without fear.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong>Teaches the STAR method:</strong> Coaches you on structuring interview stories with Situation, Task, Action, and Result.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span>
                  <strong>Builds progressive roadmaps:</strong> Outlines tangible, curated learning steps from Beginner to Advanced with hands-on projects and free learning resources.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Important Ethical Disclaimers & Advice
            </h3>
            <div className="space-y-3 bg-amber-50/60 p-4 rounded-2xl border border-amber-200/60 text-amber-950 text-xs sm:text-sm">
              <p>
                <strong>Never fabricate qualifications:</strong> The AI will never invent degrees, past employers, or fake projects for you. Always verify that all information in your generated resumes and cover letters is 100% accurate to your real experiences.
              </p>
              <p>
                <strong>Practice questions only:</strong> The interview questions generated are realistic practice questions designed for mental preparation and role familiarity. They are not official company test leaks.
              </p>
              <p>
                <strong>No guarantee of employment:</strong> AI Career Buddy does not guarantee job offers, placement tests, or hiring decisions. Hiring outcomes depend on recruiter evaluations, company needs, and your personal interviews.
              </p>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-500/20 transition-all"
            >
              Understood – Let's Build My Career!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
