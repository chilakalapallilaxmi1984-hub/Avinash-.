export type AppView =
  | 'dashboard'
  | 'text-to-video'
  | 'image-to-video'
  | 'editing-tools'
  | 'creations'
  | 'settings';

export type VideoStyleId =
  | 'Cinematic'
  | 'Realistic'
  | 'Anime'
  | 'Cartoon'
  | '3D Animation'
  | 'Cyberpunk'
  | 'Storybook'
  | 'Music Visualizer';

export type VideoDuration = 5 | 10 | 15 | 20 | 30;

export type AspectRatioOption = '9:16' | '16:9' | '1:1' | '4:5' | '3:4' | '21:9';

export type VideoQualityOption = '480p' | '720p' | '1080p' | '2K' | '4K';

export type CameraMovement =
  | 'Orbital Drone Sweep'
  | 'Slow Push-In'
  | 'Cinematic Crane Rise'
  | 'Dynamic Tracking Pan'
  | 'Handheld Action'
  | 'Macro Parallax';

export type TransitionType = 'Smooth Dissolve' | 'Neon Whip Pan' | 'Glitch Cut' | 'Light Leak';

export interface StoryboardScene {
  sceneNumber: number;
  startTime: number;
  endTime: number;
  visualDescription: string;
  cameraDirective: string;
  subtitleText: string;
  accentHex: string;
}

export interface StoryboardBlueprint {
  title: string;
  enhancedPrompt: string;
  voiceoverScript: string;
  colorPalette: string[];
  scenes: StoryboardScene[];
}

export interface SubtitleCue {
  start: number;
  end: number;
  text: string;
}

export interface VideoCreation {
  id: string;
  title: string;
  prompt: string;
  mode: 'text-to-video' | 'image-to-video' | 'story' | 'music-video' | 'edited';
  style: VideoStyleId;
  duration: VideoDuration;
  aspectRatio: AspectRatioOption;
  quality: VideoQualityOption;
  videoUrl: string;
  mimeType: string;
  thumbnailUrl: string;
  engineLabel: string;
  createdAt: string;
  voiceAudioUrl?: string;
  subtitles?: SubtitleCue[];
  cameraMotion?: CameraMovement;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  authMethod: 'email' | 'google' | 'guest';
  defaultQuality: VideoQualityOption;
  defaultAspectRatio: AspectRatioOption;
  autoDownload4K: boolean;
  watermarkEnabled: boolean;
  privateGallery: boolean;
  savePromptHistory: boolean;
}
