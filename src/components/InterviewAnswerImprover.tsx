import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Copy,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Volume2,
  Zap,
  ArrowRight,
  ShieldCheck,
  Quote,
} from 'lucide-react';
import { AnswerImproverResult } from '../types/career';
import { SAMPLE_ANSWER_DATA } from '../data/samplePresets';
import { LoadingState } from './LoadingState';
import { triggerCelebration } from '../utils/confetti';

interface InterviewAnswerImproverProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSave: (title: string, data: { input: any; result: AnswerImproverResult }) => void;
  initialQuestion?: string;
  initialRole?: string;
  savedData?: { input: any; result: AnswerImproverResult } | null;
}

export const InterviewAnswerImprover: React.FC<InterviewAnswerImproverProps> = ({
  onNotify,
  onSave,
  initialQuestion,
  initialRole,
  savedData,
}) => {
  const [question, setQuestion] = useState(
    initialQuestion || savedData?.input?.question || SAMPLE_ANSWER_DATA.question
  );
  const [studentAnswer, setStudentAnswer] = useState(
    savedData?.input?.studentAnswer || SAMPLE_ANSWER_DATA.studentAnswer
  );
  const [jobRole, setJobRole] = useState(
    initialRole || savedData?.input?.jobRole || SAMPLE_ANSWER_DATA.jobRole
  );

  const [result, setResult] = useState<AnswerImproverResult | null>(
    savedData?.result || null
  );
  const [loading, setLoading] = useState(false);
  const [viewTab, setViewTab] = useState<'polished' | 'spoken' | 'star'>('polished');

  useEffect(() => {
    if (initialQuestion) {
      setQuestion(initialQuestion);
    }
    if (initialRole) {
      setJobRole(initialRole);
    }
  }, [initialQuestion, initialRole]);

  const handleImprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !studentAnswer.trim()) {
      onNotify('error', 'Please provide both the interview question and your draft answer.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/career/improve-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          studentAnswer,
          jobRole,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to improve interview answer');
      }

      const data: AnswerImproverResult = await response.json();
      setResult(data);
      triggerCelebration();
      onNotify('success', 'Your interview answer has been refined with STAR methodology!');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || 'Failed to improve answer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyImproved = () => {
    if (!result) return;
    const textToCopy =
      viewTab === 'spoken' ? result.spokenVersion : result.improvedAnswer;
    navigator.clipboard.writeText(textToCopy);
    triggerCelebration();
    onNotify('success', 'Improved response copied to clipboard!');
  };

  const handleSaveDraft = () => {
    if (!result) return;
    onSave(`Answer: ${question.slice(0, 35)}...`, {
      input: { question, studentAnswer, jobRole },
      result,
    });
    onNotify('success', 'Saved answer analysis to drafts.');
  };

  const handleLoadSample = () => {
    setQuestion(SAMPLE_ANSWER_DATA.question);
    setStudentAnswer(SAMPLE_ANSWER_DATA.studentAnswer);
    setJobRole(SAMPLE_ANSWER_DATA.jobRole);
    onNotify('info', 'Loaded sample student interview answer.');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Interview Answer Improver
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                STAR Framework
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Elevate grammar, structure, and confidence for any technical or behavioral answer
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Zap className="w-4 h-4 text-purple-600" />
          <span>Load Sample Question & Answer</span>
        </button>
      </div>

      {/* Main Grid: Form Inputs vs AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleImprove} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Role (Optional context)
              </label>
              <input
                type="text"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                placeholder="e.g. Software Engineer Intern"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Interview Question *
              </label>
              <textarea
                rows={2}
                required
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Tell me about a time you resolved a conflict in a team project..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Your Raw / Draft Answer *
                </label>
                <span className="text-[11px] text-slate-400">
                  {studentAnswer.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <textarea
                rows={7}
                required
                value={studentAnswer}
                onChange={(e) => setStudentAnswer(e.target.value)}
                placeholder="Type your authentic response, even if it feels unstructured or informal. The AI coach will polish it..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-hidden font-normal leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Be honest about what happened; Gemini will enhance your impact without inventing fake credentials.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white font-extrabold text-sm shadow-md shadow-purple-500/20 hover:shadow-purple-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{loading ? 'Evaluating & Refining Answer...' : 'Improve Answer with STAR'}</span>
            </button>
          </form>
        </div>

        {/* Output & Coaching Feedback (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <LoadingState
              title="Coaching Your Interview Response..."
              subtitle="Breaking down Situation, Task, Action, and Result while polishing tone and confidence."
            />
          ) : result ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score Dashboard */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600">
                      Performance Evaluation
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                      Interview Readiness Rating
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyImproved}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Improved Answer</span>
                    </button>
                    <button
                      onClick={handleSaveDraft}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-purple-600 transition-colors"
                      title="Save Answer Analysis"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Score Pills Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Clarity</span>
                    <div className="text-xl font-black text-indigo-600 mt-0.5">
                      {result.scores.clarity}/10
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Structure (STAR)</span>
                    <div className="text-xl font-black text-purple-600 mt-0.5">
                      {result.scores.structure}/10
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Impact</span>
                    <div className="text-xl font-black text-blue-600 mt-0.5">
                      {result.scores.impact}/10
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Confidence</span>
                    <div className="text-xl font-black text-pink-600 mt-0.5">
                      {result.scores.confidence}/10
                    </div>
                  </div>
                </div>
              </div>

              {/* View Switcher: Polished vs Spoken vs STAR Breakdown */}
              <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl w-fit">
                <button
                  onClick={() => setViewTab('polished')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewTab === 'polished'
                      ? 'bg-white text-purple-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Polished STAR Answer
                </button>
                <button
                  onClick={() => setViewTab('spoken')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    viewTab === 'spoken'
                      ? 'bg-white text-purple-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Spoken / Conversational</span>
                </button>
                <button
                  onClick={() => setViewTab('star')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewTab === 'star'
                      ? 'bg-white text-purple-700 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  STAR Breakdown
                </button>
              </div>

              {/* Display Box */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
                {viewTab === 'polished' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Polished Version (Recruiter Ready)
                      </span>
                    </div>
                    <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/40 border border-purple-100 text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
                      "{result.improvedAnswer}"
                    </div>
                  </div>
                )}

                {viewTab === 'spoken' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4 text-indigo-600" />
                        Natural Spoken Delivery (Sounds Human & Confident)
                      </span>
                    </div>
                    <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
                      "{result.spokenVersion}"
                    </div>
                    <p className="text-xs text-slate-500 italic">
                      Tip: Practice speaking this version aloud twice before your interview to sound authentic and fluid.
                    </p>
                  </div>
                )}

                {viewTab === 'star' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/60">
                      <span className="text-[11px] font-black uppercase text-blue-700 tracking-wider">
                        S — Situation
                      </span>
                      <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                        {result.starBreakdown.situation}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/60">
                      <span className="text-[11px] font-black uppercase text-indigo-700 tracking-wider">
                        T — Task
                      </span>
                      <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                        {result.starBreakdown.task}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200/60">
                      <span className="text-[11px] font-black uppercase text-purple-700 tracking-wider">
                        A — Action
                      </span>
                      <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                        {result.starBreakdown.action}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
                      <span className="text-[11px] font-black uppercase text-emerald-700 tracking-wider">
                        R — Result
                      </span>
                      <p className="text-xs text-slate-800 mt-1 leading-relaxed">
                        {result.starBreakdown.result}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Strengths & Actionable Critiques */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                  <span className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    What You Did Well:
                  </span>
                  <ul className="space-y-1.5 text-xs text-emerald-900">
                    {result.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                  <span className="font-bold text-amber-950 text-xs sm:text-sm flex items-center gap-1.5 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Constructive Improvement Tips:
                  </span>
                  <ul className="space-y-1.5 text-xs text-amber-900">
                    {result.areasToImprove.map((crit, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Power Phrases pill box */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Power Phrases to Remember:
                </span>
                {result.powerPhrases.map((phrase, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold"
                  >
                    "{phrase}"
                  </span>
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-100 to-pink-100 text-purple-600 mx-auto flex items-center justify-center">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Ready to Upgrade Your Interview Answers
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Type in an interview question and your rough response on the left. The AI coach will score your readiness and deliver a compelling STAR version.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
