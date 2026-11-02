import {
  AspectRatioOption,
  CameraMovement,
  StoryboardBlueprint,
  SubtitleCue,
  TransitionType,
  VideoDuration,
  VideoQualityOption,
  VideoStyleId,
} from '../types';

export function getDimensionsForExport(
  aspectRatio: AspectRatioOption,
  quality: VideoQualityOption
): { width: number; height: number; bitrate: number } {
  // Base heights mapped to ultra-crisp canvas dimensions while keeping browser MediaRecorder smooth & reliable
  const baseScale: Record<VideoQualityOption, { shortSide: number; bitrate: number }> = {
    '480p': { shortSide: 480, bitrate: 3_500_000 },
    '720p': { shortSide: 720, bitrate: 6_500_000 },
    '1080p': { shortSide: 1080, bitrate: 12_000_000 },
    '2K': { shortSide: 1440, bitrate: 18_000_000 },
    '4K': { shortSide: 2160, bitrate: 28_000_000 },
  };

  const { shortSide, bitrate } = baseScale[quality] || baseScale['1080p'];

  // Cap canvas pixels slightly on mobile devices to prevent GPU OOM while preserving full 4K on desktop
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
  const effectiveShort = isMobile ? Math.min(shortSide, 1080) : Math.min(shortSide, 2160);

  const makeEven = (n: number) => Math.max(2, Math.round(n / 2) * 2);

  switch (aspectRatio) {
    case '9:16':
      return { width: makeEven(effectiveShort), height: makeEven((effectiveShort * 16) / 9), bitrate };
    case '16:9':
      return { width: makeEven((effectiveShort * 16) / 9), height: makeEven(effectiveShort), bitrate };
    case '1:1':
      return { width: makeEven(effectiveShort), height: makeEven(effectiveShort), bitrate };
    case '4:5':
      return { width: makeEven(effectiveShort), height: makeEven((effectiveShort * 5) / 4), bitrate };
    case '3:4':
      return { width: makeEven(effectiveShort), height: makeEven((effectiveShort * 4) / 3), bitrate };
    case '21:9':
      return { width: makeEven((effectiveShort * 21) / 9), height: makeEven(effectiveShort), bitrate };
    default:
      return { width: 1920, height: 1080, bitrate: 12_000_000 };
  }
}

export interface SynthEngineOptions {
  prompt: string;
  style: VideoStyleId;
  duration: VideoDuration;
  aspectRatio: AspectRatioOption;
  quality: VideoQualityOption;
  cameraMotion: CameraMovement;
  transition: TransitionType;
  blueprint?: StoryboardBlueprint;
  sourceImages?: string[];
  subtitles?: SubtitleCue[];
  voiceAudioUrl?: string;
  enableBgMusic?: boolean;
  musicMood?: 'Cyberpunk Synth' | 'Epic Orchestral' | 'Ambient Chill' | 'Electronic Pulse';
  slowMotionFactor?: number;
  cinematicFilter?: 'None' | 'Anamorphic Teal-Orange' | 'Neon Noir' | 'Anime Bloom' | 'Vintage 35mm';
  onProgress?: (percent: number, stageLabel: string) => void;
}

