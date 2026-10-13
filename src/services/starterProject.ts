import { Project, CharacterAnchor, ScriptScene, Frame, CaptionItem, AudioTrackItem, CommentMarker, ArchivedEpisode } from '../types';

export const STARTER_CHARACTER_MAYA: CharacterAnchor = {
  id: 'char_maya_01',
  name: 'Maya',
  seriesId: 'The Clockwork Chronicles',
  archetype: 'Curious Artificer',
  signatureTraits: [
    'Hand-sculpted curly auburn clay hair with matte finish',
    'Chunky knitted crimson wool scarf with rib texture',
    'Forest green canvas explorer jacket with brass compass pin',
    'Delicate clay facial freckles and expressive glass armature eyes',
  ],
  colorPalette: ['#991B1B', '#1E3A8A', '#047857', '#F59E0B'],
  referenceImageUrl: '/src/assets/images/character_maya_anchor_1791884043253.jpg',
  gemmaEmbeddingVector: [0.89, -0.42, 0.76, 0.15, -0.63, 0.94, -0.18, 0.52, -0.81, 0.33, 0.67, -0.29, 0.44, -0.71, 0.88, 0.12],
  consistencyScore: 99.4,
  appearancesCount: 2,
  promptGuidance: 'Handcrafted stop-motion claymation character [Maya], auburn clay hair, crimson knitted wool scarf, brass compass pin, 12fps armature pose hold, warm theatrical studio lighting.',
  createdAt: Date.now() - 86400000 * 3,
};

// --- EPISODE 1: The Workshop Discovery ---
export function createEpisode1Frames(): Frame[] {
  const baseImg = '/src/assets/images/character_maya_anchor_1791884043253.jpg';
  const stageImg = '/src/assets/images/studio_stage_backdrop_1791884061400.jpg';

  const poses = [
    { label: 'Ep.1 F01: Maya opens the workshop door', duration: 2, note: 'Armature mark A', img: stageImg },
    { label: 'Ep.1 F02: Maya surveys cedar shavings on bench', duration: 2, note: 'Head turn 20 deg', img: baseImg },
    { label: 'Ep.1 F03: Maya brushes away cedar wood shavings', duration: 1, note: 'Hand armature shift', img: baseImg },
    { label: 'Ep.1 F04: Brass casing exposed beneath shavings', duration: 2, note: 'Glance downward', img: stageImg },
    { label: 'Ep.1 F05: Maya grasps the antique compass', duration: 2, note: 'Grip keyframe hold', img: baseImg },
    { label: 'Ep.1 F06: Compass glows with amber runes', duration: 2, note: 'Practical amber light', img: baseImg },
    { label: 'Ep.1 F07: Maya looks up in astonishment', duration: 3, note: 'Smile sculpt update', img: baseImg },
    { label: 'Ep.1 F08: Compass needle points toward tower', duration: 2, note: 'Episode 1 resolution', img: stageImg },
  ];

  return poses.map((p, idx) => ({
    id: `ep1_frame_${idx + 1}`,
    order: idx,
    dataUrl: p.img,
    durationFrames: p.duration,
    source: 'cosmos_ai' as const,
    characterAnchorId: STARTER_CHARACTER_MAYA.id,
    label: p.label,
    notes: p.note,
    onionSkinOpacity: 0.45,
  }));
}

export const EPISODE_1_CAPTIONS: CaptionItem[] = [
  {
    id: 'ep1_cap_01',
    startMs: 0,
    endMs: 2200,
    text: 'Maya stepped into the abandoned workshop.',
    speaker: 'Narrator',
    words: [
      { word: 'Maya', startMs: 0, endMs: 400 },
      { word: 'stepped', startMs: 400, endMs: 900 },
      { word: 'into', startMs: 900, endMs: 1200 },
      { word: 'the', startMs: 1200, endMs: 1400 },
      { word: 'workshop.', startMs: 1400, endMs: 2200 },
    ],
  },
  {
    id: 'ep1_cap_02',
    startMs: 2200,
    endMs: 4800,
    text: 'Beneath the cedar shavings, the brass compass awoke.',
    speaker: 'Narrator',
    words: [
      { word: 'Beneath', startMs: 2200, endMs: 2700 },
      { word: 'the', startMs: 2700, endMs: 2900 },
      { word: 'shavings,', startMs: 2900, endMs: 3400 },
      { word: 'the', startMs: 3400, endMs: 3600 },
      { word: 'compass', startMs: 3600, endMs: 4100 },
      { word: 'awoke.', startMs: 4100, endMs: 4800 },
    ],
  },
];

