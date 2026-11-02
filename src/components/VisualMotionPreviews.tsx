import React from 'react';
import { motion } from 'motion/react';
import { CameraMovement, TransitionType } from '../types';

interface VisualMotionPreviewsProps {
  selectedCamera: CameraMovement;
  onSelectCamera: (cam: CameraMovement) => void;
  selectedTransition: TransitionType;
  onSelectTransition: (tr: TransitionType) => void;
}

const CAMERA_CARDS: {
  id: CameraMovement;
  simpleName: string;
  plainHint: string;
}[] = [
  {
    id: 'Orbital Drone Sweep',
    simpleName: '360° Drone Circle',
    plainHint: 'Circles smoothly around your scene',
  },
  {
    id: 'Slow Push-In',
    simpleName: 'Zoom Closer',
    plainHint: 'Gently moves closer to the subject',
  },
  {
    id: 'Cinematic Crane Rise',
    simpleName: 'Camera Rises Up',
    plainHint: 'Floats upward for a grand view',
  },
  {
    id: 'Dynamic Tracking Pan',
    simpleName: 'Side-to-Side Glide',
    plainHint: 'Glides smoothly from left to right',
  },
  {
    id: 'Handheld Action',
    simpleName: 'Action Energy',
    plainHint: 'Lively realistic movie camera feel',
  },
  {
    id: 'Macro Parallax',
    simpleName: '3D Depth Focus',
    plainHint: 'Close-up 3D foreground movement',
  },
];

const TRANSITION_CARDS: {
  id: TransitionType;
  simpleName: string;
  plainHint: string;
}[] = [
  {
    id: 'Smooth Dissolve',
    simpleName: 'Soft Fade',
    plainHint: 'Blends scenes gently together',
  },
  {
    id: 'Neon Whip Pan',
    simpleName: 'Fast Swipe',
    plainHint: 'Quick energetic flash between shots',
  },
  {
    id: 'Glitch Cut',
    simpleName: 'Cyber Glitch',
    plainHint: 'Futuristic digital cut effect',
  },
  {
    id: 'Light Leak',
    simpleName: 'Cinema Glow',
    plainHint: 'Warm colorful film light flash',
  },
];

export const VisualMotionPreviews: React.FC<VisualMotionPreviewsProps> = ({
  selectedCamera,
  onSelectCamera,
  selectedTransition,
  onSelectTransition,
}) => {
  const getCameraKeyframes = (cam: CameraMovement) => {
    switch (cam) {
      case 'Slow Push-In':
        return { scale: [0.85, 1.28, 0.85], x: 0, y: 0 };
      case 'Orbital Drone Sweep':
        return { x: [-10, 10, -10], y: [-3, 3, -3], scale: [1, 1.12, 1] };
      case 'Cinematic Crane Rise':
        return { y: [10, -10, 10], scale: [1.05, 1.05, 1.05], x: 0 };
      case 'Dynamic Tracking Pan':
        return { x: [-14, 14, -14], y: 0, scale: 1.05 };
      case 'Handheld Action':
        return { x: [-4, 5, -3, 4, -4], y: [3, -4, 4, -2, 3], rotate: [-2, 2, -1, 2, -2] };
      case 'Macro Parallax':
        return { scale: [1, 1.22, 1], x: [-6, 6, -6], y: 0 };
      default:
        return { scale: [1, 1.15, 1] };
    }
  };

  return (
    <div className="space-y-5">
      {/* Visual Animated Camera Movement Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 tracking-wide">
            Camera Movement (Watch the live preview &amp; tap one)
          </label>
          <span className="text-[11px] text-cyan-300 font-medium">{selectedCamera}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CAMERA_CARDS.map((cam) => {
            const active = selectedCamera === cam.id;
            return (
              <button
                key={cam.id}
                type="button"
                onClick={() => onSelectCamera(cam.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  active
                    ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_16px_rgba(34,211,238,0.22)]'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {/* Live Mini Animated Viewport Demonstrating the Camera Motion */}
                <div className="w-11 h-11 rounded-lg bg-[#050711] border border-white/15 overflow-hidden flex items-center justify-center shrink-0 relative">
                  <motion.div
                    animate={getCameraKeyframes(cam.id)}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-400 via-indigo-400 to-pink-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                  />
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{cam.simpleName}</div>
                  <div className="text-[10px] text-slate-400 leading-snug line-clamp-2">
                    {cam.plainHint}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Visual Animated Scene Transition Cards */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 tracking-wide">
            Scene Change Style (How one scene flows into the next)
          </label>
          <span className="text-[11px] text-purple-300 font-medium">{selectedTransition}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TRANSITION_CARDS.map((tr) => {
            const active = selectedTransition === tr.id;
            return (
              <button
                key={tr.id}
                type="button"
                onClick={() => onSelectTransition(tr.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${
                  active
                    ? 'bg-purple-500/20 border-purple-400 text-white shadow-[0_0_16px_rgba(192,132,252,0.22)]'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {/* Live Mini Transition Animation Box */}
                <div className="w-full h-7 rounded-md bg-[#050711] border border-white/10 overflow-hidden relative flex items-center justify-center">
                  {tr.id === 'Smooth Dissolve' && (
                    <motion.div
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inset-0 absolute bg-gradient-to-r from-cyan-500/50 to-purple-500/50"
                    />
                  )}
                  {tr.id === 'Neon Whip Pan' && (
                    <motion.div
                      animate={{ x: ['-110%', '110%'] }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-10 h-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                    />
                  )}
                  {tr.id === 'Glitch Cut' && (
                    <motion.div
                      animate={{
                        x: [0, -4, 5, -2, 0],
                        opacity: [0.4, 1, 0.3, 0.9, 0.4],
                      }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="w-8 h-3 bg-pink-500/80 rounded-xs"
                    />
                  )}
                  {tr.id === 'Light Leak' && (
                    <motion.div
                      animate={{ scale: [0.7, 1.5, 0.7], opacity: [0.25, 0.9, 0.25] }}
                      transition={{ duration: 2.1, repeat: Infinity }}
                      className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 to-cyan-400 blur-xs"
                    />
                  )}
                </div>

                <div>
                  <div className="text-xs font-bold text-white truncate">{tr.simpleName}</div>
                  <div className="text-[10px] text-slate-400 truncate">{tr.plainHint}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