function loadImageElement(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

// Procedural ambient synth music generator hooked into AudioContext MediaStreamDestination
function startProceduralSoundtrack(
  audioCtx: AudioContext,
  dest: MediaStreamAudioDestinationNode,
  mood: string,
  durationSec: number
): () => void {
  const masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  masterGain.gain.linearRampToValueAtTime(0.18, audioCtx.currentTime + 0.8);
  masterGain.gain.setValueAtTime(0.18, Math.max(audioCtx.currentTime + 0.9, audioCtx.currentTime + durationSec - 1.0));
  masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + durationSec);
  masterGain.connect(dest);

  const chords: Record<string, number[]> = {
    'Cyberpunk Synth': [110, 164.81, 220, 261.63, 329.63],
    'Epic Orchestral': [98, 146.83, 196, 246.94, 293.66],
    'Ambient Chill': [130.81, 196, 246.94, 293.66, 392],
    'Electronic Pulse': [123.47, 185, 246.94, 329.63, 370],
  };

  const freqs = chords[mood] || chords['Cyberpunk Synth'];
  const oscillators: OscillatorNode[] = [];

  freqs.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    // Subtle detune chorus for rich futuristic analog sound
    osc.detune.setValueAtTime((idx - 2) * 7, audioCtx.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650 + idx * 240, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1600, audioCtx.currentTime + durationSec * 0.5);
    filter.frequency.exponentialRampToValueAtTime(550, audioCtx.currentTime + durationSec);

    oscGain.gain.value = 0.16 / freqs.length;

    osc.connect(filter);
    filter.connect(oscGain);
    oscGain.connect(masterGain);
    osc.start();
    oscillators.push(osc);
  });

  // Rhythmic sub-bass pulse
  const pulseInterval = window.setInterval(() => {
    if (audioCtx.state === 'closed') return;
    const kick = audioCtx.createOscillator();
    const kickGain = audioCtx.createGain();
    kick.type = 'sine';
    kick.frequency.setValueAtTime(115, audioCtx.currentTime);
    kick.frequency.exponentialRampToValueAtTime(38, audioCtx.currentTime + 0.22);

    kickGain.gain.setValueAtTime(0.22, audioCtx.currentTime);
    kickGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

    kick.connect(kickGain);
    kickGain.connect(masterGain);
    kick.start();
    kick.stop(audioCtx.currentTime + 0.26);
  }, mood === 'Electronic Pulse' ? 450 : 750);

  return () => {
    window.clearInterval(pulseInterval);
    oscillators.forEach((o) => {
      try {
        o.stop();
      } catch {
        // ignore
      }
    });
  };
}

