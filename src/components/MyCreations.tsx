import React, { useState } from 'react';
import {
  Play,
  Download,
  Trash2,
  Share2,
  Film,
  Search,
  Check,
  Plus,
} from 'lucide-react';
import { AppView, VideoCreation } from '../types';

interface MyCreationsProps {
  creations: VideoCreation[];
  onDeleteCreation: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (view: AppView) => void;
}

export const MyCreations: React.FC<MyCreationsProps> = ({
  creations,
  onDeleteCreation,
  onClearAll,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratioFilter, setRatioFilter] = useState<string>('ALL');
  const [activePlayer, setActivePlayer] = useState<VideoCreation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = creations.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.style.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRatio = ratioFilter === 'ALL' || item.aspectRatio === ratioFilter;
    return matchesSearch && matchesRatio;
  });

  const handleDownload = (item: VideoCreation) => {
    const ext = item.mimeType.includes('mp4') ? 'mp4' : 'webm';
    const a = document.createElement('a');
    a.href = item.videoUrl;
    a.download = `AVINASH_AI_${item.quality}_${item.id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async (item: VideoCreation) => {
    const shareText = `${item.title} — Created in ${item.quality} (${item.aspectRatio}) with AVINASH AI: "${item.prompt}"`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: shareText,
        });
        return;
      } catch {
        // fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
            My Creations Gallery
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Play, download in Ultra HD, share, or manage your generated AI videos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {creations.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-300 cursor-pointer whitespace-nowrap"
            >
              Clear History
            </button>
          )}
          <button
            type="button"
            onClick={() => onNavigate('text-to-video')}
            className="neon-cta-btn px-5 py-2.5 rounded-xl font-display font-bold text-xs text-white inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>New Video</span>
          </button>
        </div>
      </div>

      {/* Search & Ratio Filter */}
      <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creations by title, prompt, or style..."
            className="w-full rounded-lg bg-[#070913] border border-white/10 pl-10 pr-4 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['ALL', '9:16', '16:9', '1:1', '4:5', '3:4', '21:9'].map((ratio) => (
            <button
              key={ratio}
              type="button"
              onClick={() => setRatioFilter(ratio)}
              className={`px-3 py-1.5 rounded-lg font-mono-num text-xs font-semibold cursor-pointer transition-colors ${
                ratioFilter === ratio
                  ? 'bg-cyan-500/25 border border-cyan-400 text-white'
                  : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      {/* Active Modal/Theater Player */}
      {activePlayer && (
        <div className="glass-panel neon-border-glow rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-lg text-white">{activePlayer.title}</h2>
              <p className="text-xs text-slate-400 font-mono-num">
                {activePlayer.style} · {activePlayer.aspectRatio} · {activePlayer.quality} ·{' '}
                {activePlayer.duration}s
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActivePlayer(null)}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-slate-200 hover:bg-white/20 cursor-pointer"
            >
              Close Player
            </button>
          </div>
          <div className="rounded-xl overflow-hidden bg-black flex justify-center max-h-[480px]">
            <video
              src={activePlayer.videoUrl}
              controls
              autoPlay
              loop
              className="max-h-[460px] w-auto object-contain"
            />
          </div>
        </div>
      )}

      {/* Gallery Grid or Empty State */}
      {filtered.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
            <Film className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="font-display font-bold text-xl text-white">No Creations Found</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your generated Text-to-Video, Image-to-Video, and AI Edited videos are stored locally in Ultra HD so you can play and download them anytime.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('text-to-video')}
            className="neon-cta-btn px-6 py-3 rounded-xl font-display font-bold text-sm text-white inline-flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Generate Your First Video</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => setActivePlayer(item)}
                  className="relative h-48 bg-black cursor-pointer group overflow-hidden"
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/80 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono-num text-slate-200">
                    <span>
                      {item.aspectRatio} · {item.quality}
                    </span>
                    <span>{item.duration}s</span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-display font-bold text-base text-white truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono-num pt-1">
                    {item.style} · {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(item)}
                  className="flex-1 py-2 px-3 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-xs font-semibold text-cyan-200 inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShare(item)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 cursor-pointer"
                  title="Share video details"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onDeleteCreation(item.id)}
                  className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 cursor-pointer"
                  title="Delete video"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
