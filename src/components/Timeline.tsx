import React, { useRef, useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Scissors, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  VolumeX, 
  Clock, 
  Type, 
  Sparkles, 
  Music, 
  Layers, 
  Upload,
  ArrowLeftRight,
  GripVertical,
  History
} from 'lucide-react';
import { Project, Frame, CaptionItem, AudioTrackItem } from '../types';

interface TimelineProps {
  project: Project;
  currentFrameIndex: number;
  setCurrentFrameIndex: (idx: number) => void;
  onUpdateFrames: (frames: Frame[]) => void;
  onDeleteFrame: (frameId: string) => void;
  onDuplicateFrame: (frameId: string) => void;
  onSplitFrame: (frameId: string) => void;
  onReverseSequence: () => void;
  onUploadPhotos: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddAutoCaptions: () => void;
  onOpenCosmosGenerator: () => void;
  onOpenFlashbacks: () => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  project,
  currentFrameIndex,
  setCurrentFrameIndex,
  onUpdateFrames,
  onDeleteFrame,
  onDuplicateFrame,
  onSplitFrame,
  onReverseSequence,
  onUploadPhotos,
  onAddAutoCaptions,
  onOpenCosmosGenerator,
  onOpenFlashbacks,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(72); // width per frame in px
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll timeline to keep playhead in view
  useEffect(() => {
    if (timelineContainerRef.current) {
      const container = timelineContainerRef.current;
      const targetScroll = currentFrameIndex * zoomLevel - container.clientWidth / 2;
      container.scrollTo({ left: Math.max(0, targetScroll), behavior: 'smooth' });
    }
  }, [currentFrameIndex, zoomLevel]);

  // Handle drag and drop reordering of frames
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newFrames = [...project.frames];
    const [moved] = newFrames.splice(draggedIndex, 1);
    newFrames.splice(targetIndex, 0, moved);