export async function synthesizeFreeStudioVideo(
  options: SynthEngineOptions
): Promise<{ videoUrl: string; mimeType: string; thumbnailUrl: string }> {
  const {
    prompt,
    style,
    duration,
    aspectRatio,
    quality,
    cameraMotion,
    transition,
    blueprint,
    sourceImages = [],
    subtitles = [],
    voiceAudioUrl,
    enableBgMusic = true,
    musicMood = 'Cyberpunk Synth',
    slowMotionFactor = 1,
    cinematicFilter = 'None',
    onProgress,
  } = options;

  const { width, height, bitrate } = getDimensionsForExport(aspectRatio, quality);

  // Cap live synthesis wall-clock render time so 30s videos render smoothly and accurately
  const totalDurationSec = Number(duration);
  const fps = 30;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize Ultra HD 2D rendering context.');
  }

  onProgress?.(12, 'Loading high-resolution visual keyframes & textures...');
  const loadedImages = (await Promise.all(sourceImages.map((src) => loadImageElement(src)))).filter(
    (img): img is HTMLImageElement => img !== null
  );

  // Audio mixing setup (Voiceover + Procedural Soundtrack)
  let audioCtx: AudioContext | null = null;
  let audioDest: MediaStreamAudioDestinationNode | null = null;
  let stopSynthMusic: (() => void) | null = null;
  let voiceSource: AudioBufferSourceNode | null = null;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
      audioDest = audioCtx.createMediaStreamDestination();

      if (enableBgMusic) {
        stopSynthMusic = startProceduralSoundtrack(audioCtx, audioDest, musicMood, totalDurationSec);
      }

      if (voiceAudioUrl) {
        try {
          const resp = await fetch(voiceAudioUrl);
          const arrBuf = await resp.arrayBuffer();
          const decoded = await audioCtx.decodeAudioData(arrBuf);
          voiceSource = audioCtx.createBufferSource();
          voiceSource.buffer = decoded;
          const voiceGain = audioCtx.createGain();
          voiceGain.gain.value = 1.0;
          voiceSource.connect(voiceGain);
          voiceGain.connect(audioDest);
          voiceSource.start(0);
        } catch {
          // continue cleanly if audio decode fails
        }
      }
    }
  } catch {
    // fallback to silent video stream if browser restricts AudioContext
  }

  const canvasStream = canvas.captureStream(fps);
  if (audioDest) {
    audioDest.stream.getAudioTracks().forEach((track) => canvasStream.addTrack(track));
  }

  const candidateTypes = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
  ];
  const chosenMime =
    candidateTypes.find((t) => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) ||
    'video/webm';

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(canvasStream, {
    mimeType: chosenMime,
    videoBitsPerSecond: bitrate,
  });

  recorder.ondataavailable = (ev) => {
    if (ev.data && ev.data.size > 0) {
      chunks.push(ev.data);
    }
  };

  // Pre-build neon atmospheric particles
  const particleCount = 65;
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    x: (Math.sin(i * 78.233) * 0.5 + 0.5) * width,
    y: (Math.cos(i * 45.164) * 0.5 + 0.5) * height,
    r: (i % 4) + 1.5,
    vx: ((i % 7) - 3) * 0.55,
    vy: -(((i % 5) + 1) * 0.45),
    hue: [190, 265, 320, 215][i % 4],
  }));

  const palette =
    blueprint?.colorPalette && blueprint.colorPalette.length >= 3
      ? blueprint.colorPalette
      : style === 'Anime'
      ? ['#38bdf8', '#a855f7', '#f472b6', '#090d1e']
      : style === 'Cartoon'
      ? ['#06b6d4', '#f59e0b', '#ec4899', '#111827']
      : ['#00f0ff', '#7c3aed', '#ec4899', '#050711'];

  const scenes =
    blueprint?.scenes && blueprint.scenes.length > 0
      ? blueprint.scenes
      : [
          {
            sceneNumber: 1,
            startTime: 0,
            endTime: totalDurationSec / 2,
            visualDescription: prompt || 'Futuristic AI visual sequence',
            cameraDirective: cameraMotion,
            subtitleText: prompt.slice(0, 68),
            accentHex: palette[0],
          },
          {
            sceneNumber: 2,
            startTime: totalDurationSec / 2,
            endTime: totalDurationSec,
            visualDescription: `${style} climax shot with dramatic neon atmosphere`,
            cameraDirective: 'Dynamic Finale Sweep',
            subtitleText: '',
            accentHex: palette[1],
          },
        ];

  let thumbnailUrl = '';

  const renderFrame = (elapsedSec: number) => {
    const effectiveElapsed = elapsedSec / Math.max(0.25, slowMotionFactor);
    const normProgress = Math.min(1, elapsedSec / totalDurationSec);

    // Determine active scene
    const sceneIdx = Math.min(
      scenes.length - 1,
      Math.floor(normProgress * scenes.length)
    );
    const activeScene = scenes[sceneIdx];
    const sceneSpan = totalDurationSec / scenes.length;
    const localSceneTime = elapsedSec - sceneIdx * sceneSpan;
    const sceneProgress = Math.min(1, Math.max(0, localSceneTime / sceneSpan));

    ctx.save();

    // Optional Cinematic Color Grading Filter
    if (cinematicFilter === 'Anamorphic Teal-Orange') {
      ctx.filter = 'contrast(1.14) saturate(1.22)';
    } else if (cinematicFilter === 'Neon Noir') {
      ctx.filter = 'contrast(1.25) saturate(1.35) brightness(0.95)';
    } else if (cinematicFilter === 'Anime Bloom') {
      ctx.filter = 'saturate(1.42) brightness(1.06)';
    } else if (cinematicFilter === 'Vintage 35mm') {
      ctx.filter = 'sepia(0.18) contrast(1.1) saturate(1.1)';
    }

    // 1. Deep Atmospheric Base Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#05060d');
    bgGrad.addColorStop(0.5, '#0d1024');
    bgGrad.addColorStop(1, '#070510');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Render Source / Showcase Image with Real Camera Kinematics
    if (loadedImages.length > 0) {
      const activeImg = loadedImages[sceneIdx % loadedImages.length];
      const nextImg = loadedImages[(sceneIdx + 1) % loadedImages.length];

      const drawWithCamera = (img: HTMLImageElement, prog: number, alpha: number) => {
        ctx.save();
        ctx.globalAlpha = alpha;

        let scale = 1.08;
        let offsetX = 0;
        let offsetY = 0;

        if (cameraMotion === 'Slow Push-In') {
          scale = 1.02 + prog * 0.18;
        } else if (cameraMotion === 'Orbital Drone Sweep') {
          scale = 1.14 + Math.sin(prog * Math.PI) * 0.06;
          offsetX = Math.cos(prog * Math.PI) * (width * 0.04);
          offsetY = Math.sin(prog * Math.PI * 0.5) * (height * 0.02);
        } else if (cameraMotion === 'Cinematic Crane Rise') {
          scale = 1.12;
          offsetY = (0.5 - prog) * (height * 0.07);
        } else if (cameraMotion === 'Dynamic Tracking Pan') {
          scale = 1.15;
          offsetX = (0.5 - prog) * (width * 0.08);
        } else if (cameraMotion === 'Handheld Action') {
          scale = 1.12;
          offsetX = Math.sin(effectiveElapsed * 6.5) * (width * 0.012);
          offsetY = Math.cos(effectiveElapsed * 5.2) * (height * 0.012);
        } else {
          scale = 1.06 + prog * 0.14;
        }

        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let drawW = width * scale;
        let drawH = height * scale;

        if (imgRatio > canvasRatio) {
          drawH = height * scale;
          drawW = drawH * imgRatio;
        } else {
          drawW = width * scale;
          drawH = drawW / imgRatio;
        }

        const x = (width - drawW) / 2 + offsetX;
        const y = (height - drawH) / 2 + offsetY;
        ctx.drawImage(img, x, y, drawW, drawH);
        ctx.restore();
      };

      drawWithCamera(activeImg, sceneProgress, 1);

      // Cross-dissolve or Whip transition near scene boundary
      if (loadedImages.length > 1 && sceneProgress > 0.82 && sceneIdx < scenes.length - 1) {
        const blend = (sceneProgress - 0.82) / 0.18;
        drawWithCamera(nextImg, blend * 0.2, blend);
      }
    } else {
      // Dynamic Volumetric Aurora & 3D Perspective Grid when no base image
      const orb1X = width * (0.3 + 0.22 * Math.cos(effectiveElapsed * 0.7));
      const orb1Y = height * (0.38 + 0.18 * Math.sin(effectiveElapsed * 0.6));
      const rad1 = Math.max(width, height) * 0.55;
      const g1 = ctx.createRadialGradient(orb1X, orb1Y, 10, orb1X, orb1Y, rad1);
      g1.addColorStop(0, `${activeScene.accentHex || palette[0]}66`);
      g1.addColorStop(0.5, `${palette[1]}33`);
      g1.addColorStop(1, 'transparent');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, width, height);

      // Futuristic horizon grid
      ctx.save();
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.22)';
      ctx.lineWidth = Math.max(1, width * 0.0012);
      const horizonY = height * 0.62;
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath();
        ctx.moveTo(width * 0.5 + i * (width * 0.03), horizonY);
        ctx.lineTo(width * 0.5 + i * (width * 0.16), height);
        ctx.stroke();
      }
      const gridOffset = (effectiveElapsed * 45) % 40;
      for (let row = 0; row < 10; row++) {
        const y = horizonY + Math.pow((row + gridOffset / 40) / 10, 2) * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 3. Atmospheric Light Leaks & Transition Flash
    if (transition === 'Light Leak' && sceneProgress > 0.86) {
      const leakAlpha = Math.sin(((sceneProgress - 0.86) / 0.14) * Math.PI) * 0.55;
      const leakGrad = ctx.createRadialGradient(width * 0.8, height * 0.2, 10, width * 0.8, height * 0.2, width * 0.9);
      leakGrad.addColorStop(0, `rgba(236, 72, 153, ${leakAlpha})`);
      leakGrad.addColorStop(0.5, `rgba(34, 211, 238, ${leakAlpha * 0.6})`);
      leakGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = leakGrad;
      ctx.fillRect(0, 0, width, height);
    } else if (transition === 'Neon Whip Pan' && sceneProgress > 0.9) {
      const flash = Math.sin(((sceneProgress - 0.9) / 0.1) * Math.PI) * 0.45;
      ctx.fillStyle = `rgba(34, 211, 238, ${flash})`;
      ctx.fillRect(0, 0, width, height);
    }

    // 4. Floating Neon Particles
    particles.forEach((p) => {
      const px = (p.x + p.vx * effectiveElapsed * 45 + width * 4) % width;
      const py = (p.y + p.vy * effectiveElapsed * 45 + height * 4) % height;
      const glow = 0.45 + 0.4 * Math.sin(effectiveElapsed * 3 + p.x);

      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 95%, 68%, ${glow})`;
      ctx.shadowColor = `hsla(${p.hue}, 95%, 65%, 0.85)`;
      ctx.shadowBlur = 12;
      ctx.arc(px, py, p.r * (width / 1280), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // 5. Measured Scrim for Cinema Contrast & Anamorphic Framing
    const bottomScrim = ctx.createLinearGradient(0, height * 0.58, 0, height);
    bottomScrim.addColorStop(0, 'rgba(0,0,0,0)');
    bottomScrim.addColorStop(1, 'rgba(3, 5, 12, 0.82)');
    ctx.fillStyle = bottomScrim;
    ctx.fillRect(0, height * 0.58, width, height * 0.42);

    // 6. Render Active Subtitles if Enabled
    const activeCue =
      subtitles.find((c) => elapsedSec >= c.start && elapsedSec <= c.end) ||
      (subtitles.length === 0 && activeScene.subtitleText
        ? { start: 0, end: totalDurationSec, text: activeScene.subtitleText }
        : null);

    if (activeCue && activeCue.text) {
      const fontSize = Math.max(18, Math.round(Math.min(width, height) * 0.036));
      ctx.font = `600 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      const maxLineWidth = width * 0.82;
      const words = activeCue.text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (ctx.measureText(testLine).width > maxLineWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }
      if (currentLine) lines.push(currentLine);

      const bottomY = height - Math.max(36, height * 0.075);
      lines.reverse().forEach((line, idx) => {
        const ly = bottomY - idx * (fontSize * 1.32);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.lineWidth = Math.max(4, fontSize * 0.18);
        ctx.lineJoin = 'round';
        ctx.strokeText(line, width / 2, ly);

        ctx.fillStyle = '#ffffff';
        ctx.fillText(line, width / 2, ly);
      });
    }

    ctx.restore();
  };

  // Capture crisp poster thumbnail at 1.2s mark before starting recorder
  renderFrame(Math.min(1.2, totalDurationSec * 0.25));
  thumbnailUrl = canvas.toDataURL('image/jpeg', 0.86);

  return new Promise((resolve, reject) => {
    recorder.onerror = () => {
      if (stopSynthMusic) stopSynthMusic();
      if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
      reject(new Error('Video encoder encountered an error.'));
    };

    recorder.onstop = async () => {
      if (stopSynthMusic) stopSynthMusic();
      if (audioCtx && audioCtx.state !== 'closed') {
        try {
          await audioCtx.close();
        } catch {
          // ignore
        }
      }
      const finalBlob = new Blob(chunks, { type: chosenMime });
      const dataUrl = await blobToDataUrl(finalBlob);
      onProgress?.(100, 'Ultra HD video ready!');
      resolve({
        videoUrl: dataUrl,
        mimeType: chosenMime,
        thumbnailUrl,
      });
    };

    recorder.start(250);
    const startWall = performance.now();

    const tick = () => {
      const elapsedSec = (performance.now() - startWall) / 1000;
      if (elapsedSec >= totalDurationSec) {
        renderFrame(totalDurationSec);
        if (recorder.state === 'recording') {
          recorder.stop();
        }
        return;
      }

      renderFrame(elapsedSec);
      const pct = Math.min(98, Math.round(18 + (elapsedSec / totalDurationSec) * 80));
      onProgress?.(
        pct,
        `Rendering ${quality} (${width}×${height}) · ${elapsedSec.toFixed(1)}s / ${totalDurationSec}s`
      );
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}
