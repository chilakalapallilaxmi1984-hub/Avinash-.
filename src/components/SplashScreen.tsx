import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Play, Sparkles, Film, Layers } from 'lucide-react';
import { AvinashLogo } from './AvinashLogo';

interface SplashScreenProps {
  onEnterStudio: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnterStudio }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const nodes = Array.from({ length: 75 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.3 + 1,
      color: ['#22d3ee', '#818cf8', '#c084fc', '#ec4899'][i % 4],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle neural links
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x = (a.x + a.vx + width) % width;
        a.y = (a.y + a.vy + height) % height;

        ctx.beginPath();
        ctx.fillStyle = a.color;
        ctx.shadowColor = a.color;
        ctx.shadowBlur = 10;
        ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 135) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - dist / 135) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#04050a] flex flex-col items-center justify-center px-6 py-12">
      {/* Interactive Neon Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Colorful Ambient Radial Glows */}
      <div className="absolute -top-40 left-1/4 w-[34rem] h-[34rem] rounded-full bg-cyan-500/15 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 right-1/4 w-[36rem] h-[36rem] rounded-full bg-fuchsia-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-indigo-600/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center text-center">
        {/* Animated 3D Glowing Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.72, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-5 rounded-full border border-cyan-400/30 border-dashed pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-9 rounded-full border border-fuchsia-500/20 pointer-events-none"
          />
          <AvinashLogo size="xl" showWordmark={false} />
        </motion.div>

        {/* Subtitle Lead-in */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="text-xs sm:text-sm font-medium tracking-[0.28em] text-cyan-300/90 mb-4"
        >
          NEXT-GENERATION CINEMA & MOTION PLATFORM
        </motion.p>

        {/* Animated WELCOME TO AVINASH AI Title */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-white mb-6"
          style={{ textWrap: 'balance' }}
        >
          WELCOME TO{' '}
          <span className="text-neon-gradient drop-shadow-[0_0_28px_rgba(56,189,248,0.35)]">
            AVINASH AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38, duration: 0.55 }}
          className="max-w-2xl text-base sm:text-lg text-slate-300/90 leading-relaxed mb-10"
        >
          Transform text prompts and images into breathtaking Ultra HD 4K AI videos up to 30 seconds.
          Equipped with unlimited free studio synthesis, multi-aspect framing, AI voiceover, and full editing tools.
        </motion.p>

        {/* Universal Visual Flow Animation: Understandable at a Single Glance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          className="mb-8 px-5 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm font-semibold text-white"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center gap-2 text-cyan-300"
          >
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center font-mono-num text-xs">
              1
            </span>
            <span>Write Idea or Add Photo</span>
          </motion.div>

          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="text-slate-400"
          >
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="flex items-center gap-2 text-purple-300"
          >
            <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center font-mono-num text-xs">
              2
            </span>
            <span>AI Animates Scene &amp; Voice</span>
          </motion.div>

          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
            className="text-slate-400"
          >
            <ArrowRight className="w-4 h-4 text-pink-400" />
          </motion.div>

          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            className="flex items-center gap-2 text-emerald-300"
          >
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center font-mono-num text-xs">
              3
            </span>
            <span>Save Free 4K Video</span>
          </motion.div>
        </motion.div>

        {/* Glowing GET STARTED Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.48, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={onEnterStudio}
            className="neon-cta-btn group relative inline-flex items-center gap-3 px-9 py-4 rounded-xl font-display font-bold text-base sm:text-lg text-white tracking-wide cursor-pointer whitespace-nowrap"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>GET STARTED</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Clean Unboxed Feature Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="mt-14 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl text-left"
        >
          <div className="flex items-start gap-3">
            <Film className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-white">5s to 30s Ultra HD 4K</div>
              <div className="text-xs text-slate-400 mt-0.5">
                9:16 Reels, 16:9 YouTube, 21:9 Cinema &amp; Square formats
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-white">Unlimited Free Generation</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Zero daily paywalls with hybrid Cloud AI &amp; Studio Engine
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Layers className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-white">10+ AI Video Suites</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Anime, 3D Animation, Voiceover, Subtitles &amp; FX Editor
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
