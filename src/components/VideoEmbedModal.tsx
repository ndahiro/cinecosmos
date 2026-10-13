import React, { useState, useRef } from 'react';
import { 
  X, 
  Video, 
  Upload, 
  RefreshCw, 
  Film, 
  CheckCircle2, 
  Sliders, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { extractFramesFromVideoFile } from '../services/ffmpeg';
import { Frame } from '../types';

interface VideoEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportExtractedFrames: (frames: Frame[]) => void;
  currentFps: number;
}

export const VideoEmbedModal: React.FC<VideoEmbedModalProps> = ({
  isOpen,
  onClose,
  onImportExtractedFrames,
  currentFps,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fps, setFps] = useState<number>(currentFps || 12);
  const [maxFrames, setMaxFrames] = useState<number>(36);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [extractedFrames, setExtractedFrames] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setExtractedFrames([]);
    }
  };

  const handleStartExtraction = async () => {
    if (!selectedFile) return;
    try {
      setIsExtracting(true);
      setProgress(5);
      const frames = await extractFramesFromVideoFile(
        selectedFile,
        fps,
        maxFrames,
        (prog) => setProgress(prog.progressPercent)
      );
      setExtractedFrames(frames);
      setIsExtracting(false);
    } catch (err: any) {
      console.error('Frame extraction failed:', err);
      alert('Frame extraction failed: ' + (err.message || 'Check video codec'));
      setIsExtracting(false);
    }
  };

  const handleConfirmImport = () => {
    if (extractedFrames.length === 0) return;
    const newFrames: Frame[] = extractedFrames.map((url, idx) => ({
      id: `embed_frame_${Date.now()}_${idx}`,
      order: idx,
      dataUrl: url,
      durationFrames: 1,
      source: 'video_embed',
      label: `Embedded Clip F${idx + 1}`,
      notes: `Extracted via FFmpeg at ${fps} fps`,
      onionSkinOpacity: 0.5,
    }));
    onImportExtractedFrames(newFrames);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0E121A] border border-[#232938] rounded-xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-5 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#212738]">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              FFmpeg Video Embedding & Frame Slicer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {extractedFrames.length === 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-neutral-400 leading-relaxed">
              Embed any live-action or reference video footage using FFmpeg. Slices the video into sequential stop-motion frames with customizable frame rates for onion skinning and character rotoscoping.
            </p>

            {/* Video File Picker */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#272F42] hover:border-cyan-500/50 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#0A0D15]"
            >
              <Upload className="w-8 h-8 text-cyan-400 mb-2" />
              <p className="text-xs font-semibold text-white">
                {selectedFile ? selectedFile.name : 'Click to select video or drop file'}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1">
                MP4, WebM, MOV supported (up to 4K resolution)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Settings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Extraction Sample Rate
                </label>
                <select
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                  className="w-full bg-[#121622] border border-[#212838] text-xs text-white rounded px-3 py-1.5 outline-none"
                >
                  <option value="6">6 FPS (Loose stop-motion)</option>
                  <option value="8">8 FPS (Claymation cadence)</option>
                  <option value="12">12 FPS (Standard stop-motion twos)</option>
                  <option value="24">24 FPS (Smooth cinema)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Max Frame Limit
                </label>
                <input
                  type="number"
                  min="6"
                  max="120"
                  value={maxFrames}
                  onChange={(e) => setMaxFrames(parseInt(e.target.value) || 24)}
                  className="w-full bg-[#121622] border border-[#212838] text-xs text-white rounded px-3 py-1.5 outline-none"
                />
              </div>
            </div>

            {/* Extraction Progress */}
            {isExtracting && (
              <div className="flex flex-col gap-1.5 bg-[#090C12] p-3 rounded border border-[#1E2434]">
                <div className="flex justify-between text-xs font-mono text-neutral-300">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Extracting stop-motion frames via FFmpeg...
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${progress}%` }}
                    className="h-full bg-cyan-400 transition-all duration-150"
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={handleStartExtraction}
              disabled={!selectedFile || isExtracting}
              className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-lg shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Layers className="w-4 h-4 text-black" />
              <span>Slice Video into Stop-Motion Sequence</span>
            </button>
          </div>
        ) : (
          /* Extraction Preview */
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Extracted {extractedFrames.length} Stop-Motion Frames
              </span>
              <span className="text-neutral-400 font-mono">@{fps} FPS</span>
            </div>

            {/* Thumbnail carousel */}
            <div className="grid grid-cols-6 gap-2 max-h-56 overflow-y-auto p-1 bg-[#090C12] rounded border border-[#1E2434]">
              {extractedFrames.map((url, i) => (
                <div key={i} className="relative aspect-video rounded overflow-hidden border border-[#232938]">
                  <img src={url} alt={`F${i + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 right-0 bg-black/70 text-[9px] font-mono px-1 text-white">
                    {i + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setExtractedFrames([])}
                className="px-4 py-2 bg-[#161B26] text-neutral-300 text-xs rounded hover:bg-[#202738] cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={handleConfirmImport}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-xs rounded flex items-center justify-center gap-2 cursor-pointer shadow-md hover:from-amber-300 hover:to-amber-400"
              >
                <span>Import {extractedFrames.length} Frames to Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
