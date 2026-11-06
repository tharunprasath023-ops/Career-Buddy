import React, { useState } from 'react';
import {
  FileText,
  Sparkles,
  Copy,
  Printer,
  Download,
  Bookmark,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  Info,
} from 'lucide-react';
import { marked } from 'marked';
import { ResumeFormData, ResumeResult, EducationItem, ProjectItem, ExperienceItem } from '../types/career';
import { SAMPLE_RESUME_DATA } from '../data/samplePresets';
import { LoadingState } from './LoadingState';
import { triggerCelebration } from '../utils/confetti';

interface ResumeBuilderProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
  onSave: (title: string, data: { form: ResumeFormData; result: ResumeResult }) => void;
  initialData?: { form: ResumeFormData; result: ResumeResult } | null;
}

export const ResumeBuilder: React.FC<ResumeBuilderProps> = ({
  onNotify,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<ResumeFormData>(
    initialData?.form || SAMPLE_RESUME_DATA
  );
  const [result, setResult] = useState<ResumeResult | null>(
    initialData?.result || null
  );
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'formatted' | 'markdown' | 'text'>('formatted');

  // Education handlers
  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', degree: '', field: '', gradYear: '', gpa: '', relevantCourses: '' },
      ],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateEducation = (index: number, field: keyof EducationItem, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, education: updated };
    });
  };

  // Projects handlers
  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: '', techStack: '', description: '', link: '' },
      ],
    }));
  };

  const handleRemoveProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateProject = (index: number, field: keyof ProjectItem, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.projects];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, projects: updated };
    });
  };

  // Experience handlers
  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: '', organization: '', period: '', details: '' },
      ],
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateExperience = (index: number, field: keyof ExperienceItem, val: string) => {
    setFormData((prev) => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, experience: updated };
    });
  };

  const handleLoadSample = () => {
    setFormData(SAMPLE_RESUME_DATA);
    onNotify('info', 'Loaded sample college student profile.');
  };

  const handleClear = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      portfolio: '',
      targetRole: '',
      summaryGoal: '',
      education: [{ institution: '', degree: '', field: '', gradYear: '', gpa: '', relevantCourses: '' }],
      skills: { technical: '', tools: '', soft: '' },
      projects: [{ title: '', techStack: '', description: '', link: '' }],
      experience: [],
      certifications: '',
      achievements: '',
    });
    setResult(null);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.targetRole.trim()) {
      onNotify('error', 'Please enter your Full Name and Target Role.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/career/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate resume');
      }

      const data: ResumeResult = await response.json();
      setResult(data);
      triggerCelebration();
      onNotify('success', 'Professional resume draft successfully generated!');
    } catch (err: any) {
      console.error(err);
      onNotify('error', err.message || 'Something went wrong while communicating with Gemini AI.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.resumeMarkdown);
    triggerCelebration();
    onNotify('success', 'Resume copied to clipboard in clean Markdown!');
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.resumeMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.fullName.replace(/\s+/g, '_')}_Resume.md`;
    link.click();
    URL.revokeObjectURL(url);
    onNotify('success', 'Downloaded resume as Markdown file.');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveDraft = () => {
    if (!result) return;
    onSave(`${formData.fullName} - ${formData.targetRole}`, { form: formData, result });
    onNotify('success', 'Saved resume draft to your browser storage.');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              AI Resume Builder
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Turn your coursework, skills, and projects into an ATS-optimized resume draft
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>Fill Sample Data</span>
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs sm:text-sm font-semibold transition-colors"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Main Form & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Inputs (lg: 6 cols) */}
        <div className="lg:col-span-6 space-y-6 no-print">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* 1. Basic Info */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 text-xs font-black flex items-center justify-center">1</span>
                Contact & Career Objective
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Alex Chen"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.targetRole}
                    onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                    placeholder="e.g. Software Engineer Intern"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@university.edu"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="linkedin.com/in/username"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    GitHub / Portfolio
                  </label>
                  <input
                    type="text"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="github.com/username"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Career Summary / Goal Statement
                </label>
                <textarea
                  rows={2}
                  value={formData.summaryGoal}
                  onChange={(e) => setFormData({ ...formData, summaryGoal: e.target.value })}
                  placeholder="Briefly describe what you're seeking and what drives you..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* 2. Education */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">2</span>
                  Education Details
                </h3>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add College / School
                </button>
              </div>

              {formData.education.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
                  {formData.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        College / University Name
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                        placeholder="e.g. State University"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Degree & Major
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                        placeholder="e.g. B.S. in Computer Science"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Graduation Year / Expected
                      </label>
                      <input
                        type="text"
                        value={edu.gradYear}
                        onChange={(e) => handleUpdateEducation(idx, 'gradYear', e.target.value)}
                        placeholder="e.g. 2026"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        GPA / CGPA (Optional)
                      </label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => handleUpdateEducation(idx, 'gpa', e.target.value)}
                        placeholder="e.g. 3.8 / 4.0 or 8.9 / 10"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Relevant Coursework
                    </label>
                    <input
                      type="text"
                      value={edu.relevantCourses}
                      onChange={(e) => handleUpdateEducation(idx, 'relevantCourses', e.target.value)}
                      placeholder="e.g. Algorithms, Web Development, Database Systems"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Skills */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">3</span>
                Skills & Technologies
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Programming Languages / Core Skills
                  </label>
                  <input
                    type="text"
                    value={formData.skills.technical}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        skills: { ...formData.skills, technical: e.target.value },
                      })
                    }
                    placeholder="e.g. Python, Java, JavaScript, TypeScript, SQL, C++"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Frameworks, Libraries & Tools
                  </label>
                  <input
                    type="text"
                    value={formData.skills.tools}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        skills: { ...formData.skills, tools: e.target.value },
                      })
                    }
                    placeholder="e.g. React, Node.js, Express, Git, Docker, Figma, Tailwind"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Soft Skills & Strengths
                  </label>
                  <input
                    type="text"
                    value={formData.skills.soft}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        skills: { ...formData.skills, soft: e.target.value },
                      })
                    }
                    placeholder="e.g. Team collaboration, Agile sprints, Problem solving, Fast learner"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 4. Projects */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">4</span>
                  Key Projects & Capstones
                </h3>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </div>

              {formData.projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => handleUpdateProject(idx, 'title', e.target.value)}
                        placeholder="e.g. StudySync App"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Tech Stack Used
                      </label>
                      <input
                        type="text"
                        value={proj.techStack}
                        onChange={(e) => handleUpdateProject(idx, 'techStack', e.target.value)}
                        placeholder="e.g. React, Node.js, MongoDB"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Description & What You Built
                    </label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                      placeholder="Describe what problem it solved and any results (e.g. used by 100 students)..."
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 5. Experience / Leadership */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 text-xs font-black flex items-center justify-center">5</span>
                  Experience / Campus Leadership
                </h3>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Experience
                </button>
              </div>

              {formData.experience.length === 0 ? (
                <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-50 border border-slate-100">
                  No experience added yet. College internships, TA roles, or club leadership count! Click "Add Experience" if applicable.
                </p>
              ) : (
                formData.experience.map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(idx)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Role Title
                        </label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                          placeholder="e.g. Teaching Assistant"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Organization / Company
                        </label>
                        <input
                          type="text"
                          value={exp.organization}
                          onChange={(e) => handleUpdateExperience(idx, 'organization', e.target.value)}
                          placeholder="e.g. CS Department"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => handleUpdateExperience(idx, 'period', e.target.value)}
                          placeholder="e.g. Jan 2024 - Present"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Key Responsibilities & Impact
                      </label>
                      <textarea
                        rows={2}
                        value={exp.details}
                        onChange={(e) => handleUpdateExperience(idx, 'details', e.target.value)}
                        placeholder="e.g. Mentored 40+ students on data structures and debugging..."
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs sm:text-sm bg-white"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 6. Achievements & Certifications */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-pink-100 text-pink-700 text-xs font-black flex items-center justify-center">6</span>
                Certifications & Achievements
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Certifications / Online Courses
                  </label>
                  <input
                    type="text"
                    value={formData.certifications}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    placeholder="e.g. AWS Cloud Practitioner, Coursera Deep Learning"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Honors, Hackathons & Awards
                  </label>
                  <input
                    type="text"
                    value={formData.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    placeholder="e.g. Dean's List 2024, 2nd Place at University Hackathon"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>{loading ? 'Generating Standout Resume...' : 'Generate Professional Resume Draft'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Output / Preview (lg: 6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {loading ? (
            <LoadingState
              title="Crafting Your College Resume..."
              subtitle="Structuring education, converting projects into high-impact bullet points, and maximizing ATS keyword alignment."
            />
          ) : result ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Score & Summary Banner */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 no-print">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-indigo-700 leading-none">
                        {result.atsScoreEstimate}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">/ 100</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          ATS Match Rating
                        </span>
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> High Impact
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        Recruiter-Ready Student Draft
                      </h4>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      title="Copy resume text to clipboard"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Resume</span>
                    </button>
                    <button
                      onClick={handlePrint}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Print or save as PDF"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>Print / PDF</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs transition-colors"
                      title="Download Markdown"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                    </button>
                    <button
                      onClick={handleSaveDraft}
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-indigo-600 text-xs transition-colors"
                      title="Save to My Drafts"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Executive Summary Snippet */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Executive Summary Highlight
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1 italic">
                    "{result.executiveSummary}"
                  </p>
                </div>

                {/* Key Strengths & Action Verbs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                    <span className="font-bold text-indigo-900 block mb-1">Standout Strengths:</span>
                    <ul className="space-y-1 text-slate-700">
                      {result.keyStrengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                    <span className="font-bold text-purple-900 block mb-1">Power Verbs Incorporated:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {result.actionVerbsUsed.map((verb, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-700 font-semibold text-[11px]">
                          {verb}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between no-print">
                <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl">
                  <button
                    onClick={() => setPreviewMode('formatted')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      previewMode === 'formatted'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Formatted Document
                  </button>
                  <button
                    onClick={() => setPreviewMode('markdown')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      previewMode === 'markdown'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Raw Markdown
                  </button>
                  <button
                    onClick={() => setPreviewMode('text')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      previewMode === 'text'
                        ? 'bg-white text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Plain Text
                  </button>
                </div>

                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  Click 'Copy Resume' to paste anywhere
                </span>
              </div>

              {/* Document Preview Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md print-card">
                {previewMode === 'formatted' ? (
                  <div
                    className="prose prose-slate max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed
                      prose-headings:font-extrabold prose-headings:text-slate-900 prose-headings:tracking-tight
                      prose-h1:text-xl sm:prose-h1:text-2xl prose-h1:border-b prose-h1:border-slate-200 prose-h1:pb-2
                      prose-h2:text-sm sm:prose-h2:text-base prose-h2:uppercase prose-h2:tracking-wider prose-h2:text-indigo-700 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-1 prose-h2:mt-4
                      prose-ul:pl-4 prose-li:my-1 prose-p:my-1.5"
                    dangerouslySetInnerHTML={{ __html: marked.parse(result.resumeMarkdown) as string }}
                  />
                ) : previewMode === 'markdown' ? (
                  <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {result.resumeMarkdown}
                  </pre>
                ) : (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 font-mono whitespace-pre-wrap leading-relaxed">
                    {result.resumeMarkdown.replace(/[#*`_]/g, '')}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Your Resume Draft Will Appear Here
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Fill in your education and projects on the left, or click{' '}
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-indigo-600 font-bold underline hover:text-indigo-800"
                >
                  Fill Sample Data
                </button>{' '}
                to see how Gemini AI organizes college achievements into a professional resume.
              </p>
              <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
                <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                  ATS Optimized Structure
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                  Action Verbs & Impact
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                  1-Click Copy & PDF
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
