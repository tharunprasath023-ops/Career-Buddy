import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  DollarSign,
  GraduationCap,
  Briefcase,
  Zap,
  Target,
  Clock,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { CareerGuidanceResult, CareerPath } from '../types/career';
import { SAMPLE_GUIDANCE_DATA } from '../data/samplePresets';
import { LoadingState } from './LoadingState';
import { triggerCelebration } from '../utils/confetti';

interface CareerGuidanceProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSave: (title: string, data: { input: any; result: CareerGuidanceResult }) => void;
  onSelectCareerForRoadmap: (careerTitle: string) => void;
  initialData?: { input: any; result: CareerGuidanceResult } | null;
}

const COMMON_INTERESTS = [
  'Web & App Development',
  'Artificial Intelligence / ML',
  'UI/UX & Visual Design',
  'Data Analytics & Stats',
  'Cybersecurity & Privacy',
  'Cloud & DevOps',
  'Product Strategy',
  'Financial Markets',
  'Bioinformatics & Health Tech',
  'Game Development',
];

const COMMON_SUBJECTS = [
  'Data Structures & Algorithms',
  'Database Systems',
  'Human-Computer Interaction (HCI)',
  'Probability & Statistics',
  'Computer Networks',
  'Economics & Finance',
  'Psychology',
  'Marketing Management',
];

