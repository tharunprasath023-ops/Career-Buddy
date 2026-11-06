import React, { useState, useEffect } from 'react';
import {
  Map,
  Sparkles,
  Copy,
  Bookmark,
  CheckCircle2,
  Calendar,
  Layers,
  Code2,
  ExternalLink,
  BookOpen,
  Award,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react';
import { RoadmapResult, RoadmapStage } from '../types/career';
import { SAMPLE_ROADMAP_DATA } from '../data/samplePresets';
import { LoadingState } from './LoadingState';
import { triggerCelebration } from '../utils/confetti';

interface SkillRoadmapProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSave: (title: string, data: { input: any; result: RoadmapResult }) => void;
  initialSkill?: string;
  savedData?: { input: any; result: RoadmapResult } | null;
}

const COMMON_SKILLS = [
  'Full Stack Web Development (React & Node.js)',
  'Data Science & Analytics (Python, Pandas, SQL)',
  'Machine Learning & Generative AI',
  'UI/UX Product Design (Figma & Design Systems)',
  'Cloud & DevOps (AWS, Docker, CI/CD)',
  'Mobile App Development (React Native / Flutter)',
  'Cybersecurity & Ethical Hacking',
  'Backend Engineering (Go / Java Spring Boot)',
];

export const SkillRoadmap: React.FC<SkillRoadmapProps> = ({
  onNotify,
  onSave,
  initialSkill,
  savedData,
}) => {
  const [targetSkill, setTargetSkill] = useState(
    initialSkill || savedData?.input?.targetSkill || SAMPLE_ROADMAP_DATA.targetCareerOrSkill
  );
  const [currentLevel, setCurrentLevel] = useState(
    savedData?.input?.currentLevel || SAMPLE_ROADMAP_DATA.currentLevel
  );
  const [weeklyHours, setWeeklyHours] = useState(
    savedData?.input?.weeklyHours || SAMPLE_ROADMAP_DATA.weeklyCommitmentHours
  );

  const [result, setResult] = useState<RoadmapResult | null>(
    savedData?.result || null
  );
  const [loading, setLoading] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialSkill) {
      setTargetSkill(initialSkill);
    }
  }, [initialSkill]);

  const toggleTopic = (topicKey: string) => {
    setCompletedTopics((prev) => {
      const next = { ...prev, [topicKey]: !prev[topicKey] };
      const checkedCount = Object.values(next).filter(Boolean).length;
      if (checkedCount % 4 === 0 && next[topicKey]) {
        triggerCelebration();
      }
      return next;
    });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSkill.trim()) {
      onNotify('error', 'Please enter or select a skill/career.');
      return;
    }

    setLoading(true);
    setCompletedTopics({});
    try {
      const response = await fetch('/api/career/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCareerOrSkill: targetSkill,
          currentLevel,
          weeklyCommitmentHours: Number(weeklyHours),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate roadmap');
      }

      const data: RoadmapResult = await response.json();
      setResult(data);
      triggerCelebration();
      onNotify('success', '3-Stage Skill Roadmap ready!');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || 'Failed to generate roadmap.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyRoadmap = () => {
    if (!result) return;
    const stagesText = result.stages
      .map(
        (s) =>
          `=== ${s.stageName.toUpperCase()} STAGE (${s.timeline}) ===\nGoal: ${s.goal}\n\nModules:\n${s.modules
            .map((m) => `• ${m.moduleTitle}: ${m.topics.join(', ')}`)
            .join('\n')}\n\nMilestone Project:\n${s.milestoneProject.title} - ${s.milestoneProject.description}\n`
      )
      .join('\n');

    navigator.clipboard.writeText(
      `AI Career Buddy - 3-Stage Roadmap: ${result.roadmapTitle}\nDuration: ${result.totalDuration}\n\n${stagesText}\n\nCapstone:\n${result.portfolioCapstone.title} - ${result.portfolioCapstone.description}`
    );
    triggerCelebration();
    onNotify('success', 'Roadmap text copied to clipboard!');
  };

  const handleSaveDraft = () => {
    if (!result) return;
    onSave(`Roadmap: ${targetSkill}`, {
      input: { targetSkill, currentLevel, weeklyHours },
      result,
    });
    onNotify('success', 'Saved roadmap to your drafts.');
  };

  // Calculate overall checklist completion percentage
  const allTopicsCount =
    result?.stages.reduce(
      (acc, stage) =>
        acc + stage.modules.reduce((mAcc, m) => mAcc + m.topics.length, 0),
      0
    ) || 0;

  const completedCount = Object.values(completedTopics).filter(Boolean).length;
  const progressPercent = allTopicsCount > 0 ? Math.round((completedCount / allTopicsCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Skill Learning Roadmap
              </h2>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Beginner → Advanced
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Structured 3-stage curriculum with milestone resume projects and free learning resources
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setTargetSkill(SAMPLE_ROADMAP_DATA.targetCareerOrSkill);
            setCurrentLevel(SAMPLE_ROADMAP_DATA.currentLevel);
            setWeeklyHours(SAMPLE_ROADMAP_DATA.weeklyCommitmentHours);
            onNotify('info', 'Loaded Full Stack Web Dev preset.');
          }}
          className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>Load Sample Roadmap Preset</span>
        </button>
      </div>

      {/* Target Config Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Quick Select Pills */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Quick Select Target Skill or Career
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SKILLS.map((skill) => (
                <button
                  type="button"
                  key={skill}
                  onClick={() => setTargetSkill(skill)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    targetSkill === skill
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Skill / Role *
              </label>
              <input
                type="text"
                required
                value={targetSkill}
                onChange={(e) => setTargetSkill(e.target.value)}
                placeholder="e.g. Machine Learning with Python"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Starting Level
              </label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
              >
                <option value="Complete Beginner (No prior experience)">Complete Beginner (No prior experience)</option>
                <option value="Basic Knowledge (Know fundamentals, need projects)">Basic Knowledge (Know fundamentals, need projects)</option>
                <option value="Intermediate (Looking to bridge to industry level)">Intermediate (Looking to bridge to industry level)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Weekly Study Commitment
              </label>
              <select
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
              >
                <option value={5}>5 hours / week (Light / Coursework heavy)</option>
                <option value={10}>10 hours / week (Recommended balance)</option>
                <option value={15}>15 hours / week (Intensive student pace)</option>
                <option value={20}>20+ hours / week (Summer break bootcamp)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-sm shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
            <span>{loading ? 'Designing 3-Stage Roadmap...' : 'Generate 3-Stage Learning Roadmap'}</span>
          </button>
        </form>
      </div>

      {/* Output Roadmap */}
      {loading ? (
        <LoadingState
          title="Mapping Your 3-Stage Learning Journey..."
          subtitle="Sequencing beginner syntax, intermediate architectures, and resume-ready capstone projects."
        />
      ) : result ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Overview Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                  {result.totalDuration} Total Estimated Pace
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {result.roadmapTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {result.overview}
              </p>
            </div>

            <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
              <button
                onClick={handleCopyRoadmap}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Roadmap</span>
              </button>
              <button
                onClick={handleSaveDraft}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-emerald-600 transition-colors"
                title="Save Roadmap"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Progress Bar */}
          {allTopicsCount > 0 && (
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Your Checklist Progress: {completedCount} / {allTopicsCount} topics checked
                </span>
                <span className="text-emerald-600 font-extrabold">{progressPercent}% Completed</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* 3 Progressive Stages */}
          <div className="space-y-6">
            {result.stages.map((stage, stageIdx) => {
              const stageColors = [
                {
                  badge: 'bg-blue-100 text-blue-800 border-blue-200',
                  border: 'border-blue-200/80',
                  accent: 'text-blue-700',
                  bg: 'bg-blue-50/30',
                },
                {
                  badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
                  border: 'border-indigo-200/80',
                  accent: 'text-indigo-700',
                  bg: 'bg-indigo-50/30',
                },
                {
                  badge: 'bg-purple-100 text-purple-800 border-purple-200',
                  border: 'border-purple-200/80',
                  accent: 'text-purple-700',
                  bg: 'bg-purple-50/30',
                },
              ];
              const color = stageColors[stageIdx % stageColors.length];

              return (
                <div
                  key={stageIdx}
                  className={`bg-white rounded-3xl p-6 sm:p-8 border ${color.border} shadow-xs space-y-6`}
                >
                  {/* Stage Heading */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-slate-900 text-white font-extrabold text-sm flex items-center justify-center">
                        {stageIdx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${color.badge}`}>
                            {stage.stageName} Stage
                          </span>
                          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {stage.timeline}
                          </span>
                        </div>
                        <h4 className="text-lg font-extrabold text-slate-900 mt-1">
                          Goal: {stage.goal}
                        </h4>
                      </div>
                    </div>
                  </div>

                  {/* Modules & Checklists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stage.modules.map((mod, modIdx) => (
                      <div
                        key={modIdx}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <h5 className="font-bold text-slate-900 text-sm mb-2">
                            {mod.moduleTitle}
                          </h5>
                          <div className="space-y-1.5">
                            {mod.topics.map((topic, tIdx) => {
                              const key = `${stageIdx}_${modIdx}_${tIdx}`;
                              const isChecked = Boolean(completedTopics[key]);
                              return (
                                <label
                                  key={tIdx}
                                  className={`flex items-start gap-2 p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                    isChecked
                                      ? 'bg-emerald-50 text-emerald-900 line-through opacity-75'
                                      : 'hover:bg-white text-slate-700'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleTopic(key)}
                                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <span>{topic}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                          <strong>Outcome:</strong> {mod.practicalOutcome}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Milestone Project */}
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-emerald-700" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                          Stage Milestone Project: {stage.milestoneProject.title}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-950 mt-1 leading-relaxed">
                        {stage.milestoneProject.description}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-[11px] text-emerald-800 shrink-0 font-medium max-w-xs">
                      <strong>Resume Highlight:</strong> "{stage.milestoneProject.resumeHighlight}"
                    </div>
                  </div>

                  {/* Curated Free Resources */}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Recommended Learning Resources:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                      {stage.recommendedResources.map((res, rIdx) => (
                        <div
                          key={rIdx}
                          className="p-3 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-300 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-slate-900 truncate">
                              {res.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                              {res.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500">{res.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Capstone Portfolio Project Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Award className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Ultimate Capstone Portfolio Project
              </span>
            </div>
            <h4 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              {result.portfolioCapstone.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {result.portfolioCapstone.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-400">Tech Stack:</span>
              {result.portfolioCapstone.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md bg-white/10 text-white text-xs font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-200">
              <strong>Why Recruiters Value This:</strong> {result.portfolioCapstone.whyItImpressesRecruiters}
            </div>
          </div>

          {/* Study Habits for Students */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              Study Strategy for College Students Balancing Coursework:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              {result.studyTips.map((tip, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="font-bold text-slate-900 block mb-1">Habit #{i + 1}</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-100 text-emerald-600 mx-auto flex items-center justify-center">
            <Map className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Generate Your 3-Stage Skill Roadmap
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Pick a career or skill above to build a step-by-step roadmap from Beginner to Advanced, complete with milestone projects to put on your resume.
          </p>
        </div>
      )}
    </div>
  );
};
