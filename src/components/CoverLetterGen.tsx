import React, { useState } from 'react';
import {
  Send,
  Sparkles,
  Copy,
  Printer,
  Bookmark,
  CheckCircle2,
  Download,
  Zap,
  Info,
  Building2,
  Mail,
  User,
} from 'lucide-react';
import { CoverLetterResult } from '../types/career';
import { SAMPLE_COVER_LETTER_DATA } from '../data/samplePresets';
import { LoadingState } from './LoadingState';
import { triggerCelebration } from '../utils/confetti';

interface CoverLetterGenProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSave: (title: string, data: { input: any; result: CoverLetterResult }) => void;
  savedData?: { input: any; result: CoverLetterResult } | null;
}

export const CoverLetterGen: React.FC<CoverLetterGenProps> = ({
  onNotify,
  onSave,
  savedData,
}) => {
  const [studentName, setStudentName] = useState(
    savedData?.input?.studentName || SAMPLE_COVER_LETTER_DATA.studentName
  );
  const [email, setEmail] = useState(
    savedData?.input?.email || SAMPLE_COVER_LETTER_DATA.email
  );
  const [phone, setPhone] = useState(
    savedData?.input?.phone || SAMPLE_COVER_LETTER_DATA.phone
  );
  const [jobRole, setJobRole] = useState(
    savedData?.input?.jobRole || SAMPLE_COVER_LETTER_DATA.jobRole
  );
  const [companyName, setCompanyName] = useState(
    savedData?.input?.companyName || SAMPLE_COVER_LETTER_DATA.companyName
  );
  const [qualifications, setQualifications] = useState(
    savedData?.input?.qualifications || SAMPLE_COVER_LETTER_DATA.qualifications
  );
  const [relevantProjects, setRelevantProjects] = useState(
    savedData?.input?.relevantProjects || SAMPLE_COVER_LETTER_DATA.relevantProjects
  );
  const [whyCompany, setWhyCompany] = useState(
    savedData?.input?.whyCompany || SAMPLE_COVER_LETTER_DATA.whyCompany
  );
  const [tone, setTone] = useState(
    savedData?.input?.tone || SAMPLE_COVER_LETTER_DATA.tone
  );

  const [result, setResult] = useState<CoverLetterResult | null>(
    savedData?.result || null
  );
  const [loading, setLoading] = useState(false);

  const handleLoadSample = () => {
    setStudentName(SAMPLE_COVER_LETTER_DATA.studentName);
    setEmail(SAMPLE_COVER_LETTER_DATA.email);
    setPhone(SAMPLE_COVER_LETTER_DATA.phone);
    setJobRole(SAMPLE_COVER_LETTER_DATA.jobRole);
    setCompanyName(SAMPLE_COVER_LETTER_DATA.companyName);
    setQualifications(SAMPLE_COVER_LETTER_DATA.qualifications);
    setRelevantProjects(SAMPLE_COVER_LETTER_DATA.relevantProjects);
    setWhyCompany(SAMPLE_COVER_LETTER_DATA.whyCompany);
    setTone(SAMPLE_COVER_LETTER_DATA.tone);
    onNotify('info', 'Loaded sample cover letter inputs.');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !jobRole.trim() || !companyName.trim()) {
      onNotify('error', 'Please provide your Name, Job Role, and Company Name.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/career/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          email,
          phone,
          jobRole,
          companyName,
          qualifications,
          relevantProjects,
          whyCompany,
          tone,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate cover letter');
      }

      const data: CoverLetterResult = await response.json();
      setResult(data);
      triggerCelebration();
      onNotify('success', 'Professional cover letter crafted!');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || 'Failed to generate cover letter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.coverLetterText);
    triggerCelebration();
    onNotify('success', 'Cover letter copied to clipboard!');
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.coverLetterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${companyName.replace(/\s+/g, '_')}_Cover_Letter_${studentName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    onNotify('success', 'Downloaded cover letter text.');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = () => {
    if (!result) return;
    onSave(`Cover Letter: ${jobRole} at ${companyName}`, {
      input: {
        studentName,
        email,
        phone,
        jobRole,
        companyName,
        qualifications,
        relevantProjects,
        whyCompany,
        tone,
      },
      result,
    });
    onNotify('success', 'Saved cover letter to your drafts.');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-violet-500/20">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Cover Letter Generator
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-800">
                Tailored Outreach
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Create an authentic, well-written cover letter connecting your college projects to company missions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="px-3.5 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Zap className="w-4 h-4 text-violet-600" />
          <span>Load Sample Student Letter</span>
        </button>
      </div>

      {/* Main Grid: Form Inputs vs Generated Letter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6 no-print">
          <form onSubmit={handleGenerate} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-violet-600" />
              Role & Company Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Alex Chen"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.chen@university.edu"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  placeholder="e.g. Software Engineer Intern"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Starlight Labs"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Academic Qualifications & Background
              </label>
              <textarea
                rows={2}
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                placeholder="Degree, major, university, GPA, relevant coursework..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Relevant Projects / Strengths to Emphasize
              </label>
              <textarea
                rows={2}
                value={relevantProjects}
                onChange={(e) => setRelevantProjects(e.target.value)}
                placeholder="Mention 1-2 major projects, tech stack used, or student club responsibilities..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Why Are You Drawn to This Specific Company?
              </label>
              <textarea
                rows={2}
                value={whyCompany}
                onChange={(e) => setWhyCompany(e.target.value)}
                placeholder="What about their products, open source work, culture, or mission excites you?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Desired Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-violet-500 focus:outline-hidden bg-white"
              >
                <option value="Professional & Confident">Professional & Confident (Standard)</option>
                <option value="Enthusiastic & Passionate">Enthusiastic & Passionate (Great for startups)</option>
                <option value="Academic & Research-Oriented">Academic & Research-Oriented (Great for R&D/Labs)</option>
                <option value="Concise & Direct">Concise & Direct (Under 250 words)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white font-extrabold text-sm shadow-md shadow-violet-500/20 hover:shadow-violet-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>{loading ? 'Crafting Tailored Cover Letter...' : 'Generate Professional Cover Letter'}</span>
            </button>
          </form>
        </div>

        {/* Generated Letter Output (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <LoadingState
              title="Writing Your Targeted Cover Letter..."
              subtitle="Aligning your student coursework with company needs without inventing false claims."
            />
          ) : result ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Header Actions & Subject Line */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 no-print">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-600">
                      Generated Cover Letter
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                      Tailored for {companyName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      title="Copy Cover Letter Text"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Letter</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Print or Save as PDF"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Print / PDF</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
                      title="Download as Text File"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                    </button>
                    <button
                      onClick={handleSaveDraft}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-violet-600 transition-colors"
                      title="Save to Drafts"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subject Line Pill */}
                <div className="p-3.5 rounded-2xl bg-violet-50/60 border border-violet-100 flex items-start gap-3">
                  <Mail className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-violet-950 block">Suggested Email Subject Line:</span>
                    <span className="text-slate-800 font-mono mt-0.5 select-all">{result.subjectLine}</span>
                  </div>
                </div>

                {/* Highlights Pill */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-semibold text-slate-400">Key Themes:</span>
                  {result.keyHighlights.map((hl, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                    >
                      ✓ {hl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Letter Document Preview */}
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-md print-card space-y-4">
                <div className="text-xs text-slate-400 font-mono border-b border-slate-100 pb-3 flex justify-between">
                  <span>Document: Application Cover Letter</span>
                  <span>Target: {companyName}</span>
                </div>

                <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-800 leading-relaxed space-y-4 selection:bg-violet-100">
                  {result.coverLetterText}
                </div>
              </div>

              {/* Customization Advice */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs text-slate-600 no-print">
                <span className="font-bold text-slate-800 block mb-1">
                  Pro-Tip for Submitting:
                </span>
                <ul className="space-y-1 list-disc list-inside">
                  {result.customizationTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-100 to-indigo-100 text-violet-600 mx-auto flex items-center justify-center">
                <Send className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Craft a Compelling Cover Letter
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Provide your target company, role, and coursework on the left, or test with{' '}
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-violet-600 font-bold underline hover:text-violet-800"
                >
                  Sample Student Data
                </button>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