export const CareerGuidance: React.FC<CareerGuidanceProps> = ({
  onNotify,
  onSave,
  onSelectCareerForRoadmap,
  initialData,
}) => {
  const [degree, setDegree] = useState(
    initialData?.input?.degree || 'B.S. in Computer Science & Information Tech'
  );
  const [yearOfStudy, setYearOfStudy] = useState(
    initialData?.input?.yearOfStudy || 'Junior (3rd Year)'
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialData?.input?.interests || ['Web & App Development', 'Data Analytics & Stats', 'UI/UX & Visual Design']
  );
  const [customInterest, setCustomInterest] = useState('');
  const [skillsInput, setSkillsInput] = useState(
    initialData?.input?.skills || 'JavaScript, Python, React, SQL, Problem Solving'
  );
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    initialData?.input?.favoriteSubjects || ['Human-Computer Interaction (HCI)', 'Database Systems']
  );
  const [workPreferences, setWorkPreferences] = useState(
    initialData?.input?.workPreferences || 'Collaborative team with good engineering mentorship, hybrid setup'
  );

  const [result, setResult] = useState<CareerGuidanceResult | null>(
    initialData?.result || null
  );
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests([...selectedInterests, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject]
    );
  };

  const handleLoadSample = () => {
    setDegree(SAMPLE_GUIDANCE_DATA.degree);
    setYearOfStudy(SAMPLE_GUIDANCE_DATA.yearOfStudy);
    setSelectedInterests(SAMPLE_GUIDANCE_DATA.interests);
    setSkillsInput(SAMPLE_GUIDANCE_DATA.skills.join(', '));
    setSelectedSubjects(SAMPLE_GUIDANCE_DATA.favoriteSubjects);
    setWorkPreferences(SAMPLE_GUIDANCE_DATA.workPreferences);
    onNotify('info', 'Loaded sample college student profile.');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedInterests.length === 0 || selectedSubjects.length === 0) {
      onNotify('error', 'Please select at least one interest and one favorite subject.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/career/guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          degree,
          yearOfStudy,
          interests: selectedInterests,
          skills: skillsInput.split(',').map((s: string) => s.trim()).filter(Boolean),
          favoriteSubjects: selectedSubjects,
          workPreferences,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate career guidance');
      }

      const data: CareerGuidanceResult = await response.json();
      setResult(data);
      triggerCelebration();
      onNotify('success', 'Matched your profile with custom career trajectories!');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || 'Failed to generate guidance.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!result) return;
    onSave(`Career Guidance: ${degree}`, {
      input: {
        degree,
        yearOfStudy,
        interests: selectedInterests,
        skills: skillsInput,
        favoriteSubjects: selectedSubjects,
        workPreferences,
      },
      result,
    });
    onNotify('success', 'Saved career recommendations to your drafts.');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                AI Career Guidance
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Personalized Paths
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Discover tailored career paths based on your academic passions, skills, and work style
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Zap className="w-4 h-4 text-blue-600" />
          <span>Load Student Profile Sample</span>
        </button>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Degree & Major *
              </label>
              <input
                type="text"
                required
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.S. in Computer Science"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Year of Study
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white"
              >
                <option value="Freshman (1st Year)">Freshman (1st Year)</option>
                <option value="Sophomore (2nd Year)">Sophomore (2nd Year)</option>
                <option value="Junior (3rd Year)">Junior (3rd Year)</option>
                <option value="Senior (Final Year)">Senior (Final Year)</option>
                <option value="Graduate Student (Master's / Ph.D.)">Graduate Student (Master's / Ph.D.)</option>
              </select>
            </div>
          </div>

          {/* Interests selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Your Interests & Passions *
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COMMON_INTERESTS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomInterest();
                  }
                }}
                placeholder="Add other custom interest..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={addCustomInterest}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Favorite Subjects */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Your Favourite Subjects *
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SUBJECTS.map((subj) => {
                const isSelected = selectedSubjects.includes(subj);
                return (
                  <button
                    type="button"
                    key={subj}
                    onClick={() => toggleSubject(subj)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {subj}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Skills / Tools You Already Know
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="e.g. Python, SQL, React, Excel, Git"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Work Preference / Environment
              </label>
              <input
                type="text"
                value={workPreferences}
                onChange={(e) => setWorkPreferences(e.target.value)}
                placeholder="e.g. Remote, fast-paced startup, research-driven, big tech"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>{loading ? 'Analyzing College Profile...' : 'Suggest Matching Career Paths'}</span>
          </button>
        </form>
      </div>

      {/* Output Guidance */}
      {loading ? (
        <LoadingState
          title="Mapping Out Your Optimal Career Horizons..."
          subtitle="Synthesizing your academic interests, subjects, and strengths into actionable career paths."
        />
      ) : result ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Profile Analysis Banner */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-6 sm:p-8 border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Profile Synthesis
              </span>
              <p className="text-sm sm:text-base text-slate-800 font-semibold mt-1 max-w-3xl leading-relaxed">
                "{result.profileAnalysis}"
              </p>
            </div>

            <button
              onClick={handleSaveDraft}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-blue-600 transition-colors shadow-2xs self-start md:self-auto"
              title="Save Career Guidance to Drafts"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>

          {/* Career Path Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.careerPaths.map((path, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div>
                  {/* Header & Match */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                        Path #{idx + 1}
                      </span>
                      <h3 className="text-xl font-extrabold text-slate-900 leading-tight mt-0.5">
                        {path.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium italic mt-0.5">
                        "{path.tagline}"
                      </p>
                    </div>

                    <div className="px-3 py-1.5 rounded-2xl bg-blue-50 border border-blue-200 text-center shrink-0">
                      <div className="text-sm font-black text-blue-700">
                        {path.matchPercentage}%
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">
                        Match
                      </div>
                    </div>
                  </div>

                  {/* Why Good Fit */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700 leading-relaxed mb-4">
                    <span className="font-bold text-slate-900 block mb-0.5">
                      Why this fits your profile:
                    </span>
                    {path.whyGoodFit}
                  </div>

                  {/* Skills Required */}
                  <div className="space-y-2 mb-4">
                    <span className="text-xs font-bold text-slate-700 block">
                      Core Skills Needed:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {path.requiredSkills.core.map((sk, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Entry Level Roles */}
                  <div className="mb-4 text-xs text-slate-600">
                    <span className="font-bold text-slate-800 block mb-1">
                      Typical Entry-Level Roles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {path.entryLevelRoles.map((role, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Day in the Life */}
                  <div className="p-3 rounded-xl bg-indigo-50/40 border border-indigo-100 text-xs text-slate-700 leading-relaxed mb-4">
                    <span className="font-bold text-indigo-900 block mb-0.5">
                      Day in the Life:
                    </span>
                    {path.dayInTheLife}
                  </div>

                  {/* Progression Trajectory */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5 text-xs">
                    <span className="font-bold text-slate-800 block">Growth Trajectory:</span>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-semibold text-slate-700">Year 1:</span>
                      <span>{path.growthTrajectory.year1}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-semibold text-slate-700">Year 3:</span>
                      <span>{path.growthTrajectory.year3}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-semibold text-slate-700">Year 5:</span>
                      <span>{path.growthTrajectory.year5}</span>
                    </div>
                  </div>

                  {/* Salary & Outlook */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      {path.salaryOutlook}
                    </span>
                    <span className="font-medium text-slate-500">
                      {path.marketDemand}
                    </span>
                  </div>
                </div>

                {/* Jump to Roadmap Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onSelectCareerForRoadmap(path.title)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all group"
                  >
                    <span>Generate Learning Roadmap for {path.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* College Student Advice Tips */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Empowering Next Steps for College Students:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              {result.generalAdvice.map((adv, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="font-bold text-slate-900 block mb-1">Step #{i + 1}</span>
                  <p>{adv}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-100 to-cyan-100 text-blue-600 mx-auto flex items-center justify-center">
            <Compass className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Discover Your Personalized Career Trajectories
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Select your academic passions, favorite subjects, and skills above to get 3-4 grounded career options with growth steps and salary outlooks.
          </p>
        </div>
      )}
    </div>
  );
};
