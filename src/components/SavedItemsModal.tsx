import React from 'react';
import { Bookmark, Trash2, X, FileText, HelpCircle, MessageSquare, Compass, Map, Send, ExternalLink } from 'lucide-react';
import { SavedItem, FeatureTab } from '../types/career';

interface SavedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: SavedItem[];
  onDeleteItem: (id: string) => void;
  onRestoreItem: (item: SavedItem) => void;
}

const TAB_ICONS: Record<FeatureTab, React.ComponentType<{ className?: string }>> = {
  resume: FileText,
  questions: HelpCircle,
  improver: MessageSquare,
  guidance: Compass,
  roadmap: Map,
  'cover-letter': Send,
};

const TAB_LABELS: Record<FeatureTab, string> = {
  resume: 'Resume Draft',
  questions: 'Interview Questions',
  improver: 'Improved Answer',
  guidance: 'Career Guidance',
  roadmap: 'Learning Roadmap',
  'cover-letter': 'Cover Letter',
};

export const SavedItemsModal: React.FC<SavedItemsModalProps> = ({
  isOpen,
  onClose,
  savedItems,
  onDeleteItem,
  onRestoreItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 no-print">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Your Saved Career Drafts
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {savedItems.length} {savedItems.length === 1 ? 'item' : 'items'} saved locally in your browser
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

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {savedItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Saved Drafts Yet</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                When you generate a resume, cover letter, or roadmap, click the "Save to My Drafts" button to keep it here.
              </p>
            </div>
          ) : (
            savedItems.map((item) => {
              const Icon = TAB_ICONS[item.type] || FileText;
              const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/40 hover:border-indigo-200 transition-all group"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1 pr-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center text-indigo-600 shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                          {TAB_LABELS[item.type]}
                        </span>
                        <span className="text-[11px] text-slate-400">{dateStr}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 truncate mt-1">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        onRestoreItem(item);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                    >
                      <span>Load</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
