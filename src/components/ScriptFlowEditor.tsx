import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Film, 
  Layers, 
  ShieldCheck, 
  Plus, 
  Clapperboard
} from 'lucide-react';
import { CharacterAnchor, ScriptScene } from '../types';
import { apiProcessScriptFlow } from '../services/api';

interface ScriptFlowEditorProps {
  characters: CharacterAnchor[];
  onAddFramesFromScript: (scene: any) => void;
  onProceedToOpenCut?: () => void;
}

export const ScriptFlowEditor: React.FC<ScriptFlowEditorProps> = ({
  characters,
  onAddFramesFromScript,
  onProceedToOpenCut,
}) => {
  const [episodeNumber, setEpisodeNumber] = useState<number>(3);
  const [scriptText, setScriptText] = useState<string>(
    `Scene 1: Workshop Morning.
Maya enters the wooden workshop carrying a bundle of dry lavender. She stops by the workbench and gently sets the antique compass beside the shavings.

Maya: "The needle has calmed down, but the runic casing is still warm."

She turns toward the window as morning spotlight streams across her red wool scarf.`
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scenesResult, setScenesResult] = useState<any[] | null>(null);

  const handleAnalyzeScript = async () => {
    if (!scriptText.trim()) return;
    try {
      setIsProcessing(true);
      const res = await apiProcessScriptFlow({
        scriptText,
        episodeNumber,
        registeredCharacters: characters,
      });
      setScenesResult(res.scenes || []);
    } catch (err) {
      console.error(err);
      alert('Failed to analyze script with Google Flow. Please check backend connection.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#0D1018] border border-[#1F2430] rounded-lg p-5 flex flex-col gap-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2430]">
        <div>
          <div className="flex items-center gap-2">
            <Clapperboard className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Google Flow Episodic Script & Character Recall
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Mention any registered character by name in your script (e.g. <strong className="text-amber-300">Maya</strong>). Google Flow automatically recalls their master Gemma Embedding 2 anchor and enforces strict character continuity across sequential episodes.
          </p>
        </div>

        {/* Episode selector & Next Step action */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-2 bg-[#121622] px-3 py-1.5 rounded border border-[#202738] text-xs">
            <span className="text-neutral-400 font-medium">Target Episode:</span>
            <input
              type="number"
              min="1"
              max="100"
              value={episodeNumber}
              onChange={(e) => setEpisodeNumber(parseInt(e.target.value) || 1)}
              className="w-14 bg-[#0A0D14] border border-[#272E40] text-amber-400 font-mono font-bold px-2 py-0.5 rounded text-center outline-none"
            />
          </div>

          {onProceedToOpenCut && (
            <button
              onClick={onProceedToOpenCut}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-md shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Step 3: OpenCut Studio</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Screenplay Editor */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-400" />
              Screenplay Input
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-500">Recall Anchors:</span>
              {characters.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setScriptText((prev) => `${prev} ${c.name}`)}
                  className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[10px] font-mono border border-amber-500/30 cursor-pointer"
                >
                  +{c.name}
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={11}
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            placeholder="Write scene script with character names..."
            className="w-full bg-[#080B11] border border-[#1E2434] rounded-lg p-3 text-xs md:text-sm text-neutral-200 font-mono leading-relaxed outline-none focus:border-amber-400 resize-none"
          />

          <button
            onClick={handleAnalyzeScript}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs rounded-lg shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50 transition-all"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Recalling Characters via Google Flow & Gemma 2...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
                <span>Analyze Script & Match Episode Continuity</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Episodic Breakdown & Continuity Verification */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            Episodic Scene Breakdown & Continuity Verification
          </span>

          {scenesResult ? (
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[380px] pr-1">
              {scenesResult.map((scene, idx) => (
                <div
                  key={idx}
                  className="bg-[#121624] border border-[#21293B] rounded-lg p-4 flex flex-col gap-3 shadow-md"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#21293B]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 font-mono">
                        Scene {scene.sceneNumber || idx + 1}
                      </span>
                      <span className="text-xs text-neutral-300">
                        {scene.actionSummary || 'Action block'}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">
                      {scene.suggestedFrames || 36} frames ({scene.pacingSec || 3}s)
                    </span>
                  </div>

                  {/* Character verification status */}
                  {scene.characterVerifications && scene.characterVerifications.length > 0 && (
                    <div className="flex flex-col gap-1.5 bg-[#0A0D15] p-2.5 rounded border border-[#19202E]">
                      <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Continuity Anchor Confirmed for Episode {episodeNumber}</span>
                      </div>
                      {scene.characterVerifications.map((v: any, vi: number) => (
                        <div key={vi} className="text-xs text-neutral-300 flex items-center justify-between">
                          <span className="font-semibold text-amber-300">{v.characterName}</span>
                          <span className="font-mono text-emerald-400 font-bold">
                            {v.similarityScore}% Gemma Match
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Frame prompts generated */}
                  {scene.framePrompts && (
                    <div className="flex flex-col gap-1 text-[11px] text-neutral-300">
                      <span className="text-neutral-500 font-mono">Cosmos Direction:</span>
                      {scene.framePrompts.slice(0, 3).map((fp: string, fpi: number) => (
                        <div key={fpi} className="bg-[#090C13] px-2 py-1 rounded text-neutral-300 truncate">
                          • {fp}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add to timeline action */}
                  <button
                    onClick={() => onAddFramesFromScript(scene)}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#1B2232] hover:bg-[#252F45] text-amber-300 text-xs font-semibold rounded border border-amber-500/20 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>Import Keyframe Prompts to Sequence</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#090C12] border border-[#1A2030] rounded-lg p-8 text-center flex flex-col items-center justify-center h-full text-neutral-500">
              <Clapperboard className="w-10 h-10 mb-2 text-neutral-600" />
              <p className="text-xs font-medium text-neutral-400">No script scenes analyzed yet</p>
              <p className="text-[11px] text-neutral-600 mt-1 max-w-xs">
                Write a screenplay block on the left and click "Analyze Script" to recall characters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
