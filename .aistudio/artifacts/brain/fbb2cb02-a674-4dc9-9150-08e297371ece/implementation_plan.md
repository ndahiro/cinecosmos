# CineCosmos — Pro Stop-Motion & AI Character Animation Studio (with FFmpeg & Episodic Flow)

A high-performance stop-motion animation and AI keyframe studio inspired by OpenCut's multi-track timeline architecture. Creators can capture or sequence physical photos with real-time onion skinning, embed video clips and transcode with FFmpeg, summon named characters across multi-episode scripts using Google Flow-style prompt scripts, generate character-consistent keyframes using Cosmos model anchors with Gemma Embedding 2 similarity matching, edit multi-track audio and captions, collaborate with real-time frame comments, and export high-resolution master clips with client-side end-to-end encryption.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following product and design decisions incorporate your feedback on FFmpeg integration and episodic character flow:

- **FFmpeg Video Embedding & Transcoding**: Integrated FFmpeg pipeline (WebAssembly client-side + server export fallback) enabling creators to embed external video footage, extract stop-motion keyframes, mux audio/captions, and stitch frames into broadcast-ready high-resolution MP4/WebM master files.
- **Episodic Character Recall (Google Flow Style)**: Named character registry with persistent Gemma Embedding 2 anchors. When typing a script block (e.g., `Scene 2: [Maya] enters the clay forest and finds the glowing crystal`), CineCosmos recognizes the character name token, retrieves Maya's master embedding anchor, and maintains 100% facial, costume, and silhouette continuity across sequential episodes.
- **Timeline Workflow**: OpenCut-style multi-track timeline with frame-by-frame onion skinning, live playback loop, customizable frame rate (1 to 60 FPS), clip trimming, and split tools.
- **Visual Aesthetic**: Dark creative studio palette utilizing obsidian darks (`#0B0D13`), deep slate panels (`#131722`), amber action accents (`#F59E0B`), and precision monospace timecode overlays.
- **Security & Privacy**: Client-side End-to-End Encryption (E2EE) powered by the Web Crypto API (AES-GCM 256-bit key derivation) ensuring frames and project metadata never leave the device unencrypted.

---

## 1. Overview & Core Concept

### What It Does
CineCosmos is a comprehensive creator suite bridging physical stop-motion animation, video embedding, and generative AI video workflows. Users can:
1. Capture frames directly via connected camera/webcam or upload photo bursts, applying adjustable onion-skinning overlays (previous and next frames with opacity and color shift) and frame holds.
2. Embed existing video footage using FFmpeg, extract reference stills, and merge live-action clips with stop-motion animation.
3. Write script scenes in a Google Flow-style screenplay editor: referencing named characters (e.g., `@CharacterName`) automatically loads their Gemma Embedding 2 visual profile to generate consistent keyframes for subsequent episodes.
4. Edit animations on an OpenCut-style multi-track timeline (Video/Frames, Character Overlays, Audio/SFX, Caption Track) with frame trimming, ripple editing, and timecode scrubbing.
5. Add AI-powered auto-captions synchronized to audio cues and voiceover with custom typography styles.
6. Review clips collaboratively with frame-accurate team annotations and approvals.
7. Export in 4K, 1080p, and platform-tailored aspect ratios (9:16 Reels/TikTok, 16:9 Cinema, 1:1 Square) using FFmpeg with social metadata, offline caching, and zero-knowledge E2EE security.

### Target Audience & Persona
- **Indie Animators & Claymation Artists**: Demanding precise onion-skinning, frame hold control, and smooth frame rate playback.
- **Episodic Series Creators & Storytellers**: Crafting recurring web series where character consistency across episodes is paramount.
- **Creative Teams & Studios**: Needing frame-level collaborative review, offline field capture, and enterprise-grade end-to-end encryption.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Zero-State & Project Workspace**:
   - Creator selects or creates a multi-episode series workspace.
   - Sets up or unlocks the 256-bit AES-GCM encryption vault.
   - Character Vault displays registered series characters with their embedding continuity vectors.

