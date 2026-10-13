import React from 'react';
import { 
  Film, 
  ShieldCheck, 
  ShieldAlert, 
  CloudCheck, 
  CloudOff, 
  Sparkles, 
  Video, 
  Share2,
  BookOpen
} from 'lucide-react';
import { Project } from '../types';

interface TopBarProps {
  project: Project;
  activeTab: 'characters' | 'script' | 'timeline' | 'archive' | 'feedback' | 'analytics';
  setActiveTab: (tab: 'characters' | 'script' | 'timeline' | 'archive' | 'feedback' | 'analytics') => void;
  onOpenExport: () => void;
  onOpenVideoEmbed: () => void;
  onOpenEncryption: () => void;
  onOpenDocs: () => void;
  isOnline: boolean;
  syncState: 'synced' | 'saving' | 'offline';
  isEncrypted: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  project,
  activeTab,
  setActiveTab,
  onOpenExport,
  onOpenVideoEmbed,
  onOpenEncryption,
  onOpenDocs,
  isOnline,
  syncState,
  isEncrypted,
}) => {
  return (
    <header className="h-14 border-b border-[#1F2430] bg-[#0B0E14] px-4 md:px-6 flex items-center justify-between gap-8 select-none z-30 shrink-0">
      {/* Zone 1: Brand title & Episode Wordmark */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-black text-sm shadow-sm shadow-amber-500/20">
          <Film className="w-4 h-4 text-black stroke-[2.5]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-white">
            CineCosmos
          </span>
          <span className="text-xs text-neutral-500 font-medium">/</span>
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
            Ep. {project.episodeNumber}
          </span>
          <span className="text-xs text-neutral-400 hidden sm:inline truncate max-w-[140px]">
            {project.name}
          </span>
        </div>
      </div>

      {/* Zone 2: Progressive 4-Step Story Creation Nav */}
      <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-neutral-400">
        <button
          onClick={() => setActiveTab('characters')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'characters'
              ? 'text-amber-400 font-bold'
              : 'hover:text-neutral-200'
          }`}
        >
          <span className="text-[10px] w-4 h-4 rounded-full bg-[#1C2232] flex items-center justify-center font-mono text-neutral-300">1</span>
          <span>Character Vault</span>
        </button>

        <span className="text-neutral-600">→</span>

        <button
          onClick={() => setActiveTab('script')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'script'
              ? 'text-amber-400 font-bold'
              : 'hover:text-neutral-200'
          }`}
        >
          <span className="text-[10px] w-4 h-4 rounded-full bg-[#1C2232] flex items-center justify-center font-mono text-neutral-300">2</span>
          <span>Script & Cosmos</span>
        </button>

        <span className="text-neutral-600">→</span>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'timeline'
              ? 'text-amber-400 font-bold'
              : 'hover:text-neutral-200'
          }`}
        >
          <span className="text-[10px] w-4 h-4 rounded-full bg-[#1C2232] flex items-center justify-center font-mono text-neutral-300">3</span>
          <span>OpenCut Studio</span>
        </button>

        <span className="text-neutral-600">→</span>

        <button
          onClick={() => setActiveTab('archive')}
          className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'archive'
              ? 'text-amber-400 font-bold'
              : 'hover:text-neutral-200'
          }`}
        >
          <span className="text-[10px] w-4 h-4 rounded-full bg-[#1C2232] flex items-center justify-center font-mono text-neutral-300">4</span>
          <span>Story Archive</span>
        </button>

        <div className="h-4 w-px bg-[#262C3D] mx-1"></div>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'feedback'
              ? 'text-amber-400 font-semibold'
              : 'hover:text-neutral-200'
          }`}
        >
          Review
          {project.comments.filter(c => !c.resolved).length > 0 && (
            <span className="ml-1 text-xs text-amber-300 font-mono">
              ({project.comments.filter(c => !c.resolved).length})
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'analytics'
              ? 'text-amber-400 font-semibold'
              : 'hover:text-neutral-200'
          }`}
        >
          Analytics
        </button>
      </nav>

      {/* Mobile nav buttons */}
      <div className="flex lg:hidden items-center gap-1">
        <button
          onClick={() => setActiveTab('characters')}
          className={`px-2 py-1 text-xs rounded font-medium ${activeTab === 'characters' ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-400'}`}
        >
          1.Vault
        </button>
        <button
          onClick={() => setActiveTab('script')}
          className={`px-2 py-1 text-xs rounded font-medium ${activeTab === 'script' ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-400'}`}
        >
          2.Script
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-2 py-1 text-xs rounded font-medium ${activeTab === 'timeline' ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-400'}`}
        >
          3.Studio
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`px-2 py-1 text-xs rounded font-medium ${activeTab === 'archive' ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-400'}`}
        >
          4.Story
        </button>
      </div>

      {/* Zone 3: Security & Primary Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* E2EE indicator button */}
        <button
          onClick={onOpenEncryption}
          title={isEncrypted ? 'E2EE AES-GCM 256-bit active' : 'Encryption vault locked'}
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono rounded bg-[#161B26] hover:bg-[#1E2433] text-neutral-300 border border-[#23293A] transition-colors"
        >
          {isEncrypted ? (
            <>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-emerald-400">E2EE Locked</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-amber-400">Vault Key</span>
            </>
          )}
        </button>

        {/* Cloud sync status */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
          {isOnline && syncState === 'synced' ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CloudCheck className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Synced</span>
            </span>
          ) : !isOnline || syncState === 'offline' ? (
            <span className="flex items-center gap-1 text-neutral-400">
              <CloudOff className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Offline Mode</span>
            </span>
          ) : (
            <span className="text-amber-400 animate-pulse">Syncing...</span>
          )}
        </div>

        {/* README / Docs Guide Button */}
        <button
          onClick={onOpenDocs}
          title="Open in-app README.md & Guide"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition-colors whitespace-nowrap cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">README.md</span>
        </button>

        {/* Video Embed Button */}
        <button
          onClick={onOpenVideoEmbed}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 bg-[#1A1F2C] hover:bg-[#242A3C] border border-[#2B3347] rounded-md transition-colors whitespace-nowrap cursor-pointer"
        >
          <Video className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">FFmpeg Embed</span>
        </button>

        {/* Primary CTA: Export Master */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-md shadow-sm shadow-amber-500/20 transition-all whitespace-nowrap cursor-pointer active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5 text-black stroke-[2.5]" />
          <span>Export Master</span>
        </button>
      </div>
    </header>
  );
};