    // Re-index orders
    const reordered = newFrames.map((f, idx) => ({ ...f, order: idx }));
    onUpdateFrames(reordered);
    setCurrentFrameIndex(targetIndex);
    setDraggedIndex(null);
  };

  // Keyboard split / duplicate / delete handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const currentFrame = project.frames[currentFrameIndex];
      if (!currentFrame) return;

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        onSplitFrame(currentFrame.id);
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        onDuplicateFrame(currentFrame.id);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDeleteFrame(currentFrame.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentFrameIndex, project.frames, onSplitFrame, onDuplicateFrame, onDeleteFrame]);

  const totalFramesCount = project.frames.length;
  const totalDurationSec = (
    project.frames.reduce((sum, f) => sum + (f.durationFrames || 1), 0) / project.fps
  ).toFixed(1);

  return (
    <div className="flex flex-col bg-[#0C0F17] border border-[#1F2430] rounded-lg overflow-hidden shadow-xl select-none">
      {/* Timeline Toolbar */}
      <div className="h-10 bg-[#121622] px-4 flex items-center justify-between border-b border-[#1F2430] text-xs">
        {/* Left: OpenCut Editing Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              const curr = project.frames[currentFrameIndex];
              if (curr) onSplitFrame(curr.id);
            }}
            title="Split Clip (S)"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1A2030] hover:bg-[#252E44] text-neutral-300 transition-colors cursor-pointer"
          >
            <Scissors className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Split (S)</span>
          </button>

          <button
            onClick={() => {
              const curr = project.frames[currentFrameIndex];
              if (curr) onDuplicateFrame(curr.id);
            }}
            title="Duplicate Frame (D)"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1A2030] hover:bg-[#252E44] text-neutral-300 transition-colors cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Duplicate (D)</span>
          </button>

          <button
            onClick={() => {
              const curr = project.frames[currentFrameIndex];
              if (curr) onDeleteFrame(curr.id);
            }}
            title="Delete Frame (Del)"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#1A2030] hover:bg-red-950/40 text-neutral-300 hover:text-red-400 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>

          <div className="h-4 w-px bg-[#262C3D] mx-1"></div>

          <button
            onClick={onReverseSequence}
            title="Reverse Frame Order"
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#1A2030] hover:bg-[#252E44] text-neutral-300 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden md:inline">Reverse</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Upload Photo Burst"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors cursor-pointer font-medium"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Add Photos</span>
          </button>

          <button
            onClick={onOpenCosmosGenerator}
            title="Generate animation frames using Cosmos physical model and Gemma Embedding 2"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 text-amber-300 border border-emerald-500/30 transition-colors cursor-pointer font-medium"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cosmos AI Gen</span>
          </button>

          <button
            onClick={onOpenFlashbacks}
            title="Recall and insert flashback keyframes from prior episodes"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 transition-colors cursor-pointer font-medium"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Episode Flashbacks</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={onUploadPhotos}
            className="hidden"
          />
        </div>

        {/* Center: Sequence Stats */}
        <div className="hidden lg:flex items-center gap-3 text-neutral-400 font-mono text-[11px] tabular-nums">
          <span>Total: <strong className="text-white">{totalFramesCount}</strong> frames</span>
          <span>·</span>
          <span>Duration: <strong className="text-amber-400">{totalDurationSec}s</strong></span>
        </div>

        {/* Right: Zoom & Track controls */}
        <div className="flex items-center gap-2">
          {/* AI Auto-captions button */}
          <button
            onClick={onAddAutoCaptions}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#1E2538] hover:bg-[#29324B] text-neutral-200 transition-colors cursor-pointer text-xs"
          >
            <Type className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Auto-Captions</span>
          </button>

          {/* Audio Mute toggle */}
          <button
            onClick={() => setIsAudioMuted(!isAudioMuted)}
            className={`p-1 rounded transition-colors cursor-pointer ${
              isAudioMuted ? 'text-red-400 bg-red-950/30' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-[#090C12] px-1.5 py-0.5 rounded border border-[#1E2332]">
            <button
              onClick={() => setZoomLevel(Math.max(40, zoomLevel - 16))}
              className="p-0.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono text-neutral-400 w-6 text-center">
              {Math.round((zoomLevel / 72) * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(140, zoomLevel + 16))}
              className="p-0.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Track Body Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Track Headers (Left sidebar) */}
        <div className="w-36 md:w-44 bg-[#0F131D] border-r border-[#1F2430] shrink-0 z-10 flex flex-col text-xs font-medium">
          {/* Ruler spacer */}
          <div className="h-6 border-b border-[#1F2430] px-3 flex items-center text-[10px] text-neutral-500 font-mono">
            TRACKS
          </div>

          {/* Track 1: Video / Stop-Motion Frames */}
          <div className="h-24 px-3 flex items-center justify-between border-b border-[#1F2430] bg-[#121622]/60">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Video / Frames</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">{project.fps}fps</span>
          </div>

          {/* Track 2: Character Anchor Layer */}
          <div className="h-10 px-3 flex items-center justify-between border-b border-[#1F2430] bg-[#101420]">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cosmos Anchor</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-500">Gemma 2</span>
          </div>

          {/* Track 3: Audio / Foley Track */}
          <div className="h-10 px-3 flex items-center justify-between border-b border-[#1F2430] bg-[#101420]">
            <div className="flex items-center gap-1.5 text-cyan-400">
              <Music className="w-3.5 h-3.5 text-cyan-400" />
              <span>Audio / Foley</span>
            </div>
            <span className="text-[10px] font-mono text-neutral-500">Stereo</span>
          </div>

          {/* Track 4: Captions Track */}
          <div className="h-10 px-3 flex items-center justify-between bg-[#101420]">
            <div className="flex items-center gap-1.5 text-purple-400">
              <Type className="w-3.5 h-3.5 text-purple-400" />
              <span>Auto-Captions</span>
            </div>
            <span className="text-[10px] font-mono text-purple-500">Sub</span>
          </div>
        </div>

        {/* Scrollable Timeline Grid */}
        <div 
          ref={timelineContainerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden relative bg-[#080A10]"
        >
          {/* Scrubber Playhead Line */}
          <div 
            style={{ 
              left: `${currentFrameIndex * zoomLevel + zoomLevel / 2}px`,
              transition: 'left 0.08s ease-out'
            }}
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-30 pointer-events-none shadow-[0_0_8px_rgba(245,158,11,0.8)]"
          >
            {/* Scrubber Head Pin */}
            <div className="w-3.5 h-3.5 bg-amber-400 -translate-x-[6px] rotate-45 rounded-sm shadow-md"></div>
          </div>

          {/* Time Ruler */}
          <div className="h-6 border-b border-[#1F2430] bg-[#0B0E16] flex items-center relative text-[10px] font-mono text-neutral-500">
            {project.frames.map((_, idx) => (
              <div
                key={idx}
                style={{ width: `${zoomLevel}px` }}
                onClick={() => setCurrentFrameIndex(idx)}
                className="shrink-0 border-r border-[#1B202E] h-full flex items-center justify-center cursor-pointer hover:bg-neutral-800/40 text-neutral-400"
              >
                {idx % 2 === 0 ? idx + 1 : '·'}
              </div>
            ))}
          </div>

          {/* Track 1: Frames strip */}
          <div className="h-24 flex items-center border-b border-[#1F2430] bg-[#0A0D15] p-1 gap-1">
            {project.frames.map((frame, idx) => {
              const isSelected = idx === currentFrameIndex;
              return (
                <div
                  key={frame.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  onClick={() => setCurrentFrameIndex(idx)}
                  style={{ width: `${zoomLevel}px` }}
                  className={`relative h-full rounded border shrink-0 overflow-hidden cursor-pointer group transition-all ${
                    isSelected
                      ? 'border-amber-400 ring-2 ring-amber-400/30 scale-y-102 z-20'
                      : 'border-[#1E2434] hover:border-neutral-500 opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Frame thumbnail */}
                  <img
                    src={frame.dataUrl}
                    alt={`Frame ${idx + 1}`}
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />

                  {/* Top frame index tag or Flashback indicator */}
                  <div className="absolute top-0.5 left-0.5 bg-black/70 px-1 py-0.2 rounded text-[9px] font-mono font-bold text-white flex items-center gap-1">
                    {frame.isFlashback && (
                      <span className="text-cyan-300 text-[8px] font-bold">FLASHEp.{frame.flashbackEpisodeNumber || 1}</span>
                    )}
                    <span>{idx + 1}</span>
                  </div>

                  {/* Hold frame duration tag */}
                  <div className="absolute bottom-0.5 right-0.5 bg-black/70 px-1 py-0.2 rounded text-[9px] font-mono text-amber-300">
                    {frame.durationFrames}f
                  </div>

                  {/* Drag affordance */}
                  <div className="absolute top-0.5 right-0.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded p-0.5">
                    <GripVertical className="w-2.5 h-2.5 text-white" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Track 2: Character Anchor strip */}
          <div className="h-10 flex items-center border-b border-[#1F2430] bg-[#0B0F19] p-1 gap-1">
            {project.frames.map((frame, idx) => {
              const hasAnchor = !!frame.characterAnchorId;
              return (
                <div
                  key={frame.id}
                  style={{ width: `${zoomLevel}px` }}
                  className="h-full shrink-0 flex items-center justify-center p-0.5"
                >
                  {hasAnchor ? (
                    <div className="w-full h-full bg-emerald-500/20 border border-emerald-500/40 rounded flex items-center justify-center text-[10px] text-emerald-300 font-mono truncate px-1">
                      Maya (99%)
                    </div>
                  ) : (
                    <div className="w-full h-full border border-dashed border-neutral-800 rounded"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Track 3: Audio / Foley strip with simulated waveform */}
          <div className="h-10 flex items-center border-b border-[#1F2430] bg-[#0A0E18] p-1 gap-1">
            <div 
              style={{ width: `${project.frames.length * zoomLevel}px` }}
              className="h-full bg-cyan-950/40 border border-cyan-800/40 rounded flex items-center px-3 relative overflow-hidden"
            >
              {/* Audio waveform simulation */}
              <div className="flex items-center gap-1 w-full h-4 opacity-70">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div
                    key={i}
                    style={{ height: `${20 + (Math.sin(i * 0.8) + 1) * 35}%` }}
                    className="w-1 bg-cyan-400 rounded-full shrink-0"
                  ></div>
                ))}
              </div>
              <span className="absolute right-3 text-[10px] font-mono text-cyan-300">
                Timber Armature & Theme Track (0.85 vol)
              </span>
            </div>
          </div>

          {/* Track 4: Captions strip */}
          <div className="h-10 flex items-center bg-[#090D17] p-1 gap-1">
            {project.captions.map((cap) => {
              const startFrame = Math.round((cap.startMs / 1000) * project.fps);
              const endFrame = Math.round((cap.endMs / 1000) * project.fps);
              const durationFrames = Math.max(1, endFrame - startFrame);
              const capWidth = durationFrames * zoomLevel;

              return (
                <div
                  key={cap.id}
                  style={{ width: `${capWidth}px` }}
                  className="h-full bg-purple-900/30 border border-purple-500/40 rounded px-2 flex items-center text-[10px] text-purple-200 font-medium truncate"
                >
                  "{cap.text}"
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
