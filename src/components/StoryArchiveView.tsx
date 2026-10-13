import React, { useState } from 'react';
import { 
  Film, 
  Share2, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Layers, 
  Save, 
  PlusCircle,
  Clock,
  Play,
  X
} from 'lucide-react';
import { Project, ArchivedEpisode, CharacterAnchor } from '../types';

interface StoryArchiveViewProps {
  project: Project;
  episodes: ArchivedEpisode[];
  characters: CharacterAnchor[];
  onSaveCurrentEpisodeToArchive: () => void;
  onOpenExportModal: () => void;
  onStartNextEpisode: () => void;
  onSwitchEpisode?: (episodeNumber: number) => void;
}

export const StoryArchiveView: React.FC<StoryArchiveViewProps> = ({
  project,
  episodes,
  characters,
  onSaveCurrentEpisodeToArchive,
  onOpenExportModal,
  onStartNextEpisode,
  onSwitchEpisode,
}) => {
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [previewingEpisode, setPreviewingEpisode] = useState<any | null>(null);
  const [previewFrameIdx, setPreviewFrameIdx] = useState<number>(0);

  const handleSave = () => {
    onSaveCurrentEpisodeToArchive();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Play preview sequence timer
  React.useEffect(() => {
    if (!previewingEpisode || !previewingEpisode.frames || previewingEpisode.frames.length === 0) return;
    const interval = setInterval(() => {
      setPreviewFrameIdx((prev) => (prev + 1) % previewingEpisode.frames.length);
    }, 1000 / 12);
    return () => clearInterval(interval);
  }, [previewingEpisode]);

  return (
    <div className="bg-[#0D1018] border border-[#1F2430] rounded-lg p-5 flex flex-col gap-6 shadow-xl animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2430]">
        <div>
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Series Story Arc & Coherent Multi-Episode Archive
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Review your sequential multi-episode storyline. Both Episode 1 and Episode 2 star the same character (<strong className="text-amber-300">Maya</strong>) with locked Gemma Embedding 2 facial armature and wardrobe continuity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1B2232] hover:bg-[#252F45] text-amber-300 border border-amber-500/30 rounded text-xs font-semibold transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Saved to Series!' : 'Save Current Episode'}</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black rounded text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export & Share Master</span>
          </button>
        </div>
      </div>

      {/* Continuity Health Banner */}
      <div className="bg-[#121624] border border-[#20283A] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Series Storyline Integrity: 99.4% Verified</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                Maya Continuous Across All Episodes
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Facial sculpt, auburn clay curls, crimson scarf weave, and armature physics match 100% across Episode 1 and Episode 2.
            </p>
          </div>
        </div>

        <button
          onClick={onStartNextEpisode}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#182030] hover:bg-[#222B40] text-amber-300 rounded text-xs font-medium border border-amber-500/20 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Queue Episode 3 (The Astral Spire)</span>
        </button>
      </div>

      {/* Episodic Story Arc Timeline Cards */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Story Arc Episodes ({episodes.length})
          </span>
          <span className="text-[11px] text-neutral-500 font-mono">
            Shared Character: Maya (Gemma 2 Vector Anchor #char_maya_01)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {episodes.map((ep) => {
            const isCurrent = ep.episodeNumber === project.episodeNumber;
            return (
              <div
                key={ep.id}
                className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
                  isCurrent
                    ? 'bg-[#151B28] border-amber-500/50 ring-1 ring-amber-500/20 shadow-lg'
                    : 'bg-[#101420] border-[#1E2434] hover:border-neutral-600'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={ep.thumbnailUrl}
                      alt={ep.title}
                      className="w-16 h-16 rounded-lg object-cover border border-[#272F42] shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{ep.title}</span>
                        {isCurrent && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-black font-bold uppercase">
                            Currently Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed line-clamp-2">
                        {ep.synopsis}
                      </p>
                      <div className="text-[10px] text-amber-300 font-mono mt-1">
                        Cast: {ep.characterNames?.join(', ') || 'Maya'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1E2434] text-[11px] font-mono text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{ep.durationSec}s · {ep.frames.length} frames</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewingEpisode(ep);
                        setPreviewFrameIdx(0);
                      }}
                      className="px-2.5 py-1 bg-[#1E2536] hover:bg-[#283248] text-white rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Play className="w-3 h-3 fill-white stroke-none" />
                      <span>Reel</span>
                    </button>

                    {onSwitchEpisode && !isCurrent && (
                      <button
                        type="button"
                        onClick={() => onSwitchEpisode(ep.episodeNumber)}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors font-bold"
                      >
                        <span>Open & Edit</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Episode Reel Preview Modal */}
      {previewingEpisode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0E121A] border border-[#232938] rounded-xl max-w-lg w-full p-5 shadow-2xl flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#212738]">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">{previewingEpisode.title} — Reel Preview</h3>
              </div>
              <button
                onClick={() => setPreviewingEpisode(null)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-[#222838] flex items-center justify-center">
              <img
                src={previewingEpisode.frames[previewFrameIdx]?.dataUrl || previewingEpisode.thumbnailUrl}
                alt="Reel Frame"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-amber-300">
                Frame {previewFrameIdx + 1} / {previewingEpisode.frames.length} @ 12 FPS
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400">
                Gemma 2 Character Lock: Maya
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {previewingEpisode.synopsis}
            </p>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setPreviewingEpisode(null)}
                className="px-4 py-1.5 bg-[#1A2030] hover:bg-[#252E44] text-neutral-300 rounded text-xs cursor-pointer"
              >
                Close Reel
              </button>
              {onSwitchEpisode && (
                <button
                  onClick={() => {
                    const epNum = previewingEpisode.episodeNumber;
                    setPreviewingEpisode(null);
                    onSwitchEpisode(epNum);
                  }}
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded cursor-pointer transition-colors"
                >
                  Load in OpenCut Studio
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
