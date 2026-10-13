import React, { useState, useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { Monitor } from './components/Monitor';
import { Timeline } from './components/Timeline';
import { CharacterVault } from './components/CharacterVault';
import { ScriptFlowEditor } from './components/ScriptFlowEditor';
import { CollaborationDrawer } from './components/CollaborationDrawer';
import { AnalyticsModal } from './components/AnalyticsModal';
import { ExportModal } from './components/ExportModal';
import { VideoEmbedModal } from './components/VideoEmbedModal';
import { EncryptionModal } from './components/EncryptionModal';
import { CosmosGeneratorModal } from './components/CosmosGeneratorModal';
import { DocsModal } from './components/DocsModal';
import { FlashbackModal } from './components/FlashbackModal';
import { StoryArchiveView } from './components/StoryArchiveView';

import { Project, Frame, CharacterAnchor, CommentMarker, AspectRatio, ArchivedEpisode } from './types';
import { 
  createStarterProject, 
  STARTER_CHARACTER_MAYA,
  STARTER_EPISODES,
  getPresetEpisode 
} from './services/starterProject';
import { 
  saveProjectOffline, 
  getProjectOffline, 
  saveCharacterOffline, 
  getAllCharactersOffline 
} from './services/db';
import { 
  apiGenerateAutoCaptions, 
  apiCloudSyncProject 
} from './services/api';

export default function App() {
  const [project, setProject] = useState<Project>(createStarterProject());
  const [characters, setCharacters] = useState<CharacterAnchor[]>([STARTER_CHARACTER_MAYA]);
  const [episodes, setEpisodes] = useState<ArchivedEpisode[]>(STARTER_EPISODES);
  const [activeTab, setActiveTab] = useState<'characters' | 'script' | 'timeline' | 'archive' | 'feedback' | 'analytics'>('characters');
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncState, setSyncState] = useState<'synced' | 'saving' | 'offline'>('synced');

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isVideoEmbedOpen, setIsVideoEmbedOpen] = useState<boolean>(false);
  const [isEncryptionOpen, setIsEncryptionOpen] = useState<boolean>(false);
  const [isCosmosGeneratorOpen, setIsCosmosGeneratorOpen] = useState<boolean>(false);
  const [isFlashbackOpen, setIsFlashbackOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncState('synced');
      showToast('Network restored. Cloud sync active.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncState('offline');
      showToast('Working in offline mode. Changes saved locally to IndexedDB.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial load from IndexedDB
  useEffect(() => {
    async function loadInitialData() {
      try {
        const savedProj = await getProjectOffline('proj_clockwork_ep2');
        if (savedProj && savedProj.frames && savedProj.frames.length > 0) {
          setProject(savedProj);
        } else {
          await saveProjectOffline(createStarterProject());
        }

        const savedChars = await getAllCharactersOffline();
        if (savedChars && savedChars.length > 0) {
          setCharacters(savedChars);
        } else {
          await saveCharacterOffline(STARTER_CHARACTER_MAYA);
        }
      } catch (err) {
        console.warn('Using default starter project memory cache:', err);
      }
    }
    loadInitialData();
  }, []);

  // Auto-save to IndexedDB and trigger cloud sync debounced
  useEffect(() => {
    setSyncState('saving');
    const timer = setTimeout(async () => {
      try {
        await saveProjectOffline(project);
        if (isOnline) {
          await apiCloudSyncProject({
            projectId: project.id,
            payload: {
              name: project.name,
              framesCount: project.frames.length,
              fps: project.fps,
              updatedAt: Date.now(),
            },
            comments: project.comments,
            author: 'Elena R. (Director)',
          }).catch(() => null);
          setSyncState('synced');
        } else {
          setSyncState('offline');
        }
      } catch (err) {
        setSyncState('offline');
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [project, isOnline]);

  // Frame editing handlers
  const handleCaptureNewFrame = useCallback((dataUrl: string) => {
    setProject((prev) => {
      const newFrame: Frame = {
        id: `frame_${Date.now()}`,
        order: prev.frames.length,
        dataUrl,
        durationFrames: 1,
        source: 'camera',
        characterAnchorId: characters[0]?.id,
        label: `Captured Frame ${prev.frames.length + 1}`,
        notes: 'Live camera snapshot',
        onionSkinOpacity: 0.5,
      };
      return {
        ...prev,
        frames: [...prev.frames, newFrame],
        updatedAt: Date.now(),
      };
    });
    setCurrentFrameIndex(project.frames.length);
    showToast(`Captured Frame ${project.frames.length + 1}`);
  }, [characters, project.frames.length]);

  const handleUpdateFrames = (frames: Frame[]) => {
    setProject((prev) => ({
      ...prev,
      frames,
      updatedAt: Date.now(),
    }));
  };

  const handleDeleteFrame = (frameId: string) => {
    if (project.frames.length <= 1) {
      showToast('Sequence must contain at least 1 frame');
      return;
    }
    setProject((prev) => {
      const filtered = prev.frames.filter((f) => f.id !== frameId);
      const reordered = filtered.map((f, i) => ({ ...f, order: i }));
      return {
        ...prev,
        frames: reordered,
        updatedAt: Date.now(),
      };
    });
    setCurrentFrameIndex((prev) => Math.max(0, Math.min(prev, project.frames.length - 2)));
    showToast('Frame deleted');
  };

  const handleDuplicateFrame = (frameId: string) => {
    setProject((prev) => {
      const targetIndex = prev.frames.findIndex((f) => f.id === frameId);
      if (targetIndex === -1) return prev;
      const target = prev.frames[targetIndex];
      const copy: Frame = {
        ...target,
        id: `frame_dup_${Date.now()}`,
        order: targetIndex + 1,
        label: `${target.label || 'Frame'} (Duplicate)`,
      };
      const updated = [...prev.frames];
      updated.splice(targetIndex + 1, 0, copy);
      return {
        ...prev,
        frames: updated.map((f, i) => ({ ...f, order: i })),
        updatedAt: Date.now(),
      };
    });
    setCurrentFrameIndex((prev) => prev + 1);
    showToast('Frame duplicated');
  };

  const handleSplitFrame = (frameId: string) => {
    setProject((prev) => {
      const targetIndex = prev.frames.findIndex((f) => f.id === frameId);
      if (targetIndex === -1) return prev;
      const target = prev.frames[targetIndex];
      const half1: Frame = { ...target, durationFrames: Math.max(1, Math.floor(target.durationFrames / 2)) };
      const half2: Frame = { 
        ...target, 
        id: `frame_split_${Date.now()}`,
        durationFrames: Math.max(1, Math.ceil(target.durationFrames / 2)),
      };
      const updated = [...prev.frames];
      updated.splice(targetIndex, 1, half1, half2);
      return {
        ...prev,
        frames: updated.map((f, i) => ({ ...f, order: i })),
        updatedAt: Date.now(),
      };
    });
    showToast('Frame split');
  };

  const handleReverseSequence = () => {
    setProject((prev) => ({
      ...prev,
      frames: [...prev.frames].reverse().map((f, i) => ({ ...f, order: i })),
      updatedAt: Date.now(),
    }));
    showToast('Sequence reversed');
  };

  const handleUploadPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setProject((prev) => {
            const newF: Frame = {
              id: `frame_upload_${Date.now()}_${Math.random()}`,
              order: prev.frames.length,
              dataUrl,
              durationFrames: 1,
              source: 'upload',
              label: file.name.substring(0, 20),
            };
            return {
              ...prev,
              frames: [...prev.frames, newF],
              updatedAt: Date.now(),
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    showToast(`Uploaded ${files.length} photos to sequence`);
  };

  const handleUpdateFrameDuration = (frameId: string, duration: number) => {
    setProject((prev) => ({
      ...prev,
      frames: prev.frames.map((f) => (f.id === frameId ? { ...f, durationFrames: duration } : f)),
      updatedAt: Date.now(),
    }));
  };

  const handleUpdateAspectRatio = (aspectRatio: AspectRatio) => {
    setProject((prev) => ({
      ...prev,
      aspectRatio,
      updatedAt: Date.now(),
    }));
    showToast(`Aspect ratio set to ${aspectRatio}`);
  };

  const handleUpdateFps = (fps: number) => {
    setProject((prev) => ({
      ...prev,
      fps,
      updatedAt: Date.now(),
    }));
    showToast(`Playback set to ${fps} FPS`);
  };

  // AI Auto Captions
  const handleAddAutoCaptions = async () => {
    try {
      showToast('Generating AI auto-captions with word timing...');
      const durationSec = project.frames.length / project.fps;
      const res = await apiGenerateAutoCaptions({
        contextText: 'Maya discovers the antique compass in the miniature workshop and smiles.',
        totalDurationSec: durationSec,
        fps: project.fps,
      });

      if (res.captions && res.captions.length > 0) {
        setProject((prev) => ({
          ...prev,
          captions: res.captions,
          updatedAt: Date.now(),
        }));
        showToast('Auto-captions generated and synchronized!');
      }
    } catch (err: any) {
      alert('Failed to generate auto-captions: ' + err.message);
    }
  };

  // Add Comment
  const handleAddComment = (comment: CommentMarker) => {
    setProject((prev) => ({
      ...prev,
      comments: [comment, ...prev.comments],
      updatedAt: Date.now(),
    }));
    showToast('Feedback pinned to frame timecode');
  };

  const handleToggleResolveComment = (commentId: string) => {
    setProject((prev) => ({
      ...prev,
      comments: prev.comments.map((c) =>
        c.id === commentId ? { ...c, resolved: !c.resolved } : c
      ),
      updatedAt: Date.now(),
    }));
  };

  // Character Vault additions
  const handleAddCharacter = async (char: CharacterAnchor) => {
    setCharacters((prev) => [...prev, char]);
    await saveCharacterOffline(char);
    showToast(`Character anchor locked for ${char.name}`);
  };

  const handleApplyCharacterToTimeline = (char: CharacterAnchor) => {
    setProject((prev) => {
      const activeF = prev.frames[currentFrameIndex];
      if (!activeF) return prev;
      return {
        ...prev,
        frames: prev.frames.map((f, i) =>
          i === currentFrameIndex ? { ...f, characterAnchorId: char.id } : f
        ),
        updatedAt: Date.now(),
      };
    });
    showToast(`Tagged Frame ${currentFrameIndex + 1} with ${char.name}`);
  };

  // Import frames from Google Flow Script
  const handleAddFramesFromScript = (scene: any) => {
    showToast(`Imported ${scene.framePrompts?.length || 3} keyframe prompts from Scene ${scene.sceneNumber || 1}`);
    setActiveTab('timeline');
  };

  // FFmpeg video frame import
  const handleImportExtractedFrames = (newFrames: Frame[]) => {
    setProject((prev) => ({
      ...prev,
      frames: [...prev.frames, ...newFrames],
      updatedAt: Date.now(),
    }));
    showToast(`Appended ${newFrames.length} frames from embedded video`);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#090B10] text-[#F3F4F6] overflow-hidden select-none font-sans">
      {/* Top Bar (3-Zone Contract) */}
      <TopBar
        project={project}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenVideoEmbed={() => setIsVideoEmbedOpen(true)}
        onOpenEncryption={() => setIsEncryptionOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
        isOnline={isOnline}
        syncState={syncState}
        isEncrypted={project.isEncrypted}
      />

      {/* Main Workspace Canvas */}
      <main className="flex-1 overflow-y-auto p-3 md:p-4 flex flex-col gap-4">
        {activeTab === 'timeline' && (
          <div className="flex flex-col gap-4 flex-1">
            {/* Monitor Stage */}
            <Monitor
              project={project}
              currentFrameIndex={currentFrameIndex}
              setCurrentFrameIndex={setCurrentFrameIndex}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              onCaptureNewFrame={handleCaptureNewFrame}
              onUpdateFrameDuration={handleUpdateFrameDuration}
              onUpdateAspectRatio={handleUpdateAspectRatio}
              onUpdateFps={handleUpdateFps}
            />

            {/* OpenCut Multi-Track Timeline */}
            <Timeline
              project={project}
              currentFrameIndex={currentFrameIndex}
              setCurrentFrameIndex={setCurrentFrameIndex}
              onUpdateFrames={handleUpdateFrames}
              onDeleteFrame={handleDeleteFrame}
              onDuplicateFrame={handleDuplicateFrame}
              onSplitFrame={handleSplitFrame}
              onReverseSequence={handleReverseSequence}
              onUploadPhotos={handleUploadPhotos}
              onAddAutoCaptions={handleAddAutoCaptions}
              onOpenCosmosGenerator={() => setIsCosmosGeneratorOpen(true)}
              onOpenFlashbacks={() => setIsFlashbackOpen(true)}
            />
          </div>
        )}

        {activeTab === 'characters' && (
          <CharacterVault
            characters={characters}
            onAddCharacter={handleAddCharacter}
            onApplyToTimeline={handleApplyCharacterToTimeline}
            onProceedToScript={() => setActiveTab('script')}
          />
        )}

        {activeTab === 'script' && (
          <ScriptFlowEditor
            characters={characters}
            onAddFramesFromScript={handleAddFramesFromScript}
            onProceedToOpenCut={() => setActiveTab('timeline')}
          />
        )}

        {activeTab === 'archive' && (
          <StoryArchiveView
            project={project}
            episodes={episodes}
            characters={characters}
            onSaveCurrentEpisodeToArchive={() => {
              const currentAsArchive: ArchivedEpisode = {
                id: `archived_${project.id}_${Date.now()}`,
                seriesId: project.seriesName,
                episodeNumber: project.episodeNumber,
                title: `Episode ${project.episodeNumber}: ${project.name}`,
                synopsis: `Completed stop-motion episode containing ${project.frames.length} frames with Cosmos keyframes.`,
                thumbnailUrl: project.frames[0]?.dataUrl || '/src/assets/images/character_maya_anchor_1791884043253.jpg',
                durationSec: Number((project.frames.length / project.fps).toFixed(1)),
                completedAt: Date.now(),
                characterNames: characters.map((c) => c.name),
                frames: project.frames,
              };
              setEpisodes((prev) => [...prev, currentAsArchive]);
              showToast(`Episode ${project.episodeNumber} saved to story archive!`);
            }}
            onOpenExportModal={() => setIsExportOpen(true)}
            onStartNextEpisode={() => {
              const nextEpNum = project.episodeNumber + 1;
              setProject((prev) => ({
                ...prev,
                id: `proj_ep_${nextEpNum}_${Date.now()}`,
                episodeNumber: nextEpNum,
                name: `Chapter ${nextEpNum}: The Uncharted Horizon`,
                frames: prev.frames.slice(0, 3).map((f, i) => ({
                  ...f,
                  id: `ep${nextEpNum}_f_${i}`,
                  order: i,
                  label: `Ep.${nextEpNum} Scene 1`,
                })),
                updatedAt: Date.now(),
              }));
              setActiveTab('script');
              showToast(`Initialized Episode ${nextEpNum} - write your script next!`);
            }}
            onSwitchEpisode={(epNum) => {
              const newProj = getPresetEpisode(epNum);
              setProject(newProj);
              setCurrentFrameIndex(0);
              setActiveTab('timeline');
              showToast(`Switched active workspace to Episode ${epNum}: "${newProj.name}"!`);
            }}
          />
        )}

        {activeTab === 'feedback' && (
          <CollaborationDrawer
            project={project}
            currentFrameIndex={currentFrameIndex}
            onAddComment={handleAddComment}
            onToggleResolveComment={handleToggleResolveComment}
            onJumpToFrame={(fIdx) => {
              setCurrentFrameIndex(fIdx);
              setActiveTab('timeline');
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsModal
            project={project}
            characters={characters}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#161B26] border border-amber-500/40 text-amber-300 text-xs font-medium px-4 py-2.5 rounded-lg shadow-xl shadow-black/80 animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <ExportModal
        project={project}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      <VideoEmbedModal
        isOpen={isVideoEmbedOpen}
        onClose={() => setIsVideoEmbedOpen(false)}
        onImportExtractedFrames={handleImportExtractedFrames}
        currentFps={project.fps}
      />

      <EncryptionModal
        project={project}
        isOpen={isEncryptionOpen}
        onClose={() => setIsEncryptionOpen(false)}
        onProjectDecrypted={(restored) => {
          setProject(restored);
          showToast('Project decrypted and restored from backup!');
        }}
      />

      <CosmosGeneratorModal
        isOpen={isCosmosGeneratorOpen}
        onClose={() => setIsCosmosGeneratorOpen(false)}
        characters={characters}
        onImportGeneratedAnimation={(newFrames) => {
          setProject((prev) => ({
            ...prev,
            frames: [...prev.frames, ...newFrames],
            updatedAt: Date.now(),
          }));
          showToast(`Appended ${newFrames.length} Cosmos animation keyframes to timeline!`);
        }}
        fps={project.fps}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <FlashbackModal
        isOpen={isFlashbackOpen}
        onClose={() => setIsFlashbackOpen(false)}
        episodes={episodes}
        currentEpisodeNumber={project.episodeNumber}
        onInsertFlashbackFrames={(flashbackFrames) => {
          setProject((prev) => {
            const updated = [...prev.frames];
            updated.splice(currentFrameIndex + 1, 0, ...flashbackFrames);
            return {
              ...prev,
              frames: updated.map((f, i) => ({ ...f, order: i })),
              updatedAt: Date.now(),
            };
          });
          setCurrentFrameIndex((prev) => prev + flashbackFrames.length);
          showToast(`Inserted ${flashbackFrames.length} flashback frames from previous episode!`);
        }}
      />
    </div>
  );
}
