import React, { useState } from 'react';
import { 
  X, 
  History, 
  Film, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Calendar, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { ArchivedEpisode, Frame } from '../types';

interface FlashbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodes: ArchivedEpisode[];
  onInsertFlashbackFrames: (frames: Frame[]) => void;
  currentEpisodeNumber: number;
}

export const FlashbackModal: React.FC<FlashbackModalProps> = ({
  isOpen,
  onClose,
  episodes,
  onInsertFlashbackFrames,
  currentEpisodeNumber,
}) => {
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>(episodes[0]?.id || '');
  const [selectedFrameIds, setSelectedFrameIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const activeEpisode = episodes.find((e) => e.id === selectedEpisodeId) || episodes[0];

  const toggleFrameSelection = (frameId: string) => {
    setSelectedFrameIds((prev) =>
      prev.includes(frameId) ? prev.filter((id) => id !== frameId) : [...prev, frameId]
    );
  };

  const handleInsertAllFromEpisode = () => {
    if (!activeEpisode) return;
    const flashbackFrames = activeEpisode.frames.map((f, i) => ({
      ...f,
      id: `flashback_${activeEpisode.episodeNumber}_${Date.now()}_${i}`,
      isFlashback: true,
      flashbackEpisodeNumber: activeEpisode.episodeNumber,
      label: `[Flashback Ep.${activeEpisode.episodeNumber}] ${f.label || 'Memory'}`,
    }));
    onInsertFlashbackFrames(flashbackFrames);
    onClose();
  };

  const handleInsertSelected = () => {
    if (!activeEpisode) return;
    const toInsert = activeEpisode.frames
      .filter((f) => selectedFrameIds.includes(f.id))
      .map((f, i) => ({
        ...f,
        id: `flashback_${activeEpisode.episodeNumber}_${Date.now()}_${i}`,
        isFlashback: true,
        flashbackEpisodeNumber: activeEpisode.episodeNumber,
        label: `[Flashback Ep.${activeEpisode.episodeNumber}] ${f.label || 'Memory'}`,
      }));

    if (toInsert.length === 0) return;
    onInsertFlashbackFrames(toInsert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0E121A] border border-[#232938] rounded-xl max-w-2xl w-full p-6 shadow-2xl flex flex-col gap-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#212738]">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Episode Flashback Library (Story Coherence)
              </h3>
              <p className="text-[11px] text-neutral-400">
                Recall moments and keyframe bursts from prior episodes into Episode {currentEpisodeNumber}.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left: Prior Episodes List */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Previous Episodes ({episodes.length})
            </span>

            {episodes.map((ep) => {
              const isSelected = activeEpisode?.id === ep.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => setSelectedEpisodeId(ep.id)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#182030] border-amber-400 text-white'
                      : 'bg-[#111522] border-[#202738] text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Ep. {ep.episodeNumber}</span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      {ep.frames.length} frames
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 truncate mt-0.5">{ep.title}</p>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Episode Frames Preview */}
          {activeEpisode && (
            <div className="md:col-span-2 bg-[#121623] border border-[#212838] rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-[#212838]">
                <div>
                  <h4 className="text-xs font-bold text-white">{activeEpisode.title}</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                    {activeEpisode.synopsis}
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                  Gemma 2 Locked
                </span>
              </div>

              {/* Frames selection strip */}
              <div>
                <span className="text-[11px] font-semibold text-neutral-300 block mb-1.5">
                  Select Frames to Insert as Flashback:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {activeEpisode.frames.map((frame, i) => {
                    const isSelected = selectedFrameIds.includes(frame.id);
                    return (
                      <div
                        key={frame.id}
                        onClick={() => toggleFrameSelection(frame.id)}
                        className={`relative aspect-video rounded overflow-hidden border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/40 scale-102'
                            : 'border-[#232938] hover:border-neutral-500'
                        }`}
                      >
                        <img
                          src={frame.dataUrl}
                          alt={`F${i + 1}`}
                          className="w-full h-full object-cover filter sepia-25"
                        />
                        <div className="absolute top-1 left-1 bg-black/70 px-1 rounded text-[9px] font-mono text-white">
                          F{i + 1}
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 right-1 bg-amber-400 text-black p-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-[#212838]">
                <button
                  type="button"
                  onClick={handleInsertAllFromEpisode}
                  className="flex-1 py-2 px-3 bg-[#1A2030] hover:bg-[#252E44] text-neutral-200 text-xs font-medium rounded transition-colors cursor-pointer"
                >
                  Insert Entire Scene ({activeEpisode.frames.length}f)
                </button>
                <button
                  type="button"
                  onClick={handleInsertSelected}
                  disabled={selectedFrameIds.length === 0}
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black text-xs font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Insert Selected ({selectedFrameIds.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