export function createEpisode1Project(): Project {
  return {
    id: 'proj_clockwork_ep1',
    name: 'The Workshop Discovery',
    seriesName: 'The Clockwork Chronicles',
    episodeNumber: 1,
    fps: 12,
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    frames: createEpisode1Frames(),
    captions: EPISODE_1_CAPTIONS,
    audioClips: [
      {
        id: 'ep1_audio_01',
        name: 'Workshop Footsteps & Wood Creaks',
        type: 'sfx',
        startFrame: 0,
        durationFrames: 16,
        volume: 0.8,
        color: '#06B6D4',
      },
    ],
    comments: [
      {
        id: 'comm_ep1_01',
        frameIndex: 4,
        timecode: '00:00:00:07',
        author: 'Elena R.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        role: 'Director',
        content: 'Maya origin frame locked into Gemma Embedding 2 anchor.',
        timestamp: 'Episode 1 Archive',
        resolved: true,
      },
    ],
    isEncrypted: true,
    encryptionSalt: 'cinecosmos_ep1_salt',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  };
}

// --- EPISODE 2: The Clockwork Artisan ---
export function createEpisode2Frames(): Frame[] {
  const baseImg = '/src/assets/images/character_maya_anchor_1791884043253.jpg';
  const stageImg = '/src/assets/images/studio_stage_backdrop_1791884061400.jpg';

  const poses = [
    { label: 'Ep.2 F01: Maya enters miniature set', duration: 2, note: 'Armature locked on mark A', img: stageImg },
    { label: 'Ep.2 F02: Head tilt left, eyes tracking bench', duration: 1, note: 'Clay neck micro-shift', img: baseImg },
    { label: 'Ep.2 F03: Right arm reaches toward needle', duration: 2, note: 'Keyframe hold', img: baseImg },
    { label: 'Ep.2 F04: Fingers grip antique casing', duration: 1, note: 'Thumbprint texture visible', img: stageImg },
    { label: 'Ep.2 F05: Maya raises glowing needle to eye', duration: 2, note: 'Secondary scarf bounce', img: baseImg },
    { label: 'Ep.2 F06: Warm smile in discovery', duration: 2, note: 'Facial sculpt update', img: baseImg },
    { label: 'Ep.2 F07: Subtle blink cycle frame', duration: 1, note: 'Glass eye pivot', img: baseImg },
    { label: 'Ep.2 F08: Maya turns toward camera', duration: 2, note: 'Armature pivot 15 deg', img: baseImg },
    { label: 'Ep.2 F09: Compass emits warm amber flare', duration: 2, note: 'In-camera practical light', img: stageImg },
    { label: 'Ep.2 F10: Maya steps onto timber floor', duration: 1, note: 'Foot tied down to peg', img: baseImg },
    { label: 'Ep.2 F11: Scarf flutter settling on shoulders', duration: 2, note: 'Wool wire adjust', img: baseImg },
    { label: 'Ep.2 F12: Hero resolve pose for Episode 3', duration: 3, note: 'Cosmos character anchor locked', img: baseImg },
  ];

  return poses.map((p, idx) => ({
    id: `ep2_frame_${idx + 1}`,
    order: idx,
    dataUrl: p.img,
    durationFrames: p.duration,
    source: idx % 4 === 0 ? 'video_embed' as const : 'cosmos_ai' as const,
    characterAnchorId: STARTER_CHARACTER_MAYA.id,
    label: p.label,
    notes: p.note,
    onionSkinOpacity: 0.45,
  }));
}

