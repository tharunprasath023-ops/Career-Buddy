import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ResumeBuilder } from './components/ResumeBuilder';
import { InterviewQuestionGen } from './components/InterviewQuestionGen';
import { InterviewAnswerImprover } from './components/InterviewAnswerImprover';
import { CareerGuidance } from './components/CareerGuidance';
import { SkillRoadmap } from './components/SkillRoadmap';
import { CoverLetterGen } from './components/CoverLetterGen';
import { SavedItemsModal } from './components/SavedItemsModal';
import { EthicsModal } from './components/EthicsModal';
import { Toast, ToastMessage } from './components/Toast';
import { FeatureTab, SavedItem } from './types/career';
import { getSavedItems, saveItem, deleteSavedItem } from './utils/storage';
import { GraduationCap, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<FeatureTab>('resume');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isEthicsModalOpen, setIsEthicsModalOpen] = useState(false);

  // Cross-tool data passing states
  const [practiceQuestionData, setPracticeQuestionData] = useState<{
    question: string;
    jobRole: string;
  } | null>(null);

  const [roadmapCareerData, setRoadmapCareerData] = useState<string | null>(null);

  // Restored drafts state per tab
  const [restoredDrafts, setRestoredDrafts] = useState<Partial<Record<FeatureTab, any>>>({});

  useEffect(() => {
    setSavedItems(getSavedItems());
  }, []);

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, type, message };
    setToasts((prev) => [...prev, newToast]);

    // auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSaveItem = (type: FeatureTab, title: string, data: any) => {
    const saved = saveItem({ type, title, data });
    setSavedItems(getSavedItems());
    addNotification('success', `Saved "${title}" to your local drafts!`);
  };

  const handleDeleteItem = (id: string) => {
    const updated = deleteSavedItem(id);
    setSavedItems(updated);
    addNotification('info', 'Item removed from drafts.');
  };

  const handleRestoreItem = (item: SavedItem) => {
    setActiveTab(item.type);
    setRestoredDrafts((prev) => ({
      ...prev,
      [item.type]: item.data,
    }));
    addNotification('success', `Loaded draft: ${item.title}`);
  };

  // Seamless bridging from Interview Questions to Answer Improver
  const handlePracticeQuestion = (question: string, jobRole: string) => {
    setPracticeQuestionData({ question, jobRole });
    setActiveTab('improver');
    addNotification('info', 'Question passed to Interview Answer Improver.');
  };

  // Seamless bridging from Career Guidance to Skill Roadmap
  const handleSelectCareerForRoadmap = (careerTitle: string) => {
    setRoadmapCareerData(careerTitle);
    setActiveTab('roadmap');
    addNotification('info', `Generated skill roadmap target: ${careerTitle}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
        savedCount={savedItems.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenEthics={() => setIsEthicsModalOpen(true)}
      />

      {/* Hero Section with 6 Feature Cards */}
      <HeroSection
        activeTab={activeTab}
        onSelectFeature={(tab) => {
          setActiveTab(tab);
          const toolElement = document.getElementById('active-career-tool');
          if (toolElement) {
            toolElement.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Main Feature Container */}
      <main id="active-career-tool" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="pt-2">
          {activeTab === 'resume' && (
            <ResumeBuilder
              onNotify={addNotification}
              onSave={(title, data) => handleSaveItem('resume', title, data)}
              initialData={restoredDrafts.resume}
            />
          )}

          {activeTab === 'questions' && (
            <InterviewQuestionGen
              onNotify={addNotification}
              onSave={(title, data) => handleSaveItem('questions', title, data)}
              onPracticeQuestion={handlePracticeQuestion}
              initialData={restoredDrafts.questions}
            />
          )}

          {activeTab === 'improver' && (
            <InterviewAnswerImprover
              onNotify={addNotification}
              onSave={(title, data) => handleSaveItem('improver', title, data)}
              initialQuestion={practiceQuestionData?.question}
              initialRole={practiceQuestionData?.jobRole}
              savedData={restoredDrafts.improver}
            />
          )}

          {activeTab === 'guidance' && (
            <CareerGuidance
              onNotify={addNotification}
              onSave={(title, data) => handleSaveItem('guidance', title, data)}
              onSelectCareerForRoadmap={handleSelectCareerForRoadmap}
              initialData={restoredDrafts.guidance}
            />
          )}

          {activeTab === 'roadmap' && (
            <SkillRoadmap
              onNotify={addNotification}
              onSave={(title, data) => handleSaveItem('roadmap', title, data)}
              initialSkill={roadmapCareerData || undefined}
              savedData={restoredDrafts.roadmap}
            />
          )}

          {activeTab === 'cover-letter' && (
            <CoverLetterGen
              onNotify={addNotification}
              onSave={(title, data) => handleSaveItem('cover-letter', title, data)}
              savedData={restoredDrafts['cover-letter']}
            />
          )}
        </div>
      </main>

      {/* Modals & Overlays */}
      <SavedItemsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedItems={savedItems}
        onDeleteItem={handleDeleteItem}
        onRestoreItem={handleRestoreItem}
      />

      <EthicsModal
        isOpen={isEthicsModalOpen}
        onClose={() => setIsEthicsModalOpen(false)}
      />

      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-800 text-sm">
              AI Career Buddy
            </span>
            <span>—</span>
            <span className="font-medium">Discover Your Skills. Build Your Future.</span>
          </div>

          <div className="flex items-center gap-4 font-semibold text-slate-600">
            <button
              onClick={() => setIsEthicsModalOpen(true)}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ethics & Student Guide</span>
            </button>
            <span>•</span>
            <span className="text-slate-400">Powered by Google Gemini AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
