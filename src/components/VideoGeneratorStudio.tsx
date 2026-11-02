import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Wand2,
  Upload,
  Play,
  Download,
  Sparkles,
  Film,
  Volume2,
  Subtitles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import {
  AspectRatioOption,
  CameraMovement,
  StoryboardBlueprint,
  TransitionType,
  VideoCreation,
  VideoDuration,
  VideoQualityOption,
  VideoStyleId,
} from '../types';
import { synthesizeFreeStudioVideo } from '../utils/videoEngine';
import { VisualMotionPreviews } from './VisualMotionPreviews';

import heroFallback from '../assets/images/avinash_cinematic_hero_1793615137655.jpg';
import animeFallback from '../assets/images/avinash_anime_showcase_1793615138453.jpg';
import threeDFallback from '../assets/images/avinash_3d_animation_showcase_1793615140226.jpg';
import realisticFallback from '../assets/images/avinash_realistic_showcase_1793615141888.jpg';

interface VideoGeneratorStudioProps {
  mode: 'text-to-video' | 'image-to-video';
  initialStyle?: VideoStyleId;
  initialPrompt?: string;
  defaultQuality: VideoQualityOption;
  defaultAspectRatio: AspectRatioOption;
  onSaveCreation: (creation: VideoCreation) => void;
}

const VIDEO_STYLES: VideoStyleId[] = [
  'Cinematic',
  'Realistic',
  'Anime',
  'Cartoon',
  '3D Animation',
  'Cyberpunk',
  'Storybook',
  'Music Visualizer',
];

const DURATIONS: VideoDuration[] = [5, 10, 15, 20, 30];

const ASPECT_RATIOS: {
  id: AspectRatioOption;
  label: string;
  platform: string;
  boxClass: string;
}[] = [
  { id: '9:16', label: '9:16', platform: 'Phone Reels & Shorts', boxClass: 'w-3.5 h-6' },
  { id: '16:9', label: '16:9', platform: 'YouTube & TV Screen', boxClass: 'w-6 h-3.5' },
  { id: '1:1', label: '1:1', platform: 'Instagram Square', boxClass: 'w-4.5 h-4.5' },
  { id: '4:5', label: '4:5', platform: 'Instagram Portrait', boxClass: 'w-4 h-5' },
  { id: '3:4', label: '3:4', platform: 'Vertical Poster', boxClass: 'w-4 h-5.5' },
  { id: '21:9', label: '21:9', platform: 'Ultra-Wide Movie', boxClass: 'w-7 h-3' },
];

const QUALITIES: { id: VideoQualityOption; label: string }[] = [
  { id: '480p', label: '480p SD' },
  { id: '720p', label: '720p HD' },
  { id: '1080p', label: '1080p Full HD' },
  { id: '2K', label: '2K QHD' },
  { id: '4K', label: '4K Ultra HD' },
];

const CAMERA_MOTIONS: CameraMovement[] = [
  'Orbital Drone Sweep',
  'Slow Push-In',
  'Cinematic Crane Rise',
  'Dynamic Tracking Pan',
  'Handheld Action',
  'Macro Parallax',
];

const TRANSITIONS: TransitionType[] = [
  'Smooth Dissolve',
  'Neon Whip Pan',
  'Glitch Cut',
  'Light Leak',
];

