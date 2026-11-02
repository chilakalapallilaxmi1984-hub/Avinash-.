import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Keyboard,
  Image as ImageIcon,
  Wand2,
  Film,
  Download,
  Play,
  Volume2,
  Subtitles,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { AppView } from '../types';

interface VisualHowItWorksProps {
  onStartStep: (view: AppView) => void;
}

const STORY_STEPS = [
  {
    id: 0,
    stepNum: 'Step 1',
    title: 'Type an Idea or Add a Photo',
    simpleSubtitle: 'Anyone can start — just write a few words or pick a picture from your phone.',
    actionLabel: 'Try Typing an Idea',
    targetView: 'text-to-video' as AppView,
    accent: 'from-cyan-400 to-blue-500',
  },
  {
    id: 1,
    stepNum: 'Step 2',
    title: 'Pick Size, Length & Style',
    simpleSubtitle: 'Tap visual shapes for Reels (9:16) or YouTube (16:9), choose 5s–30s, and tap Generate.',
    actionLabel: 'Try Photo to Video',
    targetView: 'image-to-video' as AppView,
    accent: 'from-purple-400 to-fuchsia-500',
  },
  {
    id: 2,
    stepNum: 'Step 3',
    title: 'Watch & Download Free in 4K',
    simpleSubtitle: 'AI adds camera motion, voice, and music automatically — ready to save & share!',
    actionLabel: 'Open Video Gallery',
    targetView: 'creations' as AppView,
    accent: 'from-emerald-400 to-cyan-500',
  },
];

