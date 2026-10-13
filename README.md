# CineCosmos Studio — Stop-Motion & AI Character Animation

> **A professional stop-motion and AI keyframe animation suite** inspired by OpenCut's multi-track timeline architecture. Built with Cosmos physical diffusion conditioning, Gemma Embedding 2 cross-episode character memory, FFmpeg video embedding, and client-side AES-GCM end-to-end encryption.

---

## 🎬 Core Features & Capabilities

### 1. OpenCut Multi-Track Timeline Editor
- **Multi-Track Compositor**: Separate tracks for Stop-Motion Video Frames, Cosmos Character Anchors, Audio & Foley Waveforms, and AI Auto-Captions.
- **NLE Editing Controls**: Split clips (`S`), Duplicate frames (`D`), Ripple Delete (`Del`), reverse frame playback, and adjustable frame hold durations.
- **Zoomable Ruler & Scrubber**: Scrub through sequences frame-by-frame with magnetic snapping and SMPTE timecode accuracy (`00:00:00:00`).

### 2. Live Camera Capture & Onion Skinning
- **Real-Time Camera Capture**: Connect any USB webcam or capture card to shoot physical claymation or paper cutout frames.
- **Precision Onion Skinning**: Overlay previous and next frames with adjustable ghost opacity (0% to 90%) and contrast tinting to precisely position armatures.
- **Framing & Safe Margins**: Rule-of-thirds grid lines and aspect ratio masking (16:9 Cinema, 9:16 Shorts/TikTok, 1:1 Square, 4:3 Vintage).

### 3. Cosmos AI Model Animation Generation
- **Physical AI Diffusion**: Uses the NVIDIA Cosmos model architecture to synthesize natural armature dynamics, physical balance, and material textures.
- **In-Between Synthesizer**: Generate 4 to 18 sequential stop-motion keyframes from natural language action prompts (e.g., *"Character lifts glowing compass and turns toward camera"*).
- **One-Click Timeline Ingestion**: Drop newly generated Cosmos frames directly into the OpenCut timeline tracks.

### 4. Gemma Embedding 2 Character Consistency Memory
- **Character Anchor Sheets**: Lock character signatures (armature geometry, wardrobe texture, palette, hair sculpt).
- **Normalized 16-D Semantic Vectors**: Computes high-dimensional feature vectors via `gemini-embedding-2-preview`.
- **99%+ Cosine Stability**: Compares each shot and subsequent episode to the character's master vector, eliminating character drift across series episodes.

### 5. Google Flow Episodic Screenplay Scripting
- **Screenplay Recall**: Type natural scene blocks mentioning character names (e.g., `Maya`).
- **Episodic Continuity Checks**: Automatically loads previous episode anchors and confirms that wardrobe and facial features match the registered model before rendering.

### 6. FFmpeg Video Embedding & Frame Slicer
- **Video Slicing**: Drag and drop external MP4/WebM videos to slice them into frame sequences at exact stop-motion intervals (6, 8, 12, or 24 FPS).
- **Broadcast Codec Packaging**: Exports 4K Ultra HD, 1080p, and 720p master clips with standard timebases (`yuv420p` H.264 / VP9) for seamless editing in Premiere, DaVinci Resolve, or OpenCut.
- **Direct Social Presets**: Pre-configured exports for TikTok (9:16), YouTube (16:9), and Instagram Reels/Feed.

### 7. End-to-End Encryption (E2EE Vault) & Offline Mode
- **Client-Side AES-GCM 256-Bit**: PBKDF2 key derivation from user master passphrase. All frame arrays and scripts are encrypted before storage.
- **IndexedDB Offline Engine**: Shoot and edit in the field with zero internet connection; automatically syncs when connectivity resumes.
- **Encrypted Backup Export/Import**: Download zero-knowledge encrypted `.json` archives of your entire production.

### 8. Collaborative Review & AI Auto-Captioning
- **SMPTE Timecode Annotations**: Pin frame-accurate comments and revision tasks for directors, animators, and colorists.
- **Synchronized Auto-Captions**: Generate accessible word-timed subtitles with custom animated text overlays.

---

## ⌨️ Studio Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Space` | Toggle Playback / Snap Live Camera Frame |
| `←` / `→` | Step Backward / Forward by 1 Frame |
| `S` | Split active clip / frame |
| `D` | Duplicate active frame |
| `Delete` / `Backspace` | Delete active frame from sequence |

---

## 🚀 The 4-Step Story Creation Flow

```
┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐    ┌─────────────────────────┐
│ Step 1: Character Vault │ ──>│  Step 2: Script & Flow  │ ──>│ Step 3: OpenCut Studio  │ ──>│  Step 4: Story Archive  │
│ - Create named anchors  │    │ - Mention characters    │    │ - Multi-track editing   │    │ - Save coherent story   │
│ - Gemma 2 vector lock   │    │ - Generate Cosmos anim  │    │ - Insert Ep. Flashbacks │    │ - High-res master export│
└─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘    └─────────────────────────┘
```

1. **Step 1: Create Character Vault (Initial Screen)**
   - When you open the studio, you immediately enter the **Character Vault**.
   - Create or view characters like **Maya**: define traits, wardrobe, and locked palette.
   - The engine computes a **Gemma Embedding 2** signature ensuring zero identity drift.
   - Click **"Proceed to Step 2: Script & Flow →"**.

2. **Step 2: Write Script Calling Characters by Name**
   - Write screenplay scenes referencing named characters (e.g. `Maya reaches for the antique compass`).
   - The Google Flow engine verifies character continuity against the stored Gemma 2 vectors.
   - Click **"Cosmos AI Gen"** or **"Step 3: OpenCut Studio →"** to synthesize physical keyframe in-betweens.

3. **Step 3: Edit in OpenCut Way with Prior Episode Flashbacks**
   - Edit on the multi-track timeline (Video, Character Anchor, Foley, Captions).
   - Use NLE tools: Split (`S`), Duplicate (`D`), Ripple Delete (`Del`), Onion Skin ghosting.
   - Click **"Episode Flashbacks"** to recall scenes and keyframes from Episode 1 (e.g. Maya first discovering the compass) and insert them as memory flashbacks with matching continuity.

4. **Step 4: Save Episode & Share Coherent Story Arc**
   - Head to the **Story Archive**: see the sequential episode cards (Episode 1 -> Episode 2 -> Episode 3).
   - Click **"Save Current Episode"** to cement the story arc.
   - Click **"Export & Share Master"** for high-resolution FFmpeg rendering (4K/1080p MP4/WebM) with social presets (TikTok 9:16, YouTube 16:9, Instagram 1:1).

---

*CineCosmos Studio — Developed with Google AI Studio & OpenCut Engine Standards.*
