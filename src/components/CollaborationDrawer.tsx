import React, { useState } from 'react';
import { 
  MessageSquare, 
  CheckCircle2, 
  Circle, 
  Send, 
  Clock, 
  User, 
  ShieldAlert, 
  X,
  Users
} from 'lucide-react';
import { CommentMarker, Project } from '../types';

interface CollaborationDrawerProps {
  project: Project;
  currentFrameIndex: number;
  onAddComment: (comment: CommentMarker) => void;
  onToggleResolveComment: (commentId: string) => void;
  onJumpToFrame: (frameIndex: number) => void;
}

export const CollaborationDrawer: React.FC<CollaborationDrawerProps> = ({
  project,
  currentFrameIndex,
  onAddComment,
  onToggleResolveComment,
  onJumpToFrame,
}) => {
  const [newCommentText, setNewCommentText] = useState('');
  const [authorName, setAuthorName] = useState('Elena R.');
  const [role, setRole] = useState<'Director' | 'Animator' | 'Colorist' | 'Reviewer'>('Director');
  const [filterResolved, setFilterResolved] = useState<'all' | 'open' | 'resolved'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const fps = project.fps;
    const f = currentFrameIndex % fps;
    const s = Math.floor(currentFrameIndex / fps) % 60;
    const m = Math.floor(currentFrameIndex / (fps * 60));
    const timecode = `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;

    const newComment: CommentMarker = {
      id: `comm_${Date.now()}`,
      frameIndex: currentFrameIndex,
      timecode,
      author: authorName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      role,
      content: newCommentText.trim(),
      timestamp: 'Just now',
      resolved: false,
    };

    onAddComment(newComment);
    setNewCommentText('');
  };

  const filteredComments = project.comments.filter((c) => {
    if (filterResolved === 'open') return !c.resolved;
    if (filterResolved === 'resolved') return c.resolved;
    return true;
  });

  return (
    <div className="bg-[#0D1018] border border-[#1F2430] rounded-lg p-5 flex flex-col gap-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1F2430]">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Collaborative Workspace & Real-Time Review
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Frame-accurate team annotations and approvals. Comments are pinned to specific SMPTE timecodes on the timeline for instant review.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1 bg-[#121622] p-1 rounded border border-[#202738] text-xs">
          <button
            onClick={() => setFilterResolved('all')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filterResolved === 'all' ? 'bg-amber-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({project.comments.length})
          </button>
          <button
            onClick={() => setFilterResolved('open')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filterResolved === 'open' ? 'bg-amber-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Open ({project.comments.filter(c => !c.resolved).length})
          </button>
          <button
            onClick={() => setFilterResolved('resolved')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              filterResolved === 'resolved' ? 'bg-amber-400 text-black font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            Resolved ({project.comments.filter(c => c.resolved).length})
          </button>
        </div>
      </div>

      {/* Comment Input Form pinned to current frame */}
      <form onSubmit={handleSubmit} className="bg-[#131724] border border-[#212738] rounded-lg p-3.5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Pinning comment to Frame {currentFrameIndex + 1}
          </span>
          <div className="flex items-center gap-2">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="bg-[#0A0D14] border border-[#232938] text-xs text-neutral-300 rounded px-2 py-0.5 outline-none"
            >
              <option value="Director">Director</option>
              <option value="Animator">Animator</option>
              <option value="Colorist">Colorist</option>
              <option value="Reviewer">Reviewer</option>
            </select>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="bg-[#0A0D14] border border-[#232938] text-xs text-neutral-300 rounded px-2 py-0.5 w-24 outline-none"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={`Add note for frame ${currentFrameIndex + 1}...`}
            className="flex-1 bg-[#0A0D14] border border-[#212738] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pin</span>
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="flex flex-col gap-2.5 max-h-[420px] overflow-y-auto pr-1">
        {filteredComments.map((comment) => (
          <div
            key={comment.id}
            className={`p-3.5 rounded-lg border transition-all ${
              comment.resolved
                ? 'bg-[#0E1119]/60 border-[#1B202D] opacity-60'
                : 'bg-[#121622] border-[#222838]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleResolveComment(comment.id)}
                  title={comment.resolved ? 'Reopen comment' : 'Mark resolved'}
                  className="cursor-pointer text-neutral-400 hover:text-emerald-400"
                >
                  {comment.resolved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 text-amber-400" />
                  )}
                </button>
                <span className="text-xs font-bold text-white">{comment.author}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono">
                  {comment.role}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  onClick={() => onJumpToFrame(comment.frameIndex)}
                  className="text-amber-400 hover:underline cursor-pointer"
                >
                  F:{comment.frameIndex + 1} ({comment.timecode})
                </button>
                <span className="text-neutral-500 text-[11px]">{comment.timestamp}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-300 pl-6 leading-relaxed">
              {comment.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