2. **Google Flow Scripting & Character Recall**:
   - Creator opens the Script & Storyboard drawer.
   - Writes episodic scripts with character callouts (e.g., `Scene 1: Maya adjusts her red scarf and smiles at the camera`).
   - CineCosmos matches the named character, displays their continuity score, and triggers Cosmos frame generation with Gemma Embedding 2 conditioning.

3. **FFmpeg Video Embedding & Frame Ingestion**:
   - Drag-and-drop external video clips or photo sequences.
   - FFmpeg transcodes and slices video clips into individual stop-motion frames or video tracks.
   - Onion skinning displays ghost overlays of adjacent frames (with cyan/amber shift and 0–100% opacity slider).

4. **OpenCut Multi-Track Editing & Auto-Captioning**:
   - Dedicated tracks: Video/Frames, Character Layer, Audio/SFX, and Captions.
   - Interactive tools: Split (`S`), Duplicate (`D`), Hold Frame, Ripple Delete, Scrubber, and FPS selector (1–60 FPS).
   - One-click AI Auto-Captioning generates synchronized subtitles with customizable styling.

5. **Collaboration & Team Feedback**:
   - Review panel with timecode markers, frame annotations, team member avatars, and status badges (Pending, Approved, In Revision).

6. **FFmpeg High-Res Master Export & Social Presets**:
   - FFmpeg-driven rendering pipeline exporting 4K/1080p MP4, WebM, or animated GIF.
   - Formats optimized for YouTube (16:9), TikTok/Reels/Shorts (9:16), and Instagram (1:1).
   - Advanced analytics tab evaluating frame pacing, character consistency score, and engagement potential.

### Visual Identity & Theme
- **Canvas Base**: Obsidian charcoal (`#090B10`) and workbench slate (`#11151E`) with hairline borders (`#1F2430`).
- **Accent Tones**: Radiant Amber (`#F59E0B`) for playback action, timeline scrubber, and active keyframe selection; Cyan (`#06B6D4`) for audio tracks; Emerald (`#10B981`) for Gemma consistency anchors.
- **Typography**: Clean display sans (`Plus Jakarta Sans` / `Outfit`) for studio headers and toolbars; tabular monospace (`JetBrains Mono` / `tabular-nums`) for timecode, frame numbers, SMPTE counters, and latency figures.
- **Discipline**: Zero unboxed pill badges, clean typographic breadcrumbs, unified single-level elevation, and responsive desktop/mobile touch layout.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: FFmpeg Video Embedding & Transcoding Architecture
- **Chosen Approach**: Hybrid FFmpeg pipeline — client-side WebAssembly video demuxing/stitching with server-side FFmpeg/canvas fallback.
- **Why**: Allows users to import external video files directly into stop-motion tracks, extract frame-by-frame image sequences, and export high-resolution master videos without third-party cloud rendering bottlenecks.

### Decision 2: Google Flow Episodic Character Consistency Engine
- **Chosen Approach**: Persistent Character Anchor Vault using `@google/genai` with structured Gemma Embedding 2 semantic features and visual descriptors. When a character name is called in the script editor, the engine automatically injects the character's anchor prompts, reference embeddings, and visual constraints.
- **Why**: Eliminates character drift across different episodes, allowing episodic storytellers to build long-running series with recognizable characters.

### Decision 3: E2EE Security & Offline Mode
- **Chosen Approach**: Web Crypto API (SubtleCrypto `PBKDF2` + `AES-GCM-256`) encrypts project databases and frame blobs prior to storage. IndexedDB stores frames locally with a background sync queue that handles offline/online state transitions seamlessly.
- **Why**: Guarantees sensitive production assets remain confidential even in cloud sync setups, while ensuring field animators can shoot without Wi-Fi.

---

## 4. Technical Architecture & Data Strategy

