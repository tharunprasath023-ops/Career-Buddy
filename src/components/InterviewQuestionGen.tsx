import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  Copy,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  BookOpen,
  Zap,
  Filter,
  Brain,
  MessageSquare,
  ShieldAlert,
} from 'lucide-react';
import { InterviewQuestionsResult, InterviewQuestion } from '../types/career';
import { SAMPLE_QUESTIONS_DATA } from '../data/samplePresets';
import { LoadingState } from './LoadingState';
import { triggerCelebration } from '../utils/confetti';

interface InterviewQuestionGenProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSave: (title: string, data: { input: any; result: InterviewQuestionsResult }) => void;
  onPracticeQuestion: (question: string, jobRole: string) => void;
  initialData?: { input: any; result: InterviewQuestionsResult } | null;
}

const COMMON_ROLES = [
  'Software Engineer Intern',
  'Frontend Developer',
  'Data Analyst',
  'UI/UX Designer',
  'Product Manager Intern',
  'Cybersecurity Analyst',
  'Business Analyst',
  'AI / Machine Learning Engineer',
];

export const InterviewQuestionGen: React.FC<InterviewQuestionGenProps> = ({
  onNotify,
  onSave,
  onPracticeQuestion,
  initialData,
}) => {
  const [jobRole, setJobRole] = useState(initialData?.input?.jobRole || 'Software Engineer Intern');
  const [domain, setDomain] = useState(initialData?.input?.domain || 'Full Stack & Web Technologies');
  const [experienceLevel, setExperienceLevel] = useState(
    initialData?.input?.experienceLevel || 'College Fresher / Summer Intern'
  );
  const [companyType, setCompanyType] = useState(
    initialData?.input?.companyType || 'High-Growth Tech Startup'
  );

  const [result, setResult] = useState<InterviewQuestionsResult | null>(
    initialData?.result || null
  );
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'technical' | 'hr'>('all');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobRole.trim()) {
      onNotify('error', 'Please enter or select a Job Role.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/career/interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobRole,
          domain,
          experienceLevel,
          companyType,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate interview questions');
      }

      const data: InterviewQuestionsResult = await response.json();
      setResult(data);
      triggerCelebration();
      onNotify('success', 'Generated 10 targeted interview practice questions!');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || 'Failed to generate questions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAll = () => {
    if (!result) return;
    const text = result.questions
      .map(
        (q, i) =>
          `${i + 1}. [${q.category.toUpperCase()}] ${q.question}\n   • Interviewer Intent: ${q.interviewerIntent}\n   • Suggested Approach: ${q.suggestedApproach}\n`
      )
      .join('\n');

    navigator.clipboard.writeText(
      `AI Career Buddy - Practice Questions for ${jobRole}\n\n${text}`
    );
    triggerCelebration();
    onNotify('success', 'All 10 practice questions copied to clipboard!');
  };

  const handleSaveDraft = () => {
    if (!result) return;
    onSave(`10 Questions for ${jobRole}`, {
      input: { jobRole, domain, experienceLevel, companyType },
      result,
    });
    onNotify('success', 'Saved question set to your drafts.');
  };

  const filteredQuestions = result?.questions.filter((q) => {
    if (categoryFilter === 'technical') {
      return q.category.toLowerCase().includes('tech') || q.category.toLowerCase().includes('problem');
    }
    if (categoryFilter === 'hr') {
      return (
        q.category.toLowerCase().includes('hr') ||
        q.category.toLowerCase().includes('behav') ||
        q.category.toLowerCase().includes('situat')
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Interview Question Generator
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                10 Practice Qs
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Realistic technical & behavioral questions with what interviewers really evaluate
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setJobRole(SAMPLE_QUESTIONS_DATA.jobRole);
            setDomain(SAMPLE_QUESTIONS_DATA.domain);
            setExperienceLevel(SAMPLE_QUESTIONS_DATA.experienceLevel);
            setCompanyType(SAMPLE_QUESTIONS_DATA.companyType);
            onNotify('info', 'Loaded sample role parameters.');
          }}
          className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Zap className="w-4 h-4 text-indigo-600" />
          <span>Load Sample Preset</span>
        </button>
      </div>

      {/* Role Selection & Config Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Quick Role Suggestions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Quick Select Target Role
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_ROLES.map((role) => (
                <button
                  type="button"
                  key={role}
                  onClick={() => setJobRole(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    jobRole === role
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Role / Title *
              </label>
              <input
                type="text"
                required
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Domain / Field
              </label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="e.g. React & TypeScript Web"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
              >
                <option value="College Fresher / Summer Intern">College Fresher / Summer Intern</option>
                <option value="Final Year Placement (0-1 yrs)">Final Year Placement (0-1 yrs)</option>
                <option value="Co-Op / Apprenticeship">Co-Op / Apprenticeship</option>
                <option value="Junior Graduate Associate">Junior Graduate Associate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Company Style
              </label>
              <select
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
              >
                <option value="High-Growth Tech Startup">High-Growth Tech Startup</option>
                <option value="Enterprise / Fortune 500">Enterprise / Fortune 500</option>
                <option value="Product Tech / FAANG-style">Product Tech / FAANG-style</option>
                <option value="Consulting / IT Services">Consulting / IT Services</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-sm shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>{loading ? 'Generating 10 Practice Questions...' : 'Generate 10 Practice Questions'}</span>
          </button>
        </form>
      </div>

      {/* Results Section */}
      {loading ? (
        <LoadingState
          title="Generating Role-Specific Interview Questions..."
          subtitle="Selecting 6 technical depth questions and 4 behavioral/HR scenarios for college candidates."
        />
      ) : result ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Practice Disclaimer Box */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Practice Questions Notice:</strong> These questions are generated based on industry standards to help college students simulate authentic interview discussions. They are for preparation and practice only.
            </div>
          </div>

          {/* Overview Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Interviewer Perspective
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 max-w-2xl leading-relaxed">
                {result.roleSummary}
              </p>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                onClick={handleCopyAll}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All 10 Qs</span>
              </button>
              <button
                onClick={handleSaveDraft}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-indigo-600 transition-colors"
                title="Save Questions"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              All 10 Questions
            </button>
            <button
              onClick={() => setCategoryFilter('technical')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'technical'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Technical & Domain (6)
            </button>
            <button
              onClick={() => setCategoryFilter('hr')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                categoryFilter === 'hr'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Behavioral & HR (4)
            </button>
          </div>

          {/* Questions Grid */}
          <div className="space-y-4">
            {filteredQuestions?.map((q) => {
              const isTech =
                q.category.toLowerCase().includes('tech') ||
                q.category.toLowerCase().includes('problem');

              return (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-indigo-200 transition-all space-y-4 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-50 text-slate-700 group-hover:text-indigo-600 text-xs font-black flex items-center justify-center shrink-0 transition-colors">
                        Q{q.id}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              isTech
                                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                                : 'bg-purple-50 text-purple-700 border border-purple-200/60'
                            }`}
                          >
                            {q.category}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-400">
                            Difficulty: {q.difficulty}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                          {q.question}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => onPracticeQuestion(q.question, jobRole)}
                      className="shrink-0 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                      title="Practice this answer in the Answer Improver tool"
                    >
                      <span>Practice Answer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Intent & Approach details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                      <span className="font-bold text-slate-700 block mb-0.5">
                        What Interviewers Are Looking For:
                      </span>
                      <p className="text-slate-600 leading-relaxed">
                        {q.interviewerIntent}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                      <span className="font-bold text-indigo-900 block mb-0.5">
                        Suggested Answering Approach:
                      </span>
                      <p className="text-slate-700 leading-relaxed">
                        {q.suggestedApproach}
                      </p>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="flex items-center gap-2 text-xs flex-wrap">
                    <span className="text-slate-400 font-semibold text-[11px]">Recommended Keywords:</span>
                    {q.sampleKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* General Preparation Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-indigo-100">
            <h4 className="text-sm font-bold text-indigo-950 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              General Interview Success Tips for College Students:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-indigo-900">
              {result.preparationTips.map((tip, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/80 border border-indigo-200/60">
                  <span className="font-bold block mb-1">Tip #{i + 1}</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-100 to-purple-100 text-indigo-600 mx-auto flex items-center justify-center">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Select Your Role to Generate 10 Practice Questions
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Choose from popular roles like Software Engineer, Data Analyst, or UI/UX Designer above to get targeted technical and behavioral scenarios.
          </p>
        </div>
      )}
    </div>
  );
};
