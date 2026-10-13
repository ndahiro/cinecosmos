import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Cpu, 
  Film, 
  Video, 
  ShieldCheck, 
  Keyboard, 
  Copy, 
  Check,
  Clapperboard,
  Download
} from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'cosmos' | 'ffmpeg' | 'shortcuts' | 'e2ee'>('overview');

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    const rawMarkdown = `# CineCosmos Studio — Stop-Motion & AI Character Animation
Architecture: NVIDIA Cosmos Physical Diffusion + Gemma Embedding 2 + FFmpeg Codecs + OpenCut Multi-Track Timeline.
Explore full guide in app.`;
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0E121A] border border-[#232938] rounded-xl max-w-3xl w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="h-14 px-6 border-b border-[#212738] flex items-center justify-between bg-[#121622] shrink-0">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                CineCosmos Studio Documentation & README
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                README.md
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1 px-2.5 py-1 bg-[#1A2030] hover:bg-[#252E44] text-neutral-300 rounded text-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 py-2 bg-[#0A0D14] border-b border-[#1E2434] overflow-x-auto text-xs font-medium shrink-0">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'overview'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Overview & Quick Start
          </button>
          <button
            onClick={() => setActiveSection('cosmos')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'cosmos'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Cosmos & Gemma 2 Engine
          </button>
          <button
            onClick={() => setActiveSection('ffmpeg')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'ffmpeg'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            FFmpeg Codecs & OpenCut
          </button>
          <button
            onClick={() => setActiveSection('shortcuts')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'shortcuts'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Keyboard Shortcuts
          </button>
          <button
            onClick={() => setActiveSection('e2ee')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeSection === 'e2ee'
                ? 'bg-amber-400 text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            E2EE Vault & Offline
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-neutral-300 text-xs md:text-sm leading-relaxed space-y-4">
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <div className="bg-[#121622] border border-[#212738] p-4 rounded-lg">
                <h4 className="text-base font-bold text-white mb-1">
                  What is CineCosmos Studio?
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  CineCosmos is a unified animation suite combining tactile physical stop-motion animation with AI character generation. Built on OpenCut's multi-track timeline conventions, creators can sequence physical camera bursts, embed external video with FFmpeg, and summon recurring characters across episodes with zero visual drift.
                </p>
              </div>

              <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                Quick Start Workflow
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#090C12] border border-[#1E2434] p-3 rounded">
                  <div className="font-bold text-white mb-1">1. Shoot or Sequence Frames</div>
                  <p className="text-neutral-400">
                    Use <strong>Live Cam</strong> with ghost onion skinning or click <strong>Add Photos</strong> to drop your burst captures.
                  </p>
                </div>
                <div className="bg-[#090C12] border border-[#1E2434] p-3 rounded">
                  <div className="font-bold text-white mb-1">2. Generate Cosmos Animation</div>
                  <p className="text-neutral-400">
                    Click <strong>Cosmos AI Gen</strong> to synthesize physical keyframe in-betweens anchored by Gemma Embedding 2 memory.
                  </p>
                </div>
                <div className="bg-[#090C12] border border-[#1E2434] p-3 rounded">
                  <div className="font-bold text-white mb-1">3. Script Episodic Recall</div>
                  <p className="text-neutral-400">
                    In <strong>Script & Flow</strong>, type scenes with character names like <code>Maya</code> to lock wardrobe and facial proportions.
                  </p>
                </div>
                <div className="bg-[#090C12] border border-[#1E2434] p-3 rounded">
                  <div className="font-bold text-white mb-1">4. Export High-Res Master</div>
                  <p className="text-neutral-400">
                    Click <strong>Export Master</strong> to package in 4K/1080p MP4/WebM with burned-in auto-captions and social presets.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'cosmos' && (
            <div className="space-y-4">
              <div className="bg-[#121622] border border-[#212738] p-4 rounded-lg flex items-start gap-3">
                <Cpu className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Cosmos Physical AI Diffusion + Gemma Embedding 2
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Standard AI video models suffer from character morphing and temporal jitter. CineCosmos solves this by pairing the <strong>NVIDIA Cosmos physical animation diffusion</strong> pipeline with <strong>Gemma Embedding 2</strong> vector anchors.
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="bg-[#090C12] border border-[#1E2434] p-3 rounded">
                  <span className="font-bold text-emerald-400">Character Anchor Vector:</span>
                  <p className="text-neutral-300 mt-1">
                    Extracts a 16-dimensional normalized embedding signature capturing armature balance, facial sculpt ratios, fabric knit textures, and production hex palettes.
                  </p>
                </div>
                <div className="bg-[#090C12] border border-[#1E2434] p-3 rounded">
                  <span className="font-bold text-cyan-400">Cosmos Armature Conditioning:</span>
                  <p className="text-neutral-300 mt-1">
                    Directs physics constraints (center of mass displacement, stop-motion joint friction, tactile thumbprint textures) to guarantee realistic physical movement.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'ffmpeg' && (
            <div className="space-y-4">
              <div className="bg-[#121622] border border-[#212738] p-4 rounded-lg flex items-start gap-3">
                <Film className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    FFmpeg Video Embedding & OpenCut Timeline Standards
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Import any live footage or video clip. FFmpeg decodes and slices the frames into stop-motion intervals (6, 8, 12, or 24 FPS) matching OpenCut's multi-track container architecture.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                <div className="bg-[#090C12] p-2.5 rounded border border-[#1E2434]">
                  <div className="text-amber-400 font-bold">Video Codecs</div>
                  <div className="text-neutral-400 mt-1">H.264 (AVC) / VP9</div>
                  <div className="text-[10px] text-neutral-500">Universal playback</div>
                </div>
                <div className="bg-[#090C12] p-2.5 rounded border border-[#1E2434]">
                  <div className="text-cyan-400 font-bold">Pixel Format</div>
                  <div className="text-neutral-400 mt-1">yuv420p</div>
                  <div className="text-[10px] text-neutral-500">Color calibrated</div>
                </div>
                <div className="bg-[#090C12] p-2.5 rounded border border-[#1E2434]">
                  <div className="text-purple-400 font-bold">Timebase</div>
                  <div className="text-neutral-400 mt-1">1/12 or 1/24</div>
                  <div className="text-[10px] text-neutral-500">Zero frame jitter</div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'shortcuts' && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Keyboard className="w-4 h-4 text-amber-400" />
                Pro NLE Keyboard Shortcuts
              </h4>
              <div className="border border-[#1E2434] rounded-lg overflow-hidden font-mono text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#121622] text-neutral-400 border-b border-[#1E2434]">
                    <tr>
                      <th className="p-2.5">Key</th>
                      <th className="p-2.5">Studio Action</th>
                      <th className="p-2.5">Mode</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#181E2C] bg-[#090C12]">
                    <tr>
                      <td className="p-2.5 text-amber-400 font-bold">Space</td>
                      <td className="p-2.5 text-neutral-200">Toggle Playback / Snap Live Frame</td>
                      <td className="p-2.5 text-neutral-500">Universal</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400 font-bold">← / →</td>
                      <td className="p-2.5 text-neutral-200">Step Backward / Forward 1 Frame</td>
                      <td className="p-2.5 text-neutral-500">Timeline</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400 font-bold">S</td>
                      <td className="p-2.5 text-neutral-200">Split Frame / Clip</td>
                      <td className="p-2.5 text-neutral-500">Timeline</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400 font-bold">D</td>
                      <td className="p-2.5 text-neutral-200">Duplicate Frame</td>
                      <td className="p-2.5 text-neutral-500">Timeline</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400 font-bold">Delete</td>
                      <td className="p-2.5 text-neutral-200">Ripple Delete Frame</td>
                      <td className="p-2.5 text-neutral-500">Timeline</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'e2ee' && (
            <div className="space-y-4">
              <div className="bg-[#121622] border border-[#212738] p-4 rounded-lg flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Client-Side End-to-End Encryption (AES-GCM 256-Bit)
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Zero-knowledge cryptographic security powered by the browser's <code>Web Crypto API</code>. Master project files, frames, and character anchors are encrypted with a 256-bit AES-GCM key derived via PBKDF2 (100,000 rounds) before being written to IndexedDB or synced to the cloud.
                  </p>
                </div>
              </div>

              <div className="bg-[#090C12] border border-[#1E2434] p-3 rounded text-xs">
                <span className="font-bold text-white">Offline Studio Mode:</span>
                <p className="text-neutral-400 mt-1">
                  IndexedDB maintains local caches of all frames, audio tracks, and scripts. Animators in remote shooting locations without internet can shoot, preview, onion-skin, and edit continuously with zero interruption.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