export const EPISODE_2_CAPTIONS: CaptionItem[] = [
  {
    id: 'ep2_cap_01',
    startMs: 0,
    endMs: 2200,
    text: 'Maya stepped into the quiet workshop.',
    speaker: 'Maya',
    words: [
      { word: 'Maya', startMs: 0, endMs: 400 },
      { word: 'stepped', startMs: 400, endMs: 900 },
      { word: 'into', startMs: 900, endMs: 1200 },
      { word: 'the', startMs: 1200, endMs: 1400 },
      { word: 'quiet', startMs: 1400, endMs: 1800 },
      { word: 'workshop.', startMs: 1800, endMs: 2200 },
    ],
  },
  {
    id: 'ep2_cap_02',
    startMs: 2200,
    endMs: 5000,
    text: 'The antique compass began to hum with amber light.',
    speaker: 'Maya',
    words: [
      { word: 'The', startMs: 2200, endMs: 2500 },
      { word: 'antique', startMs: 2500, endMs: 3100 },
      { word: 'compass', startMs: 3100, endMs: 3700 },
      { word: 'began', startMs: 3700, endMs: 4100 },
      { word: 'to', startMs: 4100, endMs: 4300 },
      { word: 'hum', startMs: 4300, endMs: 4700 },
      { word: 'with', startMs: 4700, endMs: 4850 },
      { word: 'light.', startMs: 4850, endMs: 5000 },
    ],
  },
];

export function createEpisode2Project(): Project {
  return {
    id: 'proj_clockwork_ep2',
    name: 'The Clockwork Artisan',
    seriesName: 'The Clockwork Chronicles',
    episodeNumber: 2,
    fps: 12,
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    frames: createEpisode2Frames(),
    captions: EPISODE_2_CAPTIONS,
    audioClips: [
      {
        id: 'ep2_audio_01',
        name: 'Timber Footsteps & Armature Click',
        type: 'sfx',
        startFrame: 0,
        durationFrames: 12,
        volume: 0.85,
        color: '#06B6D4',
      },
      {
        id: 'ep2_audio_02',
        name: 'Warm Accordion & Music Box Theme',
        type: 'music',
        startFrame: 4,
        durationFrames: 24,
        volume: 0.65,
        color: '#8B5CF6',
      },
    ],
    comments: [
      {
        id: 'comm_01',
        frameIndex: 2,
        timecode: '00:00:00:04',
        author: 'Elena R.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        role: 'Director',
        content: 'Love the arm reach here! Ensure the red scarf retains the same weave texture from Episode 1.',
        timestamp: '10 mins ago',
        resolved: false,
      },
      {
        id: 'comm_02',
        frameIndex: 8,
        timecode: '00:00:01:02',
        author: 'Marcus V.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        role: 'Colorist',
        content: 'Amber spotlight match verified. Gemma embedding consistency score is 99.4%.',
        timestamp: '25 mins ago',
        resolved: true,
      },
    ],
    isEncrypted: true,
    encryptionSalt: 'cinecosmos_salt_99824',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now(),
  };
}

// Archive of previously produced episodes
export const STARTER_EPISODES: ArchivedEpisode[] = [
  {
    id: 'ep_01_discovery',
    seriesId: 'The Clockwork Chronicles',
    episodeNumber: 1,
    title: 'Episode 1: The Workshop Discovery',
    synopsis: 'Maya uncovers the ancient artisan compass buried in cedar shavings of the abandoned clocktower workshop.',
    thumbnailUrl: '/src/assets/images/studio_stage_backdrop_1791884061400.jpg',
    durationSec: 3.5,
    completedAt: Date.now() - 86400000 * 2,
    characterNames: ['Maya'],
    frames: createEpisode1Frames().map((f) => ({
      ...f,
      isFlashback: true,
      flashbackEpisodeNumber: 1,
      label: `[Ep.1] ${f.label}`,
    })),
  },
  {
    id: 'ep_02_artisan',
    seriesId: 'The Clockwork Chronicles',
    episodeNumber: 2,
    title: 'Episode 2: The Clockwork Artisan',
    synopsis: 'Maya decodes the glowing amber coordinates on the compass and encounters the miniature clockwork automaton.',
    thumbnailUrl: '/src/assets/images/character_maya_anchor_1791884043253.jpg',
    durationSec: 4.8,
    completedAt: Date.now() - 86400000,
    characterNames: ['Maya'],
    frames: createEpisode2Frames().map((f) => ({
      ...f,
      isFlashback: true,
      flashbackEpisodeNumber: 2,
      label: `[Ep.2] ${f.label}`,
    })),
  },
];

// Helper to switch active projects
export function createStarterProject(): Project {
  return createEpisode2Project();
}

export function getPresetEpisode(episodeNumber: number): Project {
  if (episodeNumber === 1) return createEpisode1Project();
  return createEpisode2Project();
}
