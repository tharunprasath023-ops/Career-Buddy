import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, Rocket, Compass, CheckCircle2 } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
}

const TIPS = [
  'Tip: Recruiters spend about 7 seconds scanning a resume. Keep bullet points punchy and start with strong action verbs!',
  'Tip: In technical and behavioral interviews, structure your responses with the STAR method (Situation, Task, Action, Result).',
  'Tip: Quantify your college projects wherever possible — like "Optimized API load time by 30%" or "Used by 150+ classmates".',
  'Tip: Answering "What is your greatest weakness?" with a genuine growth journey demonstrates self-awareness and maturity.',
  'Tip: When building personal portfolio projects, depth and clean documentation beat having dozens of unfinished toy apps.',
  'Tip: Mentioning coursework and class capstones is completely valid when you have limited formal work experience!',
];

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = 'Gemini AI is analyzing and crafting your results...',
  subtitle = 'Tailoring recommendations for college students and entry-level standards.',
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/70 via-white to-purple-50/50 p-8 sm:p-12 text-center shadow-xs">
      {/* Animated Icon Ring */}
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 animate-spin opacity-80 blur-xs" />
        <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
          <BrainCircuit className="w-9 h-9 text-indigo-600 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
        <span>{title}</span>
        <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400 animate-bounce" />
      </h3>
      <p className="mt-2 text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
        {subtitle}
      </p>

      {/* Rotating Tip Box */}
      <div className="mt-6 max-w-lg mx-auto bg-white/90 border border-indigo-200/60 rounded-xl p-4 shadow-2xs transition-all duration-300">
        <div className="flex items-start gap-3 text-left">
          <div className="p-1 rounded-md bg-indigo-50 text-indigo-600 mt-0.5">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              Quick Career Tip
            </span>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 font-medium leading-relaxed">
              {TIPS[tipIndex]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
