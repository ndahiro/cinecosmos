import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Layers, 
  Palette, 
  ShieldCheck, 
  Cpu, 
  RefreshCw,
  Film,
  Camera,
  ArrowRight
} from 'lucide-react';
import { CharacterAnchor } from '../types';
import { apiGenerateCharacterAnchor } from '../services/api';

interface CharacterVaultProps {
  characters: CharacterAnchor[];
  onAddCharacter: (char: CharacterAnchor) => void;
  onApplyToTimeline: (char: CharacterAnchor) => void;
  onProceedToScript?: () => void;
}

export const CharacterVault: React.FC<CharacterVaultProps> = ({
  characters,
  onAddCharacter,
  onApplyToTimeline,
  onProceedToScript,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [seriesTitle, setSeriesTitle] = useState('The Clockwork Chronicles');
  const [archetype, setArchetype] = useState('Artificer / Explorer');
  const [description, setDescription] = useState('');
  const [referenceNotes, setReferenceNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterAnchor | null>(
    characters[0] || null
  );

  const handleGenerateAnchor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsLoading(true);
      const newChar = await apiGenerateCharacterAnchor({
        name,
        seriesTitle,
        archetype,
        description,
        referenceNotes,
      });

      // Default reference image fallback
      if (!newChar.referenceImageUrl) {
        newChar.referenceImageUrl = '/src/assets/images/character_maya_anchor_1791884043253.jpg';
      }

      onAddCharacter(newChar);
      setSelectedCharacter(newChar);
      setIsCreating(false);
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
      alert('Failed to generate anchor. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0D1018] border border-[#1F2430] rounded-lg p-5 flex flex-col gap-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2430]">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Cosmos & Gemma Embedding 2 Character Vault
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Character Anchor Sheets establish persistent semantic embeddings and armature constraints. When writing scripts or generating shots, calling the character name locks their facial proportions and wardrobe across sequential episodes.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-200 bg-[#1A2030] hover:bg-[#252E44] border border-[#273045] rounded-md transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
            <span>New Character Anchor</span>
          </button>

          {onProceedToScript && (
            <button
              onClick={onProceedToScript}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-md shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Step 2: Script & Flow</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* New Character Creation Form Modal/Card */}
      {isCreating && (
        <form onSubmit={handleGenerateAnchor} className="bg-[#141926] border border-amber-500/30 rounded-lg p-4 flex flex-col gap-3 animate-fade-in">
          <h3 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-amber-400" />
            Extract Character Vector Anchor via Gemini & Gemma 2
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-medium text-neutral-300 block mb-1">Character Name</label>
              <input
                type="text"
                placeholder="e.g. Leo the Clay Golem"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-[#0A0D14] border border-[#232938] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-neutral-300 block mb-1">Series / Project Title</label>
              <input
                type="text"
                value={seriesTitle}
                onChange={(e) => setSeriesTitle(e.target.value)}
                className="w-full bg-[#0A0D14] border border-[#232938] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-neutral-300 block mb-1">Archetype / Role</label>
              <input
                type="text"
                value={archetype}
                onChange={(e) => setArchetype(e.target.value)}
                className="w-full bg-[#0A0D14] border border-[#232938] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-neutral-300 block mb-1">Physical Traits & Armature Specifications</label>
            <textarea
              rows={2}
              placeholder="e.g. Rough gray stone texture, glowing cyan runic seams, brass articulated finger joints, wooden shoulder plate..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0A0D14] border border-[#232938] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end gap-2 mt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Gemma Vectors...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lock Character Anchor</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Main Character Cards Grid & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Characters Roster */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            Registered Characters ({characters.length})
          </div>

          <div className="flex flex-col gap-2">
            {characters.map((char) => {
              const isSelected = selectedCharacter?.id === char.id;
              return (
                <div
                  key={char.id}
                  onClick={() => setSelectedCharacter(char)}
                  className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#181E2C] border-amber-500/60 ring-1 ring-amber-500/20'
                      : 'bg-[#111520] border-[#1E2434] hover:border-neutral-600'
                  }`}
                >
                  <img
                    src={char.referenceImageUrl}
                    alt={char.name}
                    className="w-12 h-12 rounded-lg object-cover border border-[#2A3144] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">{char.name}</h4>
                      <span className="text-[11px] font-mono text-emerald-400 font-bold">
                        {char.consistencyScore}%
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate">{char.archetype}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-500 font-mono">
                      <span>Ep. Count: {char.appearancesCount}</span>
                      <span>·</span>
                      <span>Cosmos Ready</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center & Right: Selected Character Anchor Inspector */}
        {selectedCharacter && (
          <div className="lg:col-span-2 bg-[#121623] border border-[#212738] rounded-lg p-5 flex flex-col gap-5">
            {/* Top overview row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#212738]">
              <div className="flex items-center gap-4">
                <img
                  src={selectedCharacter.referenceImageUrl}
                  alt={selectedCharacter.name}
                  className="w-16 h-16 rounded-xl object-cover border-2 border-amber-500/40 shadow-lg shadow-black/60 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {selectedCharacter.name}
                    </h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      Locked Vector Anchor
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5">{selectedCharacter.archetype} · {selectedCharacter.seriesId}</p>
                </div>
              </div>

              <button
                onClick={() => onApplyToTimeline(selectedCharacter)}
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-200 bg-[#1E2538] hover:bg-[#28324A] border border-[#2D364F] rounded transition-colors cursor-pointer self-start sm:self-auto"
              >
                Tag Active Timeline Frame
              </button>
            </div>

            {/* Gemma 2 Consistency Radar & Feature Representation */}
            <div className="bg-[#0B0E16] border border-[#1D2333] rounded-lg p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Gemma Embedding 2 Vector Signature (16-D Normalized)
                </span>
                <span className="text-neutral-400">Cosine Stability: {selectedCharacter.consistencyScore}%</span>
              </div>

              {/* Embedding vector bar visualizer */}
              <div className="grid grid-cols-16 gap-1 h-8 items-end pt-2">
                {selectedCharacter.gemmaEmbeddingVector.map((val, idx) => {
                  const normalizedHeight = Math.max(15, Math.min(100, Math.round((Math.abs(val)) * 100)));
                  const isPositive = val >= 0;
                  return (
                    <div
                      key={idx}
                      title={`Dim ${idx + 1}: ${val}`}
                      style={{ height: `${normalizedHeight}%` }}
                      className={`rounded-t transition-all ${
                        isPositive ? 'bg-amber-400/80 hover:bg-amber-300' : 'bg-cyan-400/80 hover:bg-cyan-300'
                      }`}
                    ></div>
                  );
                })}
              </div>
              <div className="text-[10px] text-neutral-500 flex justify-between font-mono">
                <span>D01 Armature Arm</span>
                <span>D08 Scarf Weave</span>
                <span>D16 Clay Specularity</span>
              </div>
            </div>

            {/* Signature Traits & Color-Locked Palette */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#0D111A] border border-[#1E2434] rounded-lg p-3">
                <h4 className="text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  Locked Signature Traits
                </h4>
                <ul className="text-xs text-neutral-300 flex flex-col gap-1.5">
                  {selectedCharacter.signatureTraits.map((trait, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#0D111A] border border-[#1E2434] rounded-lg p-3">
                <h4 className="text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  Locked Production Palette
                </h4>
                <div className="flex items-center gap-2 mb-3">
                  {selectedCharacter.colorPalette.map((color, i) => (
                    <div
                      key={i}
                      style={{ backgroundColor: color }}
                      title={color}
                      className="w-7 h-7 rounded border border-white/20 shadow-sm"
                    ></div>
                  ))}
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  Hex Locked: {selectedCharacter.colorPalette.join(', ')}
                </div>
              </div>
            </div>

            {/* Cosmos Prompt Guidance Block */}
            <div className="bg-[#0D111A] border border-[#1E2434] rounded-lg p-3">
              <h4 className="text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                Cosmos Conditioned Generation Prompt
              </h4>
              <p className="text-xs text-neutral-300 font-mono bg-[#07090F] p-2.5 rounded border border-[#181D2A] select-all">
                {selectedCharacter.promptGuidance}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
