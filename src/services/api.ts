import { CharacterAnchor, ScriptScene, CaptionItem } from '../types';

export async function apiGenerateCharacterAnchor(params: {
  name: string;
  seriesTitle?: string;
  archetype?: string;
  description?: string;
  referenceNotes?: string;
}): Promise<CharacterAnchor> {
  const res = await fetch('/api/gemini/character-anchor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to generate character anchor');
  }
  return await res.json();
}

export async function apiProcessScriptFlow(params: {
  scriptText: string;
  episodeNumber: number;
  registeredCharacters: CharacterAnchor[];
}): Promise<{ scenes: any[] }> {
  const res = await fetch('/api/gemini/script-flow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to analyze script flow');
  }
  return await res.json();
}

export async function apiGenerateCosmosAnimation(params: {
  characterName: string;
  actionPrompt: string;
  frameCount?: number;
  characterTraits?: string[];
  colorPalette?: string[];
}): Promise<any> {
  const res = await fetch('/api/cosmos/generate-animation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to generate Cosmos animation');
  }
  return await res.json();
}

export async function apiGenerateAutoCaptions(params: {
  contextText: string;
  totalDurationSec: number;
  fps: number;
}): Promise<{ captions: CaptionItem[] }> {
  const res = await fetch('/api/gemini/auto-captions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to generate captions');
  }
  return await res.json();
}

export async function apiCloudSyncProject(params: {
  projectId: string;
  payload: any;
  comments?: any[];
  author?: string;
}): Promise<{ status: string; version: number; activeCollaborators: string[]; commentCount: number }> {
  const res = await fetch('/api/sync/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(err.error || 'Failed to sync project');
  }
  return await res.json();
}