export const VisualHowItWorks: React.FC<VisualHowItWorksProps> = ({ onStartStep }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [typedChars, setTypedChars] = useState<number>(0);

  const sampleText = 'A cute glowing robot exploring a magical crystal forest...';

  // Auto-advance between Step 1 -> Step 2 -> Step 3 so any user can watch it like a mini cartoon guide
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4400);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying]);

  // Typing animation for Step 1
  useEffect(() => {
    if (activeStep !== 0) {
      setTypedChars(sampleText.length);
      return;
    }
    setTypedChars(0);
    const charTimer = window.setInterval(() => {
      setTypedChars((prev) => (prev < sampleText.length ? prev + 2 : prev));
    }, 55);
    return () => window.clearInterval(charTimer);
  }, [activeStep]);

  return (
    <div className="glass-panel neon-border-glow rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="text-xs font-semibold tracking-wider text-cyan-300">
            EASY VISUAL GUIDE · MADE FOR EVERYONE
          </span>
          <h2 className="font-display font-bold text-xl sm:text-2xl text-white mt-0.5">
            See How AVINASH AI Makes Videos in 3 Easy Steps
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsAutoPlaying((prev) => !prev)}
          className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-slate-200 cursor-pointer whitespace-nowrap"
        >
          {isAutoPlaying ? 'Auto-Playing Guide (Tap to Pause)' : 'Resume Auto-Play'}
        </button>
      </div>

      {/* Interactive 3-Step Selector Tabs + Visual Animated Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: 3 Clear Visual Step Buttons */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          {STORY_STEPS.map((st, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setActiveStep(idx);
                  setIsAutoPlaying(false);
                }}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-[0_0_24px_rgba(34,211,238,0.2)]'
                    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.07]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-mono-num text-xs font-bold ${
                      isActive ? 'text-cyan-300' : 'text-slate-400'
                    }`}
                  >
                    {st.stepNum}
                  </span>
                  {isActive && (
                    <motion.span
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-emerald-300" /> Showing Now
                    </motion.span>
                  )}
                </div>
                <div className="font-display font-bold text-base text-white">{st.title}</div>
                <p className="text-xs text-slate-300/90 mt-1 leading-relaxed">
                  {st.simpleSubtitle}
                </p>

                {isActive && isAutoPlaying && (
                  <motion.div
                    key={`bar-${activeStep}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 4.4, ease: 'linear' }}
                    style={{ transformOrigin: 'left' }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Right: Self-Explanatory Animated Cartoon Demonstration Stage */}
        <div className="lg:col-span-7 rounded-2xl bg-[#060813] border border-white/10 p-6 flex flex-col justify-between min-h-[290px] relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />

          <AnimatePresence mode="wait">
            {activeStep === 0 && (
              <motion.div
                key="stage-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col justify-center space-y-5 relative z-10"
              >
                {/* Visual Equation: Text OR Photo -> AI */}
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/40 w-32 text-center"
                  >
                    <Keyboard className="w-8 h-8 text-cyan-300" />
                    <span className="text-xs font-bold text-white">Write Words</span>
                  </motion.div>

                  <span className="font-display font-bold text-sm text-slate-400">OR</span>

                  <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-purple-500/10 border border-purple-400/40 w-32 text-center"
                  >
                    <ImageIcon className="w-8 h-8 text-purple-300" />
                    <span className="text-xs font-bold text-white">Upload Photo</span>
                  </motion.div>
                </div>

                {/* Live Animated Prompt Box */}
                <div className="rounded-xl bg-white/[0.04] border border-cyan-400/30 p-3.5 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div className="text-xs sm:text-sm text-white font-medium min-h-[20px]">
                    {sampleText.slice(0, typedChars)}
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1.5 h-4 bg-cyan-400 ml-0.5 align-middle"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                key="stage-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col justify-center space-y-5 relative z-10"
              >
                {/* Visual Shape Previews for Aspect Ratios */}
                <div className="flex items-center justify-center gap-5">
                  {/* 9:16 Phone Shape */}
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-10 h-16 rounded-lg border-2 border-cyan-400 bg-cyan-400/15 flex items-center justify-center text-[10px] font-mono-num font-bold text-cyan-200">
                      9:16
                    </div>
                    <span className="text-[11px] text-slate-300">Phone Reels</span>
                  </motion.div>

                  {/* 16:9 TV/YouTube Shape */}
                  <motion.div
                    animate={{ scale: [1.06, 1, 1.06] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className="w-20 h-12 rounded-lg border-2 border-purple-400 bg-purple-400/15 flex items-center justify-center text-[10px] font-mono-num font-bold text-purple-200">
                      16:9
                    </div>
                    <span className="text-[11px] text-slate-300">YouTube TV</span>
                  </motion.div>

                  {/* 1:1 Square Post Shape */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-lg border-2 border-pink-400 bg-pink-400/15 flex items-center justify-center text-[10px] font-mono-num font-bold text-pink-200">
                      1:1
                    </div>
                    <span className="text-[11px] text-slate-300">Square Post</span>
                  </div>
                </div>

                {/* Animated AI Magic Wand Transforming */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <motion.div
                    animate={{ scale: [1, 0.96, 1.03, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="neon-cta-btn px-5 py-2.5 rounded-xl font-display font-bold text-xs text-white flex items-center gap-2 shadow-lg"
                  >
                    <Wand2 className="w-4 h-4" />
                    <span>1-Tap GENERATE VIDEO (5s – 30s · 4K)</span>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                key="stage-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col justify-center space-y-4 relative z-10"
              >
                {/* Simulated Finished Video Player with Voice + Captions + 4K */}
                <div className="mx-auto w-full max-w-md rounded-xl bg-gradient-to-br from-cyan-900/50 via-indigo-950/70 to-fuchsia-900/50 border border-emerald-400/40 p-4 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
                      <CheckCircle2 className="w-4 h-4" /> Video Ready!
                    </span>
                    <span className="font-mono-num text-cyan-200 font-bold">4K ULTRA HD</span>
                  </div>

                  {/* Animated Moving Subject + Soundwave */}
                  <div className="h-24 rounded-lg bg-black/50 border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
                    <motion.div
                      animate={{ x: [-45, 45, -45] }}
                      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex items-center gap-2 text-cyan-300"
                    >
                      <Film className="w-7 h-7 text-cyan-300" />
                      <Volume2 className="w-5 h-5 text-purple-300" />
                      <Subtitles className="w-5 h-5 text-pink-300" />
                    </motion.div>
                    <div className="mt-2 text-[11px] font-medium text-white bg-black/70 px-2.5 py-0.5 rounded">
                      &ldquo;Exploring the glowing crystal forest...&rdquo;
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-300">
                    <Download className="w-4 h-4" />
                    <span>Free Unlimited Download to Phone or PC</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Direct Action Button for Current Step */}
          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-4 relative z-10">
            <span className="text-xs text-slate-400">
              Click any step on the left to inspect, or jump straight in:
            </span>
            <button
              type="button"
              onClick={() => onStartStep(STORY_STEPS[activeStep].targetView)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-xs font-bold text-cyan-200 transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>{STORY_STEPS[activeStep].actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
