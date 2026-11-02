import React from 'react';
import { motion } from 'motion/react';
import {
  Wand2,
  Image as ImageIcon,
  Smile,
  Sparkles,
  Film,
  Camera,
  Box,
  BookOpen,
  Music,
  Scissors,
  ArrowUpRight,
  Play,
} from 'lucide-react';
import { AppView, VideoStyleId } from '../types';
import { VisualHowItWorks } from './VisualHowItWorks';
import { MobileAppInstallCard } from './MobileAppInstallCard';

import heroImg from '../assets/images/avinash_cinematic_hero_1793615137655.jpg';
import animeImg from '../assets/images/avinash_anime_showcase_1793615138453.jpg';
import threeDImg from '../assets/images/avinash_3d_animation_showcase_1793615140226.jpg';
import realisticImg from '../assets/images/avinash_realistic_showcase_1793615141888.jpg';

interface DashboardProps {
  onNavigateGenerator: (
    targetView: AppView,
    presetStyle?: VideoStyleId,
    presetPrompt?: string
  ) => void;
  totalCreations: number;
}

interface DashboardCardItem {
  id: string;
  number: string;
  title: string;
  description: string;
  meta: string;
  icon: React.ComponentType<{ className?: string }>;
  accentClass: string;
  targetView: AppView;
  presetStyle?: VideoStyleId;
  presetPrompt?: string;
  previewImage?: string;
}