export const VideoGeneratorStudio: React.FC<VideoGeneratorStudioProps> = ({
  mode,
  initialStyle = 'Cinematic',
  initialPrompt = '',
  defaultQuality,
  defaultAspectRatio,
  onSaveCreation,
}) => {
  const [prompt, setPrompt] = useState<string>(
    initialPrompt ||
      (mode === 'text-to-video'
        ? 'Futuristic neon metropolis at night with sleek flying vehicles, glowing cyan and violet rain reflections, cinematic anamorphic lens.'
        : 'Gentle cinematic push-in with atmospheric light rays, floating particles, and realistic depth.')
  );
  const [style, setStyle] = useState<VideoStyleId>(initialStyle);
  const [duration, setDuration] = useState<VideoDuration>(10);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>(defaultAspectRatio);
  const [quality, setQuality] = useState<VideoQualityOption>(defaultQuality);
  const [cameraMotion, setCameraMotion] = useState<CameraMovement>('Orbital Drone Sweep');
  const [transition, setTransition] = useState<TransitionType>('Smooth Dissolve');

  const [enginePreference, setEnginePreference] = useState<'auto-hybrid' | 'free-unlimited'>('auto-hybrid');
  const [includeVoiceover, setIncludeVoiceover] = useState<boolean>(true);
  const [includeSubtitles, setIncludeSubtitles] = useState<boolean>(true);
  const [includeSoundtrack, setIncludeSoundtrack] = useState<boolean>(true);

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const [progressStage, setProgressStage] = useState('');
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentCreation, setCurrentCreation] = useState<VideoCreation | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (initialStyle) setStyle(initialStyle);
  }, [initialStyle]);

  useEffect(() => {
    if (initialPrompt) setPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedImages((prev) => [...prev, reader.result as string].slice(0, 6));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancingPrompt) return;
    setIsEnhancingPrompt(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/ai/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style }),
      });
      const data = await res.json();
      if (data.ok && data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch {
      // Keep original prompt on network issue
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  const getStyleReferenceImages = (chosenStyle: VideoStyleId): string[] => {
    if (uploadedImages.length > 0) return uploadedImages;
    switch (chosenStyle) {
      case 'Anime':
        return [animeFallback, heroFallback];
      case '3D Animation':
      case 'Cartoon':
        return [threeDFallback, animeFallback];
      case 'Realistic':
        return [realisticFallback, heroFallback];
      default:
        return [heroFallback, realisticFallback];
    }
  };

  const handleGenerateVideo = async () => {
    if (mode === 'image-to-video' && uploadedImages.length === 0) {
      setErrorMsg('Please upload at least one image from your gallery (or click "Load Sample Frame").');
      return;
    }
    if (!prompt.trim() && uploadedImages.length === 0) {
      setErrorMsg('Please enter a text prompt describing your video.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    setStatusNotice(null);
    setProgressPct(4);
    setProgressStage('Initializing AVINASH AI Director...');

    try {
      // Step 1: Try Cloud Omni 1.1 Flash first if Auto-Hybrid is chosen and duration <= 10s
      if (enginePreference === 'auto-hybrid' && duration <= 10) {
        setProgressPct(10);
        setProgressStage('Connecting to Gemini Omni 1.1 Flash Cloud Video Engine...');
        try {
          const omniRes = await fetch('/api/ai/generate-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt,
              style,
              duration,
              aspectRatio,
              quality,
              cameraMotion,
              imageBase64: uploadedImages[0],
            }),
          });
          const omniData = await omniRes.json();
          if (omniRes.ok && omniData.ok && omniData.videoDataUrl) {
            const creation: VideoCreation = {
              id: `vid_${Date.now()}`,
              title: prompt.slice(0, 48) || `${style} AI Video`,
              prompt,
              mode,
              style,
              duration,
              aspectRatio,
              quality,
              videoUrl: omniData.videoDataUrl,
              mimeType: omniData.mimeType || 'video/mp4',
              thumbnailUrl: uploadedImages[0] || heroFallback,
              engineLabel: 'Gemini Omni 1.1 Flash Cloud',
              createdAt: new Date().toISOString(),
              cameraMotion,
            };
            setCurrentCreation(creation);
            onSaveCreation(creation);
            setProgressPct(100);
            setProgressStage('Cloud AI video generation complete!');
            setIsGenerating(false);
            return;
          } else {
            setStatusNotice(
              'Cloud Veo/Omni quota or duration exceeded — seamlessly switched to Unlimited Free 4K Studio Synthesis.'
            );
          }
        } catch {
          setStatusNotice('Switched to Unlimited Free 4K Studio Synthesis Engine.');
        }
      }

      // Step 2: Generate AI Storyboard Blueprint via free-tier Gemini 3.8 Flash
      setProgressPct(14);
      setProgressStage('Directing multi-scene AI storyboard & camera choreography...');
      let blueprint: StoryboardBlueprint | undefined;
      try {
        const sbRes = await fetch('/api/ai/storyboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, style, duration, aspectRatio, cameraMotion }),
        });
        const sbData = await sbRes.json();
        if (sbData.ok && sbData.blueprint) {
          blueprint = sbData.blueprint;
        }
      } catch {
        // Proceed with built-in dynamic scene director if offline
      }

      // Step 3: Optional AI Voiceover via free-tier Gemini 3.8 Flash Lite TTS
      let voiceAudioUrl: string | undefined;
      if (includeVoiceover && blueprint?.voiceoverScript) {
        setProgressPct(22);
        setProgressStage('Synthesizing neural AI voiceover narration...');
        try {
          const ttsRes = await fetch('/api/ai/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: blueprint.voiceoverScript,
              voice: 'Kore',
              style: 'Dramatic cinematic narrator',
            }),
          });
          const ttsData = await ttsRes.json();
          if (ttsData.ok && ttsData.audioDataUrl) {
            voiceAudioUrl = ttsData.audioDataUrl;
          }
        } catch {
          // Continue cleanly if TTS unavailable
        }
      }

      // Step 4: Try generating a custom AI Keyframe Image if no uploaded images
      let keyframeImages = [...uploadedImages];
      if (keyframeImages.length === 0) {
        try {
          const imgRes = await fetch('/api/ai/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: `${style} film frame: ${prompt}`,
              aspectRatio,
            }),
          });
          const imgData = await imgRes.json();
          if (imgData.ok && imgData.imageDataUrl) {
            keyframeImages = [imgData.imageDataUrl];
          }
        } catch {
          // Use high-res studio style assets + dynamic WebGL/Canvas layers
        }
      }
      if (keyframeImages.length === 0) {
        keyframeImages = getStyleReferenceImages(style);
      }

      // Step 5: Build Subtitle Cues
      const subtitles =
        includeSubtitles && blueprint?.scenes
          ? blueprint.scenes.map((sc) => ({
              start: sc.startTime,
              end: sc.endTime,
              text: sc.subtitleText,
            }))
          : [];

      // Step 6: Synthesize Full Duration (5s–30s) Video at Selected Aspect Ratio & Quality (480p–4K)
      const rendered = await synthesizeFreeStudioVideo({
        prompt,
        style,
        duration,
        aspectRatio,
        quality,
        cameraMotion,
        transition,
        blueprint,
        sourceImages: keyframeImages,
        subtitles,
        voiceAudioUrl,
        enableBgMusic: includeSoundtrack,
        musicMood: style === 'Anime' || style === 'Storybook' ? 'Epic Orchestral' : 'Cyberpunk Synth',
        onProgress: (pct, label) => {
          setProgressPct(pct);
          setProgressStage(label);
        },
      });

      const creation: VideoCreation = {
        id: `vid_${Date.now()}`,
        title: blueprint?.title || prompt.slice(0, 46) || `${style} Creation`,
        prompt,
        mode,
        style,
        duration,
        aspectRatio,
        quality,
        videoUrl: rendered.videoUrl,
        mimeType: rendered.mimeType,
        thumbnailUrl: rendered.thumbnailUrl,
        engineLabel: `AVINASH Free ${quality} Engine`,
        createdAt: new Date().toISOString(),
        voiceAudioUrl,
        subtitles,
        cameraMotion,
      };

      setCurrentCreation(creation);
      onSaveCreation(creation);
    } catch (err: any) {
      setErrorMsg(err?.message || 'An error occurred while generating the video.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadVideo = (creation: VideoCreation) => {
    const ext = creation.mimeType.includes('mp4') ? 'mp4' : 'webm';
    const a = document.createElement('a');
    a.href = creation.videoUrl;
    a.download = `AVINASH_AI_${creation.quality}_${creation.aspectRatio.replace(':', 'x')}_${creation.id}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pb-12 items-start">
      {/* Left Control Panel */}
      <div className="xl:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-white">
              {mode === 'text-to-video' ? 'AI Text-to-Video Studio' : 'AI Image-to-Video Animator'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {mode === 'text-to-video'
                ? 'Describe any scene and select duration, aspect ratio, and Ultra HD export clarity.'
                : 'Upload photos from your gallery and bring them to life with 3D camera motion & transitions.'}
            </p>
          </div>
          <div className="text-xs text-cyan-300 font-mono-num">
            Unlimited Free Tier Active
          </div>
        </div>

        {/* Image Upload Section (Primary for Image-to-Video, Optional Reference for Text-to-Video) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 tracking-wide">
              {mode === 'image-to-video'
                ? '1. Upload Source Images from Gallery (Required)'
                : 'Reference Image Frame (Optional)'}
            </label>
            {mode === 'image-to-video' && uploadedImages.length === 0 && (
              <button
                type="button"
                onClick={() => setUploadedImages([realisticFallback, heroFallback])}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Load Sample Gallery Frames
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-cyan-400/40 bg-cyan-500/5 hover:bg-cyan-500/10 text-xs font-medium text-cyan-200 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload Images (PNG / JPG / WEBP)</span>
            </button>

            {uploadedImages.map((src, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/15 group"
              >
                <img
                  src={src}
                  alt={`Uploaded frame ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() =>
                    setUploadedImages((prev) => prev.filter((_, itemIdx) => itemIdx !== idx))
                  }
                  className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity cursor-pointer"
                  title="Remove image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Prompt Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 tracking-wide">
              {mode === 'image-to-video' ? '2. Motion & Scene Direction Prompt' : '1. Video Prompt'}
            </label>
            <button
              type="button"
              onClick={handleEnhancePrompt}
              disabled={isEnhancingPrompt}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-300 hover:text-cyan-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEnhancingPrompt ? 'Enhancing with AI...' : 'AI Enhance Prompt'}</span>
            </button>
          </div>
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your scene, lighting, characters, and atmosphere..."
            className="w-full rounded-xl bg-[#070913] border border-white/15 focus:border-cyan-400 focus:outline-none p-3.5 text-sm text-white placeholder-slate-500 leading-relaxed"
          />
        </div>

        {/* Video Style Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-200 tracking-wide">
            Preferred Video Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {VIDEO_STYLES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStyle(st)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap truncate ${
                  style === st
                    ? 'bg-cyan-500/20 border border-cyan-400 text-white shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Duration & Quality Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Video Duration (5s to 30s) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200 tracking-wide">
              Video Duration
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {DURATIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDuration(d)}
                  className={`py-2 rounded-lg font-mono-num text-xs font-semibold transition-all cursor-pointer ${
                    duration === d
                      ? 'bg-indigo-500/30 border border-indigo-400 text-white'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* Ultra HD Video Quality (480p to 4K) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-200 tracking-wide">
              Export Video Quality
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {QUALITIES.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => setQuality(q.id)}
                  className={`py-2 px-1 rounded-lg font-mono-num text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    quality === q.id
                      ? 'bg-pink-500/25 border border-pink-400 text-white'
                      : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {q.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* All 6 Aspect Ratios with Visual Screen Shapes */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-200 tracking-wide">
            Video Screen Shape (Aspect Ratio)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ASPECT_RATIOS.map((ar) => {
              const isSelected = aspectRatio === ar.id;
              return (
                <button
                  key={ar.id}
                  type="button"
                  onClick={() => setAspectRatio(ar.id)}
                  className={`p-3 rounded-xl text-left transition-all cursor-pointer border flex items-center gap-3 ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_14px_rgba(34,211,238,0.2)]'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center shrink-0">
                    <motion.div
                      animate={isSelected ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      className={`${ar.boxClass} rounded-[3px] border-2 ${
                        isSelected
                          ? 'border-cyan-300 bg-cyan-400/25'
                          : 'border-slate-400/70 bg-white/5'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono-num text-xs font-bold">{ar.label}</div>
                    <div className="text-[11px] text-slate-400 truncate">{ar.platform}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Animated Camera Movement & Transition Previews */}
        <VisualMotionPreviews
          selectedCamera={cameraMotion}
          onSelectCamera={setCameraMotion}
          selectedTransition={transition}
          onSelectTransition={setTransition}
        />

        {/* AI Audio, Subtitles & Free Engine Toggles */}
        <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setIncludeVoiceover(!includeVoiceover)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
              includeVoiceover
                ? 'bg-cyan-500/15 border-cyan-400/60 text-cyan-200'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Volume2 className="w-4 h-4 shrink-0" />
            <span className="truncate">AI Voiceover</span>
          </button>

          <button
            type="button"
            onClick={() => setIncludeSubtitles(!includeSubtitles)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
              includeSubtitles
                ? 'bg-purple-500/15 border-purple-400/60 text-purple-200'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            <Subtitles className="w-4 h-4 shrink-0" />
            <span className="truncate">Auto Subtitles</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setEnginePreference(
                enginePreference === 'auto-hybrid' ? 'free-unlimited' : 'auto-hybrid'
              )
            }
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-200 text-xs font-medium cursor-pointer"
            title="Switch between Cloud Omni + Free Studio Hybrid or Instant Free Studio"
          >
            <Sparkles className="w-4 h-4 shrink-0" />
            <span className="truncate">
              {enginePreference === 'auto-hybrid' ? 'Hybrid Cloud + Free' : 'Direct Free Engine'}
            </span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 flex items-start gap-2.5 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Primary GENERATE VIDEO Button */}
        <button
          type="button"
          disabled={isGenerating}
          onClick={handleGenerateVideo}
          className="neon-cta-btn w-full py-4 rounded-xl font-display font-bold text-base text-white tracking-wide flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>GENERATING {quality} VIDEO ({progressPct}%)...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5" />
              <span>GENERATE VIDEO</span>
            </>
          )}
        </button>

        <div className="text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>Free unlimited generation &amp; 4K downloads included</span>
          <span className="font-mono-num">
            Cloud Veo/Omni: 5s–10s · Free Studio Engine: 5s–30s Unlimited
          </span>
        </div>
      </div>

      {/* Right Live Preview & Output Player */}
      <div className="xl:col-span-5 glass-panel neon-border-glow rounded-2xl p-6 sm:p-8 space-y-6 sticky top-24">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-white">Cinema Output Monitor</h2>
          <span className="font-mono-num text-xs text-cyan-300">
            {aspectRatio} · {quality} · {duration}s
          </span>
        </div>

        {/* Processing Progress Overlay or Video Viewport */}
        {isGenerating ? (
          <div className="rounded-xl bg-[#060812] border border-cyan-400/30 p-6 sm:p-8 flex flex-col items-center justify-center text-center min-h-[340px] space-y-5">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-2 border-cyan-400 border-t-transparent flex items-center justify-center"
            >
              <Film className="w-7 h-7 text-fuchsia-400" />
            </motion.div>

            <div className="space-y-1 max-w-xs">
              <div className="font-display font-bold text-lg text-white">
                Creating Your Video Step-by-Step
              </div>
              <p className="text-xs text-slate-300">{progressStage}</p>
            </div>

            {/* Easy-to-Understand 4-Stage Visual Progress Icons */}
            <div className="grid grid-cols-4 gap-2 w-full pt-1">
              {[
                { label: '1. Story', threshold: 5 },
                { label: '2. Voice', threshold: 20 },
                { label: '3. Motion', threshold: 35 },
                { label: '4. 4K Save', threshold: 85 },
              ].map((st, idx) => {
                const done = progressPct >= st.threshold;
                return (
                  <motion.div
                    key={idx}
                    animate={done ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`p-2 rounded-lg border text-[11px] font-semibold ${
                      done
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    {st.label}
                  </motion.div>
                );
              })}
            </div>

            <div className="w-full max-w-xs h-2.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="font-mono-num text-xs font-bold text-cyan-300">
              {progressPct}% Ready
            </div>
          </div>
        ) : currentCreation ? (
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-black border border-white/15 flex items-center justify-center max-h-[460px]">
              <video
                key={currentCreation.videoUrl}
                src={currentCreation.videoUrl}
                poster={currentCreation.thumbnailUrl}
                controls
                autoPlay
                loop
                playsInline
                className="max-h-[440px] w-auto max-w-full object-contain"
              />
            </div>

            {statusNotice && (
              <div className="text-[11px] text-cyan-200/90 bg-cyan-500/10 border border-cyan-400/25 rounded-lg px-3 py-2">
                {statusNotice}
              </div>
            )}

            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  {currentCreation.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono-num">
                  {currentCreation.style} · {currentCreation.aspectRatio} · {currentCreation.quality} ·{' '}
                  {currentCreation.duration}s
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleDownloadVideo(currentCreation)}
                className="neon-cta-btn py-3 px-4 rounded-xl font-display font-semibold text-xs text-white flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download {currentCreation.quality} Video</span>
              </button>

              {currentCreation.voiceAudioUrl && (
                <a
                  href={currentCreation.voiceAudioUrl}
                  download={`AVINASH_Voiceover_${currentCreation.id}.wav`}
                  className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 font-display font-semibold text-xs text-white flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-cyan-300" />
                  <span>Save Voice WAV</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-[#060812] border border-white/10 p-8 flex flex-col items-center justify-center text-center min-h-[320px] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              {mode === 'text-to-video' ? (
                <Play className="w-6 h-6 text-cyan-400" />
              ) : (
                <ImageIcon className="w-6 h-6 text-purple-400" />
              )}
            </div>
            <div className="space-y-1 max-w-xs">
              <div className="font-display font-semibold text-base text-white">
                Ready for Ultra HD Synthesis
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Configure your prompt, duration (5s–30s), aspect ratio, and quality on the left, then click{' '}
                <strong className="text-cyan-300">GENERATE VIDEO</strong>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
