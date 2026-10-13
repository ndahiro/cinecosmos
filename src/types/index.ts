export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:3';

export interface Frame {
  id: string;
  order: number;
  dataUrl: string;
  thumbnailUrl?: string;
  durationFrames: number; // 1 = 1 frame hold, 2 = hold for 2 frames
  source: 'camera' | 'upload' | 'video_embed' | 'cosmos_ai';
  characterAnchorId?: string;
  label?: string;
  notes?: string;
  onionSkinOpacity?: number;
  isFlashback?: boolean;
  flashbackEpisodeNumber?: number;
}

export interface ArchivedEpisode {
  id: string;
  seriesId: string;
  episodeNumber: number;
  title: string;
  synopsis: string;
  thumbnailUrl: string;
  frames: Frame[];
  durationSec: number;
  completedAt: number;
  characterNames: string[];
}

export interface CharacterAnchor {
  id: string;
  name: string;
  seriesId: string;
  archetype: string;
  signatureTraits: string[];
  colorPalette: string[];
  referenceImageUrl: string;
  gemmaEmbeddingVector: number[]; // high-dimensional semantic feature representation
  consistencyScore: number; // e.g. 98.4%
  appearancesCount: number;
  promptGuidance: string;
  createdAt: number;
}

export interface ScriptScene {
  id: string;
  episodeNumber: number;
  sceneNumber: number;
  characterNames: string[];
  actionPrompt: string;
  dialogue?: string;
  suggestedDurationSec: number;
  generatedKeyframeIds: string[];
  consistencyVerification: {
    characterName: string;
    verified: boolean;
    similarityScore: number;
  }[];
}

export interface CaptionWord {
  word: string;
  startMs: number;
  endMs: number;
}

export interface CaptionItem {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
  speaker?: string;
  words?: CaptionWord[];
}

export interface AudioTrackItem {
  id: string;
  name: string;
  type: 'music' | 'sfx' | 'voiceover';
  startFrame: number;
  durationFrames: number;
  volume: number; // 0.0 to 1.0
  color: string;
}

export interface CommentMarker {
  id: string;
  frameIndex: number;
  timecode: string;
  author: string;
  avatar: string;
  role: 'Director' | 'Animator' | 'Colorist' | 'Reviewer';
  content: string;
  timestamp: string;
  resolved: boolean;
}

export interface Project {
  id: string;
  name: string;
  seriesName: string;
  episodeNumber: number;
  fps: number; // 6, 8, 12, 24, 30, 60
  aspectRatio: AspectRatio;
  width: number;
  height: number;
  frames: Frame[];
  captions: CaptionItem[];
  audioClips: AudioTrackItem[];
  comments: CommentMarker[];
  isEncrypted: boolean;
  encryptionSalt?: string;
  createdAt: number;
  updatedAt: number;
}

export interface StudioAnalytics {
  totalFrames: number;
  durationSec: number;
  averagePacingScore: number; // 0 - 100
  characterConsistencyIndex: number; // 0 - 100
  exportRenderLatencyMs: number;
  storageEncryptedKb: number;
  cloudSyncStatus: 'synced' | 'pending' | 'offline';
}

export interface ExportSettings {
  format: 'mp4' | 'webm' | 'gif';
  resolution: '4K' | '1080p' | '720p';
  aspectRatio: AspectRatio;
  fps: number;
  includeCaptions: boolean;
  includeAudio: boolean;
  socialPreset?: 'tiktok' | 'youtube' | 'instagram' | 'custom';
}
