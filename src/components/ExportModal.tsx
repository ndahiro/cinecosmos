import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Sparkles, 
  Film, 
  CheckCircle2, 
  RefreshCw, 
  Video, 
  Sliders,
  Copy,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Project, ExportSettings, AspectRatio } from '../types';
import { renderFramesToVideoBlob } from '../services/ffmpeg';

interface ExportModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  const [format, setFormat] = useState<'mp4' | 'webm' | 'gif'>('mp4');
  const [resolution, setResolution] = useState<'4K' | '1080p' | '720p'>('1080p');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(project.aspectRatio);
  const [includeCaptions, setIncludeCaptions] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);
  const [exportedFilename, setExportedFilename] = useState<string>('');
  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    try {
      setIsExporting(true);
      setExportProgress(5);
      setExportedVideoUrl(null);

      const settings: ExportSettings = {
        format,
        resolution,
        aspectRatio,
        fps: project.fps,
        includeCaptions,
        includeAudio: true,
      };

      const result = await renderFramesToVideoBlob(
        project.frames,
        settings,
        includeCaptions ? project.captions : [],
        (percent) => setExportProgress(percent)
      );

      setExportedVideoUrl(result.url);
      setExportedFilename(result.filename);
      setIsExporting(false);

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#06B6D4', '#FFFFFF'],
        });
      } catch {
        // fallback
      }
    } catch (err: any) {
      console.error('Export failed:', err);
      alert('Export failed: ' + (err.message || 'Unknown error'));
      setIsExporting(false);
    }
  };

  const handleSocialShare = async (platformName: string) => {
    if (navigator.share && exportedVideoUrl) {
      try {
        await navigator.share({
          title: `${project.name} - Episode ${project.episodeNumber}`,
          text: `Watch my new stop-motion animation created with CineCosmos Studio!`,
          url: window.location.href,
        });
        setShareSuccess(`Shared to ${platformName}!`);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(
      `Check out "${project.name} - Ep. ${project.episodeNumber}" created on CineCosmos Studio! #StopMotion #CineCosmos`
    );
    setShareSuccess(`Link and social copy copied for ${platformName}!`);
    setTimeout(() => setShareSuccess(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0E121A] border border-[#232938] rounded-xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-5 animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#212738]">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              FFmpeg High-Resolution Master Exporter
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Configuration Controls */}
        {!exportedVideoUrl ? (
          <div className="flex flex-col gap-4">
            {/* Resolution & Format row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Resolution</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['720p', '1080p', '4K'] as const).map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setResolution(res)}
                      className={`py-1.5 text-xs font-mono font-bold rounded border transition-colors cursor-pointer ${
                        resolution === res
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'bg-[#141824] text-neutral-300 border-[#232938] hover:border-neutral-500'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Encoding Format</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['mp4', 'webm', 'gif'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`py-1.5 text-xs font-mono uppercase font-bold rounded border transition-colors cursor-pointer ${
                        format === fmt
                          ? 'bg-amber-400 text-black border-amber-400'
                          : 'bg-[#141824] text-neutral-300 border-[#232938] hover:border-neutral-500'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Platform Aspect Presets */}
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                Social Platform Aspect Preset
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-2.5 rounded border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    aspectRatio === '9:16'
                      ? 'bg-[#182030] border-amber-400 text-amber-300'
                      : 'bg-[#121622] border-[#222838] text-neutral-300 hover:border-neutral-500'
                  }`}
                >
                  <span className="font-bold">TikTok / Shorts</span>
                  <span className="text-[10px] text-neutral-400 font-mono">9:16 Vertical</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-2.5 rounded border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    aspectRatio === '16:9'
                      ? 'bg-[#182030] border-amber-400 text-amber-300'
                      : 'bg-[#121622] border-[#222838] text-neutral-300 hover:border-neutral-500'
                  }`}
                >
                  <span className="font-bold">YouTube / Film</span>
                  <span className="text-[10px] text-neutral-400 font-mono">16:9 Cinema</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('1:1')}
                  className={`p-2.5 rounded border flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                    aspectRatio === '1:1'
                      ? 'bg-[#182030] border-amber-400 text-amber-300'
                      : 'bg-[#121622] border-[#222838] text-neutral-300 hover:border-neutral-500'
                  }`}
                >
                  <span className="font-bold">Instagram Feed</span>
                  <span className="text-[10px] text-neutral-400 font-mono">1:1 Square</span>
                </button>
              </div>
            </div>

            {/* Options Checkboxes */}
            <div className="flex items-center gap-4 text-xs text-neutral-300 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeCaptions}
                  onChange={(e) => setIncludeCaptions(e.target.checked)}
                  className="accent-amber-400 rounded"
                />
                <span>Burn AI Auto-Captions onto Master Video</span>
              </label>
            </div>

            {/* Progress Bar if exporting */}
            {isExporting && (
              <div className="flex flex-col gap-1.5 bg-[#090C12] p-3 rounded border border-[#1E2434]">
                <div className="flex justify-between text-xs font-mono text-neutral-300">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Stitching {project.frames.length} frames via FFmpeg...
                  </span>
                  <span>{exportProgress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${exportProgress}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-200"
                  ></div>
                </div>
              </div>
            )}

            {/* Start Export Button */}
            <button
              onClick={handleStartExport}
              disabled={isExporting}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-amber-500/25 cursor-pointer disabled:opacity-50 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Render {resolution} Master Clip</span>
            </button>
          </div>
        ) : (
          /* Export Complete View */
          <div className="flex flex-col gap-4 animate-fade-in">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Master Video Rendered Successfully!</span>
            </div>

            {/* Video player preview */}
            <div className="bg-black rounded-lg overflow-hidden border border-[#232938] max-h-64 flex items-center justify-center">
              <video
                src={exportedVideoUrl}
                controls
                autoPlay
                loop
                className="w-full max-h-64 object-contain"
              />
            </div>

            {/* Social Share Presets */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-neutral-400">Direct Social Export</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleSocialShare('TikTok')}
                  className="px-3 py-2 bg-[#161B26] hover:bg-[#202738] border border-[#252C3D] text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TikTok</span>
                </button>
                <button
                  onClick={() => handleSocialShare('Instagram Reels')}
                  className="px-3 py-2 bg-[#161B26] hover:bg-[#202738] border border-[#252C3D] text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-pink-400" />
                  <span>Reels</span>
                </button>
                <button
                  onClick={() => handleSocialShare('YouTube')}
                  className="px-3 py-2 bg-[#161B26] hover:bg-[#202738] border border-[#252C3D] text-white rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-red-400" />
                  <span>YouTube</span>
                </button>
              </div>
              {shareSuccess && (
                <div className="text-xs text-emerald-400 font-mono text-center">
                  {shareSuccess}
                </div>
              )}
            </div>

            {/* Download Button */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setExportedVideoUrl(null)}
                className="px-4 py-2 bg-[#161B26] hover:bg-[#202738] text-neutral-300 text-xs font-medium rounded cursor-pointer"
              >
                Render Another Format
              </button>
              <a
                href={exportedVideoUrl}
                download={exportedFilename}
                className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <Download className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Download Master ({resolution})</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
