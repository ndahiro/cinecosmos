import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  ChevronLeft, 
  ChevronRight, 
  Repeat, 
  Camera, 
  Layers, 
  Grid, 
  Maximize2, 
  SlidersHorizontal,
  CircleDot,
  Check,
  Eye,
  Sparkles
} from 'lucide-react';
import { Project, Frame, AspectRatio } from '../types';

interface MonitorProps {
  project: Project;
  currentFrameIndex: number;
  setCurrentFrameIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onCaptureNewFrame: (dataUrl: string) => void;
  onUpdateFrameDuration: (frameId: string, duration: number) => void;
  onUpdateAspectRatio: (ratio: AspectRatio) => void;
  onUpdateFps: (fps: number) => void;
}

export const Monitor: React.FC<MonitorProps> = ({
  project,
  currentFrameIndex,
  setCurrentFrameIndex,
  isPlaying,
  setIsPlaying,
  onCaptureNewFrame,
  onUpdateFrameDuration,
  onUpdateAspectRatio,
  onUpdateFps,
}) => {
  const [onionSkinEnabled, setOnionSkinEnabled] = useState(true);
  const [onionSkinOpacity, setOnionSkinOpacity] = useState(0.45);
  const [onionSkinFramesBack, setOnionSkinFramesBack] = useState(1);
  const [showGrid, setShowGrid] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const currentFrame: Frame | undefined = project.frames[currentFrameIndex];
  const previousFrame: Frame | undefined = 
    currentFrameIndex > 0 ? project.frames[currentFrameIndex - onionSkinFramesBack] : undefined;

  // Calculate SMPTE timecode (Hours:Minutes:Seconds:Frames)
  const formatTimecode = (frameIdx: number, fps: number) => {
    const totalFrames = frameIdx;
    const f = totalFrames % fps;
    const totalSeconds = Math.floor(totalFrames / fps);
    const s = totalSeconds % 60;
    const m = Math.floor(totalSeconds / 60) % 60;
    const h = Math.floor(totalSeconds / 3600);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
  };

  // Playback timer loop
  useEffect(() => {
    if (!isPlaying || project.frames.length === 0) return;

    const intervalMs = 1000 / project.fps;
    const timer = setInterval(() => {
      setCurrentFrameIndex((prev) => {
        if (prev >= project.frames.length - 1) {
          if (isLooping) return 0;
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, project.fps, project.frames.length, isLooping, setCurrentFrameIndex, setIsPlaying]);

  // Handle camera start/stop
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
      setCameraError(null);
    } else {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } catch (err: any) {
        console.error('Camera access error:', err);
        setCameraError('Camera access unavailable. Using virtual studio mode.');
      }
    }
  };

  // Snap photo from camera
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onCaptureNewFrame(dataUrl);
    }
  };

  // Keyboard transport shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isCameraActive) {
          captureSnapshot();
        } else {
          setIsPlaying(!isPlaying);
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1));
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setCurrentFrameIndex(Math.min(project.frames.length - 1, currentFrameIndex + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isCameraActive, currentFrameIndex, project.frames.length, setIsPlaying, setCurrentFrameIndex]);

  // Aspect ratio class container
  const getAspectStyle = () => {
    switch (project.aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[500px]';
      case '1:1':
        return 'aspect-square max-h-[500px]';
      case '4:3':
        return 'aspect-[4/3] max-h-[500px]';
      case '16:9':
      default:
        return 'aspect-video max-h-[500px]';
    }
  };

  return (
    <div className="flex flex-col bg-[#0F131C] border border-[#1F2430] rounded-lg overflow-hidden shadow-xl">
      {/* Monitor Header Toolbar */}
      <div className="h-10 bg-[#141824] px-4 flex items-center justify-between border-b border-[#1F2430] text-xs">
        {/* Left: Aspect Ratio & Framing */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium">Aspect:</span>
          {(['16:9', '9:16', '1:1', '4:3'] as AspectRatio[]).map((ratio) => (
            <button
              key={ratio}
              onClick={() => onUpdateAspectRatio(ratio)}
              className={`px-2 py-0.5 rounded font-mono transition-colors cursor-pointer ${
                project.aspectRatio === ratio
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        {/* Center: SMPTE Timecode display */}
        <div className="flex items-center gap-2 font-mono tabular-nums bg-[#0A0D14] px-3 py-1 rounded border border-[#1E2332]">
          <span className="text-amber-400 font-bold tracking-wider">
            {formatTimecode(currentFrameIndex, project.fps)}
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400">
            F: <strong className="text-white">{currentFrameIndex + 1}</strong> / {project.frames.length}
          </span>
        </div>

        {/* Right: Viewport Overlays */}
        <div className="flex items-center gap-2">
          {/* Onion skin toggle */}
          <button
            onClick={() => setOnionSkinEnabled(!onionSkinEnabled)}
            title="Toggle Onion Skinning Ghost"
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors cursor-pointer ${
              onionSkinEnabled
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Onion Skin</span>
          </button>

          {/* Grid lines toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Rule-of-Thirds Grid"
            className={`p-1 rounded transition-colors cursor-pointer ${
              showGrid ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          {/* Camera Capture Mode */}
          <button
            onClick={toggleCamera}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded transition-colors font-medium cursor-pointer ${
              isCameraActive
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-[#1E2435] text-neutral-300 hover:bg-[#283147]'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>{isCameraActive ? 'Stop Cam' : 'Live Cam'}</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Stage */}
      <div className="relative flex-1 bg-[#07090E] min-h-[340px] flex items-center justify-center p-3 overflow-hidden">
        <div className={`relative ${getAspectStyle()} w-full max-w-4xl bg-black rounded shadow-2xl overflow-hidden flex items-center justify-center border border-[#1C2130]`}>
          
          {/* Live camera stream if active */}
          {isCameraActive ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Onion skin ghost over live camera stream */}
              {onionSkinEnabled && currentFrame && (
                <img
                  src={currentFrame.dataUrl}
                  alt="Onion skin reference"
                  style={{ opacity: onionSkinOpacity }}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none mix-blend-screen filter hue-rotate-15"
                />
              )}
              {/* Live record crosshair */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur text-xs font-mono text-red-400 border border-red-500/30">
                <CircleDot className="w-3.5 h-3.5 animate-ping text-red-500" />
                <span>LIVE STOP-MOTION FEED</span>
              </div>
            </div>
          ) : currentFrame ? (
            /* Recorded Stop-Motion Frame Mode */
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Previous frame onion skin overlay */}
              {onionSkinEnabled && previousFrame && !isPlaying && (
                <img
                  src={previousFrame.dataUrl}
                  alt="Onion skin previous frame"
                  style={{ opacity: onionSkinOpacity }}
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none filter sepia contrast-125 mix-blend-lighten"
                />
              )}

              {/* Active Current Frame */}
              <img
                src={currentFrame.dataUrl}
                alt={currentFrame.label || `Frame ${currentFrameIndex + 1}`}
                className="w-full h-full object-cover select-none"
              />

              {/* Active Captions Overlay if present */}
              {project.captions.length > 0 && (() => {
                const totalElapsedMs = (currentFrameIndex / project.fps) * 1000;
                const activeCap = project.captions.find(
                  c => totalElapsedMs >= c.startMs && totalElapsedMs <= c.endMs
                );
                if (!activeCap) return null;
                return (
                  <div className="absolute bottom-6 inset-x-4 flex justify-center pointer-events-none">
                    <div className="bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-md border border-white/10 text-white font-medium text-sm md:text-base text-center shadow-lg animate-fade-in max-w-xl">
                      {activeCap.text}
                    </div>
                  </div>
                );
              })()}

              {/* Frame Hold & Character Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[11px] font-mono text-neutral-300 border border-white/10">
                  Hold: {currentFrame.durationFrames}f ({((currentFrame.durationFrames / project.fps) * 1000).toFixed(0)}ms)
                </span>
                {currentFrame.characterAnchorId && (
                  <span className="bg-amber-500/20 backdrop-blur px-2 py-0.5 rounded text-[11px] font-mono text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Maya Anchor
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center p-6 text-neutral-500">
              <Camera className="w-10 h-10 mx-auto mb-2 text-neutral-600" />
              <p className="text-sm font-medium">No frames in sequence yet</p>
              <p className="text-xs text-neutral-600 mt-1">Upload images, embed video, or activate camera</p>
            </div>
          )}

          {/* Rule of Thirds Grid Overlay */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/10">
              <div className="border-r border-b border-white/20"></div>
              <div className="border-r border-b border-white/20"></div>
              <div className="border-b border-white/20"></div>
              <div className="border-r border-b border-white/20"></div>
              <div className="border-r border-b border-white/20"></div>
              <div className="border-b border-white/20"></div>
              <div className="border-r border-white/20"></div>
              <div className="border-r border-white/20"></div>
              <div></div>
            </div>
          )}
        </div>
      </div>

      {/* Monitor Controls & Playback Bar */}
      <div className="h-14 bg-[#111622] px-4 flex items-center justify-between border-t border-[#1F2430]">
        {/* Left: Onion Skin Opacity Slider */}
        <div className="flex items-center gap-2 text-xs">
          {onionSkinEnabled && (
            <div className="flex items-center gap-2 bg-[#0A0D14] px-2.5 py-1 rounded border border-[#1D2230]">
              <span className="text-neutral-400 font-medium">Ghost Opacity:</span>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={onionSkinOpacity}
                onChange={(e) => setOnionSkinOpacity(parseFloat(e.target.value))}
                className="w-16 accent-cyan-400 cursor-pointer"
              />
              <span className="text-cyan-400 font-mono tabular-nums w-8">
                {Math.round(onionSkinOpacity * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Center: Playback Transport Buttons */}
        <div className="flex items-center gap-1">
          {/* Jump to start */}
          <button
            onClick={() => setCurrentFrameIndex(0)}
            title="First frame"
            className="p-1.5 rounded hover:bg-[#1E2538] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Step backward 1 frame */}
          <button
            onClick={() => setCurrentFrameIndex(Math.max(0, currentFrameIndex - 1))}
            title="Step backward (←)"
            className="p-1.5 rounded hover:bg-[#1E2538] text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Primary Play/Pause or Snapshot button */}
          {isCameraActive ? (
            <button
              onClick={captureSnapshot}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-md shadow-lg shadow-red-600/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <CircleDot className="w-4 h-4 text-white" />
              <span>SNAP FRAME (Space)</span>
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title="Play/Pause (Space)"
              className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition-all shadow-md shadow-amber-500/25 active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-black stroke-none" />
              ) : (
                <Play className="w-5 h-5 fill-black stroke-none ml-0.5" />
              )}
            </button>
          )}

          {/* Step forward 1 frame */}
          <button
            onClick={() => setCurrentFrameIndex(Math.min(project.frames.length - 1, currentFrameIndex + 1))}
            title="Step forward (→)"
            className="p-1.5 rounded hover:bg-[#1E2538] text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Jump to end */}
          <button
            onClick={() => setCurrentFrameIndex(project.frames.length - 1)}
            title="Last frame"
            className="p-1.5 rounded hover:bg-[#1E2538] text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Loop toggle */}
          <button
            onClick={() => setIsLooping(!isLooping)}
            title="Loop playback"
            className={`p-1.5 rounded transition-colors ml-2 cursor-pointer ${
              isLooping ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        {/* Right: FPS Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400 font-medium">FPS:</span>
          <select
            value={project.fps}
            onChange={(e) => onUpdateFps(parseInt(e.target.value))}
            className="bg-[#0A0D14] border border-[#1D2230] text-amber-400 font-mono font-bold px-2 py-1 rounded cursor-pointer outline-none focus:border-amber-500"
          >
            <option value="6">6 fps (Rough)</option>
            <option value="8">8 fps (Retro clay)</option>
            <option value="12">12 fps (Classic twos)</option>
            <option value="24">24 fps (Cinema)</option>
            <option value="30">30 fps (Web video)</option>
            <option value="60">60 fps (Ultra)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