### System Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CineCosmos Studio Client                            │
├─────────────────┬───────────────────────────────────┬───────────────────────┤
│ Asset & Script  │        Main Viewport & Monitor    │   Inspector & Tools   │
│ - Character Reg │  - Live Frame & Onion Skin        │  - Cosmos Anchor Gen  │
│ - Google Flow   │  - SMPTE Timecode Counter         │  - Auto-Caption Styl  │
│   Script Editor │  - Grid & Safe Zone Masks         │  - Team Collab Panel  │
├─────────────────┴───────────────────────────────────┴───────────────────────┤
│                     OpenCut Multi-Track Timeline Editor                     │
│  [Video Track]     : [Frame 01][Frame 02][Frame 03] ... [Split][Hold]       │
│  [Character Layer] : [Named Character Keyframe Anchor ──]                   │
│  [Audio & Foley]   : [─── Audio Track Waveform ────]                        │
│  [Captions Track]  : [Word 01] [Word 02] [Word 03]                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Client Services Engine                                                     │
│  ┌───────────────────────┐ ┌───────────────────────┐ ┌────────────────────┐ │
│  │ FFmpeg Video Transcode│ │ IndexedDB Offline     │ │ Web Crypto AES-GCM │ │
│  │ & Frame Extractor     │ │ Cache & Sync Queue    │ │ End-to-End Vault   │ │
│  └───────────────────────┘ └───────────────────────┘ └────────────────────┘ │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ /api/gemini & sync proxy
┌──────────────────────────────────────▼──────────────────────────────────────┐
│                    Express Backend & AI Service Layer                       │
│  - /api/gemini/character-anchor  : Cosmos & Gemma Embedding 2 consistency   │
│  - /api/gemini/script-flow       : Google Flow episodic character recall    │
│  - /api/gemini/auto-captions     : Audio & scene auto-caption generator     │
│  - /api/ffmpeg/render            : High-res server render & video embedding │
│  - /api/sync/projects            : Encrypted payload cloud sync & team pins │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Data Models
- **Project**: `id`, `name`, `episodeNumber`, `seriesId`, `fps` (1-60), `aspectRatio` ('16:9' | '9:16' | '1:1' | '4:3'), `tracks`, `createdAt`, `updatedAt`, `isEncrypted`.
- **CharacterAnchor**: `id`, `name`, `description`, `signatureTraits`, `referenceImageUrl`, `gemmaEmbeddingVector`, `seriesId`, `appearancesCount`.
- **ScriptScene**: `id`, `sceneNumber`, `characterNames`, `actionPrompt`, `dialogue`, `generatedKeyframeIds`.
- **Frame**: `id`, `trackId`, `order`, `dataUrl`, `thumbnailUrl`, `durationFrames`, `characterAnchorId`, `source` ('camera' | 'video_embed' | 'cosmos_ai').
- **CaptionTrack**: `id`, `startTimeMs`, `endTimeMs`, `text`, `words`.
- **CollaborationComment**: `id`, `author`, `avatar`, `frameIndex`, `timecode`, `content`, `resolved`, `timestamp`.
- **StudioAnalytics**: `totalFramesRendered`, `averageFPS`, `renderTimeMs`, `projectPacingScore`, `characterConsistencyScore`.

---

## 5. Implementation Phases (Post-Approval)

1. **Backend & AI Proxy Setup**: Implement Express proxy endpoints in `server.ts` for Gemini character analysis, Gemma embedding consistency evaluation, Google Flow episodic script recall, and auto-caption transcription.
2. **FFmpeg & Video Ingestion Engine**: Build video embedding pipeline capable of extracting video frames into stop-motion tracks and stitching frames back into high-resolution MP4/WebM.
3. **Core Timeline & Canvas Engine**: Build OpenCut-style multi-track timeline with zoomable scrubber, frame holds, drag-and-drop reordering, and canvas-based onion skinning.
4. **Episodic Character Registry & Google Flow Scripting**: Implement named character registry that recalls identical characters across episodes from script prompts.
5. **Offline Cache & Web Crypto E2EE Vault**: Implement local IndexedDB repository, offline detection badge, and AES-GCM encryption toggle.
6. **Team Collaboration & Analytics**: Build frame-level comment threads, mock real-time presence, and performance analytics dashboard.
7. **High-Res Master Exporter & Social Presets**: High-resolution exporter supporting 4K/1080p MP4/WebM/GIF packaging and social presets.