const DASHBOARD_CARDS: DashboardCardItem[] = [
  {
    id: 'text-to-video',
    number: '01',
    title: 'Text to Video',
    description: 'Turn natural language prompts into multi-scene Ultra HD videos up to 30 seconds.',
    meta: '5s–30s · Up to 4K · Free Unlimited',
    icon: Wand2,
    accentClass: 'from-cyan-400 to-blue-500',
    targetView: 'text-to-video',
    presetStyle: 'Cinematic',
    presetPrompt:
      'Futuristic cyberpunk metropolis at midnight with flying vehicles weaving through glowing cyan and violet holographic skyscrapers, rain reflections on asphalt, 8k anamorphic lens.',
    previewImage: heroImg,
  },
  {
    id: 'image-to-video',
    number: '02',
    title: 'Image to Video',
    description: 'Upload photos from your gallery and animate them with 3D camera motion and transitions.',
    meta: 'Gallery Upload · Motion Control · 6 Ratios',
    icon: ImageIcon,
    accentClass: 'from-indigo-400 to-purple-500',
    targetView: 'image-to-video',
    presetStyle: 'Realistic',
    previewImage: realisticImg,
  },
  {
    id: 'cartoon-video',
    number: '03',
    title: 'AI Cartoon Video',
    description: 'Create vibrant, expressive 2D and stylized cartoon adventures with lively motion.',
    meta: 'Stylized Toon · Bold Color · Kids & Social',
    icon: Smile,
    accentClass: 'from-pink-400 to-rose-500',
    targetView: 'text-to-video',
    presetStyle: 'Cartoon',
    presetPrompt:
      'Playful colorful cartoon adventure of a clever little fox piloting a glowing starship through candy-colored nebula clouds, expressive animation.',
  },
  {
    id: 'anime-video',
    number: '04',
    title: 'AI Anime Video',
    description: 'Generate Japanese cel-shaded anime scenes with dramatic lighting andsakura atmosphere.',
    meta: 'Cel-Shaded · Shinkai Lighting · 24fps Look',
    icon: Sparkles,
    accentClass: 'from-purple-400 to-fuchsia-500',
    targetView: 'text-to-video',
    presetStyle: 'Anime',
    presetPrompt:
      'Masterpiece anime scene of a young traveler standing on a windswept cliff overlooking floating bioluminescent sky islands under a crescent moon.',
    previewImage: animeImg,
  },
  {
    id: 'cinematic-video',
    number: '05',
    title: 'AI Cinematic Video',
    description: 'Direct Hollywood-style 21:9 widescreen trailers with anamorphic flares and depth.',
    meta: '21:9 Widescreen · Color Graded · Epic Score',
    icon: Film,
    accentClass: 'from-cyan-400 to-indigo-500',
    targetView: 'text-to-video',
    presetStyle: 'Cinematic',
    presetPrompt:
      'Epic sci-fi cinema shot of an astronaut stepping onto an ancient crystalline ringworld as twin suns rise over the horizon, Hans Zimmer mood, anamorphic 21:9.',
    previewImage: heroImg,
  },
  {
    id: 'realistic-video',
    number: '06',
    title: 'AI Realistic Video',
    description: 'Produce lifelike documentary, nature, architecture, and product cinematography.',
    meta: 'Photorealistic · Natural Physics · 4K Clarity',
    icon: Camera,
    accentClass: 'from-emerald-400 to-cyan-500',
    targetView: 'text-to-video',
    presetStyle: 'Realistic',
    presetPrompt:
      'Hyper-realistic wildlife shot of a snow leopard walking across a high Himalayan ridge under shimmering cyan and violet aurora borealis, 8k RED camera.',
    previewImage: realisticImg,
  },
  {
    id: '3d-animation',
    number: '07',
    title: 'AI 3D Animation',
    description: 'Render feature-film 3D characters, volumetric lighting, and ray-traced worlds.',
    meta: 'Octane & UE5 Look · Subsurface Lighting',
    icon: Box,
    accentClass: 'from-blue-400 to-violet-500',
    targetView: 'text-to-video',
    presetStyle: '3D Animation',
    presetPrompt:
      'Pixar-quality 3D animated friendly white and cyan robot explorer holding a glowing crystal lantern inside a magical bioluminescent crystal cavern.',
    previewImage: threeDImg,
  },
  {
    id: 'story-generator',
    number: '08',
    title: 'AI Story Generator',
    description: 'Auto-write multi-scene scripts, synchronized AI narration, and subtitles from one idea.',
    meta: 'Script + Voiceover + Auto Subtitles',
    icon: BookOpen,
    accentClass: 'from-violet-400 to-pink-500',
    targetView: 'text-to-video',
    presetStyle: 'Storybook',
    presetPrompt:
      'Tell an inspiring 20-second futuristic story about humanity discovering a peaceful ocean civilization beneath the ice of Europa.',
  },
  {
    id: 'music-video',
    number: '09',
    title: 'AI Music Video',
    description: 'Compose original AI synth/orchestral soundtracks paired with beat-synced visuals.',
    meta: 'Lyria & Studio Synth · Beat Reactive',
    icon: Music,
    accentClass: 'from-fuchsia-400 to-cyan-400',
    targetView: 'text-to-video',
    presetStyle: 'Music Visualizer',
    presetPrompt:
      'High-energy neon electronic music video with pulsing geometric laser tunnels, holographic dancers, and electric cyan-pink wave visuals.',
  },
  {
    id: 'video-editing',
    number: '10',
    title: 'AI Video Editing',
    description: 'All-in-one post-production suite: TTS Voice, Subtitles, Slow-Mo, BG Remover & Enhancer.',
    meta: '10 AI Editing Tools · Instant Export',
    icon: Scissors,
    accentClass: 'from-cyan-400 to-pink-500',
    targetView: 'editing-tools',
  },
];

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigateGenerator,
  totalCreations,
}) => {
  return (
    <div className="space-y-10 pb-12">
      {/* Hero Banner Split */}
      <div className="glass-panel neon-border-glow rounded-2xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="text-xs font-medium tracking-widest text-cyan-300">
              UNLIMITED FREE AI VIDEO STUDIO · UP TO 4K ULTRA HD
            </div>
            <h1
              className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight"
              style={{ textWrap: 'balance' }}
            >
              Direct Breathtaking <span className="text-neon-gradient">AI Videos</span> from Text &amp; Images
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Generate 5s to 30s videos across all 6 social and cinema aspect ratios. Powered by Gemini
              multimodal AI storyboard direction, neural voice synthesis, and zero-limit 4K rendering.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigateGenerator('text-to-video', 'Cinematic')}
              className="neon-cta-btn inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-display font-bold text-sm text-white cursor-pointer whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Create Text to Video</span>
            </button>
            <button
              onClick={() => onNavigateGenerator('image-to-video', 'Realistic')}
              className="px-6 py-3.5 rounded-xl font-display font-semibold text-sm text-slate-100 bg-white/5 hover:bg-white/10 border border-white/15 transition-colors cursor-pointer whitespace-nowrap"
            >
              Animate Image to Video
            </button>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-mono-num">
            <span>Durations: 5s / 10s / 15s / 20s / 30s</span>
            <span>·</span>
            <span>Export: 480p to 4K Ultra HD</span>
            <span>·</span>
            <span>Saved Creations: {totalCreations}</span>
          </div>
        </div>

        {/* Hero Visual Preview Frame */}
        <div className="lg:col-span-5 relative rounded-xl overflow-hidden border border-white/10 min-h-[240px] group">
          <img
            src={heroImg}
            alt="AVINASH AI futuristic cyberpunk video showcase"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-5">
            <div className="text-xs text-cyan-300 font-mono-num mb-1">
              21:9 CINEMA · 4K ULTRA HD · 30s READY
            </div>
            <div className="text-base font-display font-bold text-white">
              Neo-Tokyo Cyberpunk Aerial Sequence
            </div>
            <button
              onClick={() =>
                onNavigateGenerator(
                  'text-to-video',
                  'Cinematic',
                  DASHBOARD_CARDS[0].presetPrompt
                )
              }
              className="mt-3 self-start inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors cursor-pointer"
            >
              <span>Try this prompt in Studio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Universal Self-Explanatory 3-Step Visual Animation */}
      <VisualHowItWorks onStartStep={(view) => onNavigateGenerator(view)} />

      {/* 10 Animated AI Creation Cards */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="font-display font-bold text-2xl text-white">
              AI Creation &amp; Production Suites
            </h2>
            <p className="text-sm text-slate-400">
              Select any specialized AI video workflow below to launch with tailored presets.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono-num">
            10 Functional Modules · Free Access
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {DASHBOARD_CARDS.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.035, duration: 0.35 }}
                onClick={() =>
                  onNavigateGenerator(card.targetView, card.presetStyle, card.presetPrompt)
                }
                className="glass-panel glass-panel-hover group text-left rounded-xl overflow-hidden flex flex-col justify-between p-5 cursor-pointer relative"
              >
                {card.previewImage && (
                  <div className="relative h-28 -mx-5 -mt-5 mb-4 overflow-hidden border-b border-white/10">
                    <img
                      src={card.previewImage}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f1a] via-transparent to-transparent" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.accentClass} p-[1px] shadow-lg`}
                    >
                      <div className="w-full h-full bg-[#090b14] rounded-[7px] flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-cyan-300 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>
                    <span className="font-mono-num text-xs text-slate-500 group-hover:text-cyan-300 transition-colors">
                      {card.number}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-200 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1 line-clamp-3">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{card.meta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Direct Android & iOS Install + Play Store / App Store Guide */}
      <MobileAppInstallCard />
    </div>
  );
};
